<template>
  <div class="editointi-container">
    <ep-spinner
      v-if="!store || !store.data"
      class="mt-5"
    />
    <div
      v-else
      class="editointikontrolli"
    >
      <div
        v-if="!hasFooterSlot"
        v-sticky="isEditing"
        sticky-offset="{ top: 56 }"
        sticky-z-index="600"
      >
        <template v-if="hasCustomHeaderSlot">
          <slot
            name="customheader"
            :is-editing="isEditing"
            :support-data="innerSupport"
            :data="inner"
            :cancel="cancel"
            :save="save"
            :disabled="disabled"
            :validation="validation.inner"
            :is-saving="isSaving"
            :modify="modify"
            :remove="remove"
            :editable="features.editable"
          />
        </template>
        <div
          v-else
          class="ylapaneeli d-print-none"
        >
          <div
            class="d-flex align-items-center flex-md-row flex-column justify-content-between"
            :class="{ container: useContainer }"
          >
            <div class="d-flex flex-wrap flex-xl-nowrap align-items-center justify-content-between">
              <div
                v-if="inner"
                class="headerline"
              >
                <slot
                  name="header"
                  :is-editing="isEditing"
                  :data="inner"
                  :support-data="innerSupport"
                  :validation="validation.inner"
                />
              </div>
              <div
                v-if="!isEditing"
                class="muokattu text-nowrap"
              >
                <slot
                  name="postHeader"
                  :data="inner"
                />
                <slot
                  name="additionalInfo"
                  :data="inner"
                />
                <span
                  v-if="latest"
                  class="text-truncate"
                >{{ $t('muokattu') }}: {{ $sdt(latest.pvm) }}, {{ nimi }}</span>
              </div>
            </div>
            <div>
              <div
                v-if="!versiohistoriaVisible"
                class="floating-editing-buttons d-flex align-items-center"
              >
                <ep-button
                  v-if="isEditing"
                  class="ml-4"
                  :disabled="disabled"
                  variant="link"
                  @click="cancel()"
                >
                  <slot name="peruuta">
                    {{ $t('peruuta') }}
                  </slot>
                </ep-button>
                <ep-button
                  v-if="isEditing"
                  class="ml-4"
                  :disabled="disabled || (validation && validation.$invalid)"
                  variant="primary"
                  :show-spinner="isSaving"
                  :help="saveHelpText"
                  @click="save()"
                >
                  <slot name="tallenna">
                    {{ $t('tallenna') }}
                  </slot>
                </ep-button>
                <b-dropdown
                  v-if="isEditing && !disabled && (features.removable || features.hideable)"
                  class="mx-4"
                  size="md"
                  variant="link"
                  :disabled="disabled"
                  toggle-class="text-decoration-none"
                  no-caret="no-caret"
                  right
                >
                  <template #button-content>
                    <EpMaterialIcon>more_horiz</EpMaterialIcon>
                  </template>
                  <b-dropdown-item
                    key="poista"
                    :disabled="!features.removable || disabled"
                    @click="remove()"
                  >
                    <slot name="poista">
                      {{ poistoteksti }}
                    </slot>
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="!hidden && features.hideable"
                    key="piilota"
                    :disabled="disabled"
                    @click="hide()"
                  >
                    <slot name="piilota">
                      {{ $t('piilota') }}
                    </slot>
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="hidden"
                    key="palauta"
                    :disabled="!features.hideable || disabled"
                    @click="unHide()"
                  >
                    <slot name="palauta">
                      {{ $t('palauta') }}
                    </slot>
                  </b-dropdown-item>
                </b-dropdown>
                <div
                  v-if="currentLock && features.lockable"
                  class="d-flex align-items-center ml-2 mr-2"
                >
                  <div>
                    <EpMaterialIcon
                      class="mr-1"
                      :color="'#555'"
                    >
                      lock
                    </EpMaterialIcon>
                    {{ $t('sivu-lukittu') }}
                  </div>
                  <div class="flex-grow-1 ml-3">
                    <div>
                      {{ currentLock.haltijaNimi || currentLock.haltijaOid }}
                    </div>
                    <div class="text-muted">
                      {{ $t('vapautuu') }}: {{ $ago(currentLock.vanhentuu) }}
                    </div>
                  </div>
                </div>
                <template v-else-if="!isEditing && features.editable && !versiohistoriaVisible">
                  <slot name="muokkaa-content" :data="inner">
                    <ep-button id="editointi-muokkaus"
                               variant="link"
                               icon="edit"
                               v-oikeustarkastelu="muokkausOikeustarkastelu"
                               @click="modify()"
                               :show-spinner="isSaving || loading"
                               :disabled="disabled">
                      <slot name="muokkaa">{{ $t('muokkaa') }}</slot>
                    </ep-button>
                  </slot>
                </template>
                <div
                  v-else-if="!isEditing && features.copyable"
                  v-oikeustarkastelu="muokkausOikeustarkastelu"
                >
                  <slot
                    name="kopioi"
                    :data="inner"
                    :support-data="innerSupport"
                  >
                    <ep-button
                      id="editointi-kopiointi"
                      v-oikeustarkastelu="muokkausOikeustarkastelu"
                      variant="link"
                      icon="edit"
                      :show-spinner="isSaving"
                      :disabled="disabled"
                      @click="copy()"
                    >
                      <slot name="kopioi-teksti">
                        {{ $t('kopioi-muokattavaksi') }}
                      </slot>
                    </ep-button>
                  </slot>
                </div>
                <span
                  v-else-if="muokkausEiSallittu"
                  class="disabled-text"
                >
                  {{ $t('muokkausta-ei-sallittu') }}
                </span>
                <b-dropdown
                  v-if="katseluDropDownValinnatVisible"
                  v-oikeustarkastelu="{ oikeus: 'luku' }"
                  class="mx-4"
                  size="md"
                  variant="link"
                  :disabled="disabled"
                  toggle-class="text-decoration-none"
                  no-caret="no-caret"
                  right
                >
                  <template #button-content>
                    <EpMaterialIcon>more_horiz</EpMaterialIcon>
                  </template>
                  <b-dropdown-item
                    v-if="features.removable && !disabled"
                    key="poista"
                    v-oikeustarkastelu="muokkausOikeustarkastelu"
                    @click="remove()"
                  >
                    <slot name="poista">
                      {{ poistoteksti }}
                    </slot>
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="!hidden && features.hideable && !disabled"
                    key="piilota"
                    v-oikeustarkastelu="muokkausOikeustarkastelu"
                    @click="hide()"
                  >
                    <slot name="piilota">
                      {{ $t('piilota') }}
                    </slot>
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="hidden && features.hideable && !disabled"
                    key="palauta"
                    v-oikeustarkastelu="muokkausOikeustarkastelu"
                    @click="unHide()"
                  >
                    <slot name="palauta">
                      {{ $t('palauta') }}
                    </slot>
                  </b-dropdown-item>
                  <b-dropdown-item :disabled="!features.previewable || disabled">
                    {{ $t('esikatsele-sivua') }}
                  </b-dropdown-item>
                  <b-dropdown-item v-if="store.validate && !disabled">
                    {{ $t('validoi') }}
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="features.recoverable"
                    :disabled="!historia || disabled"
                  >
                    <ep-versio-modaali
                      :value="current"
                      :versions="historia"
                      :current="current"
                      :per-page="10"
                      @restore="restore($event)"
                    />
                  </b-dropdown-item>
                </b-dropdown>
                <ep-round-button
                  v-if="hasKeskusteluSlot"
                  id="editointi-muokkaus-comments"
                  class="ml-2"
                  :disabled="disabled"
                  icon="comment"
                  variant="lightblue fa-flip-horizontal"
                  @click="toggleSidebarState(1)"
                />
                <ep-round-button
                  v-if="hasOhjeSlot"
                  id="editointi-muokkaus-question"
                  class="ml-2"
                  :disabled="disabled"
                  icon="question_mark"
                  variant="green"
                  @click="toggleSidebarState(2)"
                />
                <ep-round-button
                  v-if="hasPerusteSlot"
                  class="ml-2"
                  :disabled="disabled"
                  icon="account_balance"
                  variant="pink"
                  @click="toggleSidebarState(3)"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="versiohistoriaVisible"
          class="d-flex align-items-center versiohistoria"
        >
          <div class="headerline">
            <span>{{ $t('muokkaushistoria') }}: {{ $t('versionumero') }} {{ versionumero }}</span>
          </div>
          <div class="flex-fill">
            <ep-pagination
              :model-value="versionumero"
              :total-rows="versions"
              :per-page="1"
              :hide-goto-end-buttons="true"
              size="sm"
              class="mb-0"
              @update:model-value="updateVersionumero"
            >
              <template #prev-text>
                <EpMaterialIcon>chevron_left</EpMaterialIcon>
              </template>
              <template #next-text>
                <EpMaterialIcon>chevron_right</EpMaterialIcon>
              </template>
            </ep-pagination>
          </div>
          <div class="floating-editing-buttons">
            <ep-button
              variant="link"
              icon="menu"
            >
              <ep-versio-modaali
                :versions="historia"
                :current="current"
                :per-page="10"
                @restore="restore($event)"
              >
                {{ $t('palaa-listaan') }}
              </ep-versio-modaali>
            </ep-button>
            <ep-button
              variant="link"
              icon="keyboard_return"
              @click="restore({ numero: current.numero, routePushLatest: true })"
            >
              {{ $t('palauta-tama-versio') }}
            </ep-button>
            <div class="btn">
              <router-link :to="{ query: {} }">
                <EpMaterialIcon
                  :background="'inherit'"
                  :color="'inherit'"
                >
                  close
                </EpMaterialIcon>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div v-if="inner">
        <div class="threads">
          <div class="actual-content">
            <div
              v-if="hasInfoSlotContent"
              class="info d-flex"
            >
              <EpMaterialIcon
                class="mr-1"
                :color="'#2a2a2a'"
              >
                info
              </EpMaterialIcon>
              <slot name="info" />
            </div>
            <div class="sisalto">
              <slot
                :is-editing="isEditing"
                :support-data="innerSupport"
                :data="inner"
                :validation="validation.inner"
                :is-copyable="features.copyable"
              />
            </div>
          </div>
          <div
            v-if="hasKeskusteluSlot && sidebarState === 1"
            class="rightbar rb-keskustelu"
          >
            <div class="rbheader">
              <b>{{ $t('keskustelu') }}</b>
            </div>
            <div class="rbcontent">
              <slot
                name="keskustelu"
                :is-editing="isEditing"
                :support-data="innerSupport"
                :data="inner"
                :validation="validation.inner"
              />
            </div>
          </div>
          <div
            v-if="hasOhjeSlot && sidebarState === 2"
            class="rightbar rb-ohje"
          >
            <div class="rbheader">
              <b>{{ $t('ohje') }}</b>
            </div>
            <div class="rbcontent">
              <slot
                name="ohje"
                :is-editing="isEditing"
                :support-data="innerSupport"
                :validation="validation.inner"
                :data="inner"
              />
            </div>
          </div>
          <div
            v-if="hasPerusteSlot && sidebarState === 3"
            class="rightbar rb-peruste"
          >
            <div class="rbheader">
              <b>{{ $t('perusteen-teksti') }}</b>
            </div>
            <div class="rbcontent">
              <slot
                name="peruste"
                :is-editing="isEditing"
                :support-data="innerSupport"
                :validation="validation.inner"
                :data="inner"
              />
            </div>
          </div>
        </div>
      </div>
      <template v-if="hasFooterSlot">
        <div
          v-if="inner"
          class="alapaneeli py-3 px-2"
        >
          <slot
            name="footer"
            :is-editing="isEditing"
            :support-data="innerSupport"
            :data="inner"
            :cancel="cancel"
            :save="save"
            :disabled="disabled"
            :validation="validation.inner"
            :is-saving="isSaving"
            :modify="modify"
            :remove="remove"
            :editable="features.editable"
          />
        </div>
        <EpSpinner v-else />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { EditointiStore } from './EditointiStore';
import { setItem, getItem } from '../../utils/localstorage';
import { Revision } from '../../tyypit';
import EpVersioModaali from './EpVersioModaali.vue';
import '@shared/stores/kieli';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpRoundButton from '@shared/components/EpButton/EpRoundButton.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { parsiEsitysnimi } from '@shared/utils/kayttaja';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { useSlots } from 'vue';
import { $t, $sdt, $ago, $success, $fail, $bvModal } from '@shared/utils/globals';
import { useVuelidate } from '@vuelidate/core';
import EpPagination from '@shared/components/EpPagination/EpPagination.vue';

const props = defineProps({
  store: {
    type: Object as () => EditointiStore,
    required: true,
  },
  type: {
    type: String,
    required: false,
    default: null,
  },
  versionumero: {
    type: Number,
    required: false,
    default: null,
  },
  labelRestoreSuccess: {
    type: String,
    default: 'palautus-onnistui',
  },
  labelRestoreFail: {
    type: String,
    default: 'palautus-epaonnistui',
  },
  labelSaveSuccess: {
    type: String,
    default: 'tallennus-onnistui',
  },
  labelSaveFail: {
    type: String,
    default: 'tallennus-epaonnistui',
  },
  labelRemove: {
    type: String,
    default: 'poista',
  },
  labelRemoveClarification: {
    type: String,
    required: false,
  },
  labelRemoveConfirm: {
    type: String,
    default: 'tata-toimintoa-ei-voida-perua',
  },
  labelRemoveSuccess: {
    type: String,
    default: 'poisto-onnistui',
  },
  labelRemoveFail: {
    type: String,
    default: 'poisto-epaonnistui',
  },
  labelHideSuccess: {
    type: String,
    default: 'piilotus-onnistui',
  },
  labelHideFail: {
    type: String,
    default: 'piilotus-epaonnistui',
  },
  labelUnHideSuccess: {
    type: String,
    default: 'palautus-onnistui',
  },
  labelUnHideFail: {
    type: String,
    default: 'palautus-epaonnistui',
  },
  labelCopyConfirm: {
    type: String,
    default: 'kopio-varmistus',
  },
  labelCopyTopic: {
    type: String,
    default: 'varmista-kopiointi',
  },
  labelCopyConfirmButton: {
    type: String,
    default: 'kopioi',
  },
  labelCopySuccess: {
    type: String,
    default: 'kopion-luonti-onnistui',
  },
  labelCopyFail: {
    type: String,
    default: 'kopion-luonti-epaonnistui',
  },
  preModify: {
    type: Function,
    required: false,
  },
  allowCancel: {
    type: Function,
    required: false,
  },
  allowSave: {
    type: Function,
    required: false,
  },
  postSave: {
    type: Function,
    required: false,
  },
  postRemove: {
    type: Function,
    required: false,
  },
  useContainer: {
    type: Boolean,
    required: false,
    default: false,
  },
  confirmRemove: {
    type: Boolean,
    required: false,
    default: true,
  },
  confirmCopy: {
    type: Boolean,
    required: false,
    default: true,
  },
  muokkausOikeustarkastelu: {
    type: Object,
    required: false,
    default: () => ({
      oikeus: 'muokkaus',
    }),
  },
  skipRedirectBack: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(['input']);

const instance = getCurrentInstance() as any;

const router = useRouter();
const route = useRoute();
const slots = useSlots();

const sidebarState = ref(0);
const state = ref(null);
const isInitialized = ref(false);
const isValidating = ref(false);
const currentPage = ref(1);

watch(() => props.store, async () => {
  if (props.store) {
    await props.store.clear();
    await props.store.init();
    isInitialized.value = true;
    const sidebarStateData = await getItem('ep-editointi-sidebar-state') as any;
    if (sidebarStateData) {
      sidebarState.value = sidebarStateData.value;
    }
  }
}, { immediate: true });

watch(() => props.store?.data?.value, (newValue) => {
  if (newValue) {
    emit('input', newValue);
  }
});

const updateVersionumero = (versionumero: number) => {
  router.push({ query: { versionumero } }).catch(() => {});
};

const inner = computed(() => {
  if (props.store && props.store.data) {
    return props.store.data;
  }
  return null;
});

const innerSupport = computed(() => {
  if (props.store && props.store.supportData) {
    return props.store.supportData;
  }
  return null;
});

const errorValidationData = computed(() => inner || null);

const hasPreview = computed(() => props.store.hasPreview || false);

const currentLock = computed(() => props.store.currentLock || null);

const isSaving = computed(() => props.store.isSaving || false);

const isEditable = computed(() => features.editable || false);

const validator = computed(() => ({ inner: props.store.validator || null }));

const isEditing = computed(() =>  props.store.isEditing || false);

const revisions = computed(() => props.store.revisions || []);

const features = computed(() => props.store.features || {});

const disabled = computed(() => props.store.disabled || false);

const loading = computed(() => props.store.isLoading);

const validation = useVuelidate(validator.value, { inner }, { $stopPropagation: true } );

const historia = computed(() => {
  const revs = revisions.value || [];
  return _.map(revs, (rev, index: number) => ({
    ...rev,
    index: revs.length - index,
  } as Revision & { index: number }));
});

const latest = computed(() => _.first(historia.value) || null);

const versions = computed(() => historia.value.length - 1); // Ei näytetä nykyistä versiota

const hidden = computed(() => features.value.isHidden || false);

const nimi = computed(() => {
  if (latest.value) {
    return parsiEsitysnimi(latest.value.kayttajanTieto) || parsiEsitysnimi(latest.value);
  }
  return '';
});

const poistoteksti = computed(() => {
  if (!props.type) {
    return $t(props.labelRemove);
  }
  return $t('poista-' + props.type);
});

const katseluDropDownValinnatVisible = computed(() =>
  !isEditing.value
  && !disabled.value
  && (features.value.recoverable || features.value.removable || features.value.hideable)
  && !versiohistoriaVisible.value
);

const muokkausEiSallittu = computed(() =>
  !isEditing.value
  && latest.value
  && !features.value.editable
);

const current = computed(() => {
  if (!_.isEmpty(historia.value)) {
    if (props.versionumero) {
      const current = historia.value[historia.value.length - props.versionumero];
      if (current) {
        return current;
      }
      else {
        // Poistetaan ei olemassa oleva versionumero tilasta
        let query = _.assign({}, route.query);
        delete query.versionumero;
        router.replace({ query });
        return null;
      }
    }
    else {
      return latest.value;
    }
  }
  return null;
});

const versiohistoriaVisible = computed(() =>
  current.value && current.value !== latest.value
);

const hasKeskusteluSlot = computed(() => !!slots.keskustelu);

const hasPerusteSlot = computed(() => !!slots.peruste);

const hasOhjeSlot = computed(() => !!slots.ohje);

const hasInfoSlotContent = computed(() => !!slots.info);

const hasFooterSlot = computed(() => !!slots.footer);

const hasCustomHeaderSlot = computed(() => !!slots.customheader);

const saveHelpText = computed(() => {
  if (disabled.value) {
    return 'tallenna-kaynnissa';
  }
  else if (disabled.value) {
    return 'tallenna-tila-virhe-ohje';
  }
  else if (validation.value?.$invalid) {
    return 'tallenna-validointi-virhe-ohje';
  }
  else {
    return '';
  }
});

const toggleSidebarState = (val: number) => {
  if (val === sidebarState.value) {
    sidebarState.value = 0;
  }
  else {
    sidebarState.value = val;
  }
  setItem('ep-editointi-sidebar-state', {
    value: sidebarState.value,
  });
};

const vahvista = async (title: string, okTitle: string, label?: string) => {
  let modalContent = [
    instance?.proxy?.$createElement('strong', $t(props.labelRemoveConfirm) as string),
  ];
  if (label) {
    modalContent = [
      instance?.proxy?.$createElement('div', label),
      instance?.proxy?.$createElement('br', ''),
      ...modalContent,
    ];
  }

  const vahvistusSisalto = instance?.proxy?.$createElement('div', {}, modalContent).children;
  return $bvModal?.msgBoxConfirm((vahvistusSisalto as any), {
    title: title,
    okVariant: 'primary',
    okTitle: okTitle as any,
    cancelVariant: 'link',
    cancelTitle: $t('peruuta') as any,
    centered: true,
    ...{} as any,
  });
};

const remove = async () => {
  try {
    if (!props.confirmRemove || await vahvista($t('varmista-poisto') as string, $t('poista') as string, props.labelRemoveClarification ? $t(props.labelRemoveClarification) as string : undefined)) {
      const poistoTeksti = $t(props.labelRemoveSuccess);
      await props.store.remove();
      $success(poistoTeksti as string);

      if (props.postRemove) {
        await props.postRemove();
      }
    }
  }
  catch (err) {
    $fail($t(props.labelRemoveFail) as string);
  }
};

const copy = async () => {
  try {
    if (!props.confirmCopy || await vahvista(
        $t(props.labelCopyTopic) as string,
        $t(props.labelCopyConfirmButton) as string,
        $t(props.labelCopyConfirm) as string)) {
      await props.store.copy();
      if (props.confirmCopy) {
        $success($t(props.labelCopySuccess) as string);
      }
    }
  }
  catch (err) {
    $fail($t(props.labelCopyFail) as string);
  }
};

const restore = async (ev: any) => {
  try {
    await props.store.restore(ev);
    $success($t(props.labelRestoreSuccess) as string);
  }
  catch (err) {
    $fail($t(props.labelRestoreFail) as string);
  }
};

const save = async () => {
  try {
    if (!props.allowSave || await props.allowSave()) {
      await props.store.save();
      if (props.postSave) {
        await props.postSave();
      }
      $success($t(props.labelSaveSuccess) as string);
    }
  }
  catch (err) {
    $fail($t(props.labelSaveFail) as string);
    console.log(err);
  }
};

const cancel = async () => {
  if (!props.allowCancel || await props.allowCancel()) {
    props.store.cancel(props.skipRedirectBack);
  }
};

const hide = async () => {
  try {
    await props.store.hide();
    $success($t(props.labelHideSuccess) as string);
  }
  catch (err) {
    $fail($t(props.labelHideFail) as string);
  }
};

const unHide = async () => {
  try {
    await props.store.unHide();
    $success($t(props.labelUnHideSuccess) as string);
  }
  catch (err) {
    $fail($t(props.labelUnHideFail) as string);
  }
};

const modify = async () => {
  if (props.preModify) {
    await props.preModify();
  }
  props.store.start();
};
</script>

<style scoped lang="scss">
@import '../../styles/variables';

.info {
  background: $blue-lighten-9;
  border: $blue-lighten-10 solid 1px;
  padding: 20px;
}

.icon {
  vertical-align: bottom;
}

.editointikontrolli {
  .ylapaneeli {
    background: #fff;
    border-bottom: 1px solid #E7E7E7;
    padding: 10px 15px 5px 15px;

    .headerline {
      padding-right: 50px;
    }

    .upper-buttons {
      min-width: 240px;
    }

    .muokattu, .muokkaaja {
      color: #555;
      margin-right: 20px;
      font-size: 0.85rem;
    }

    @media (max-width: 767.98px) {
        .muokkaus-container {
          width:100%;
          border-top: 1px solid #E7E7E7;
        }
    }

  }

  .alapaneeli {
    background: #fff;
    border-top: 1px solid #E7E7E7;
  }

  .versiohistoria {
    background-color: #E6F6FF;
    border-bottom: 1px solid #E7E7E7;
    padding: 2px 15px;
    color: #2B2B2B;

    .headerline {
      padding-right: 50px;
    }

    :deep(.pagination .page-item) {
      &.active {
        .page-link {
          font-weight: 600;
          color: #575757;
        }
      }

      &.disabled {
        .page-link {
          color: #575757;
        }
      }

      & .page-link {
        background-color: transparent;
        border: none;
        color: #3367E3;
        font-weight: 400;
        font-size: 1rem;
      }
    }
  }

  .sisalto {
    margin-bottom: 5px;
    padding: 15px;
  }

  .threads {
    height: 100%;
    display: flex;

    .rightbar {
      border-left: 1px solid #eee;
      min-width: 460px;
      max-width: 460px;
      min-height: 100vh;
      height: 100%;

      .rbheader {
        padding: 20px;
      }

      .rbcontent {
        min-height: 100vh;
        height: 100%;
        font-size: 80%;
      }
    }

    .rb-ohje {
      .rbheader { background: #fcddf9; }
      .rbcontent { background: #fbf1fa; }
    }

    .rb-keskustelu {
      .rbheader { background: #ccd9f8; }
      .rbcontent { background: #f2f5fd; }
    }

    .rb-peruste {
      .rbheader { background: #d4ebdc; }
      .rbcontent { background: #f4faf6; }
    }

    .actual-content {
      width: 100%;
    }
  }
}
</style>
