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
        v-sticky="isEditing ? { top: 56, zIndex: 600 } : undefined"
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
          class="ylapaneeli print:hidden py-3 px-5"
        >
          <div
            class="flex items-center justify-between"
            :class="{ container: useContainer }"
          >
            <div class="flex flex-wrap flex-xl-nowrap items-center justify-between">
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
                class="muokattu whitespace-nowrap"
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
                  class="truncate"
                >{{ $t('muokattu') }}: {{ $sdt(latest.pvm) }}, {{ nimi }}</span>
              </div>
            </div>
            <div>
              <div
                v-if="!versiohistoriaVisible"
                class="floating-editing-buttons flex items-center"
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
                <EpDropdown
                  v-if="isEditing && !disabled && (features.removable || features.hideable || codingMenuVisible) "
                  class="mx-4"
                  right
                >
                  <template #button-content>
                    <EpMaterialIcon>more_horiz</EpMaterialIcon>
                  </template>
                  <EpDropdownItem
                    key="poista"
                    :disabled="!features.removable || disabled"
                    @click="remove()"
                  >
                    <slot name="poista">
                      {{ poistoteksti }}
                    </slot>
                  </EpDropdownItem>
                  <EpDropdownItem
                    v-if="!hidden && features.hideable"
                    key="piilota"
                    :disabled="disabled"
                    @click="hide()"
                  >
                    <slot name="piilota">
                      {{ $t('piilota') }}
                    </slot>
                  </EpDropdownItem>
                  <EpDropdownItem
                    v-if="hidden"
                    key="palauta"
                    :disabled="!features.hideable || disabled"
                    @click="unHide()"
                  >
                    <slot name="palauta">
                      {{ $t('palauta') }}
                    </slot>
                  </EpDropdownItem>
                </EpDropdown>
                <div
                  v-if="currentLock && features.lockable"
                  class="flex items-center ml-2 mr-2"
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
                  <div class="grow ml-3">
                    <div>
                      {{ currentLock.haltijaNimi || currentLock.haltijaOid }}
                    </div>
                    <div class="text-gray-500">
                      {{ $t('vapautuu') }}: {{ $ago(currentLock.vanhentuu) }}
                    </div>
                  </div>
                </div>
                <template v-else-if="!isEditing && features.editable && !versiohistoriaVisible">
                  <slot
                    name="muokkaa-content"
                    :data="inner"
                  >
                    <ep-button
                      id="editointi-muokkaus"
                      v-oikeustarkastelu="muokkausOikeustarkastelu"
                      variant="link"
                      icon="edit"
                      :show-spinner="isSaving || loading"
                      :disabled="disabled"
                      @click="modify()"
                    >
                      <slot name="muokkaa">
                        {{ $t('muokkaa') }}
                      </slot>
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
                <EpDropdown
                  v-if="katseluDropDownValinnatVisible"
                  v-oikeustarkastelu="{ oikeus: 'luku' }"
                  class="mx-4"
                  right
                >
                  <template #button-content>
                    <EpMaterialIcon>more_horiz</EpMaterialIcon>
                  </template>
                  <EpDropdownItem
                    v-if="features.removable && !disabled"
                    key="poista"
                    v-oikeustarkastelu="muokkausOikeustarkastelu"
                    @click="remove()"
                  >
                    <slot name="poista">
                      {{ poistoteksti }}
                    </slot>
                  </EpDropdownItem>
                  <EpDropdownItem
                    v-if="!hidden && features.hideable && !disabled"
                    key="piilota"
                    v-oikeustarkastelu="muokkausOikeustarkastelu"
                    @click="hide()"
                  >
                    <slot name="piilota">
                      {{ $t('piilota') }}
                    </slot>
                  </EpDropdownItem>
                  <EpDropdownItem
                    v-if="hidden && features.hideable && !disabled"
                    key="palauta"
                    v-oikeustarkastelu="muokkausOikeustarkastelu"
                    @click="unHide()"
                  >
                    <slot name="palauta">
                      {{ $t('palauta') }}
                    </slot>
                  </EpDropdownItem>
                  <EpDropdownText
                    v-if="features.recoverable"
                    :class="{ 'opacity-50 cursor-not-allowed': !historia || disabled }"
                  >
                    <ep-versio-modaali
                      :value="current"
                      :versions="historia"
                      :current="current"
                      :per-page="10"
                      @restore="restore($event)"
                    />
                  </EpDropdownText>
                  <EpDropdownItem
                    v-if="showKooditaOption"
                    key="koodita"
                    :disabled="disabled"
                    @click="aloitaKooditus()"
                  >
                    <slot name="koodita">
                      {{ $t('koodita-sisalto') }}
                    </slot>
                  </EpDropdownItem>
                  <EpDropdownItem
                    v-if="showPoistaKooditusOption"
                    key="poista-kooditus"
                    :disabled="disabled"
                    @click="poistaKooditus()"
                  >
                    <slot name="poista-kooditus">
                      {{ $t('poista-kooditus') }}
                    </slot>
                  </EpDropdownItem>
                </EpDropdown>
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
          class="flex items-center versiohistoria"
        >
          <div class="headerline">
            <span>{{ $t('muokkaushistoria') }}: {{ $t('versionumero') }} {{ versionumero }}</span>
          </div>
          <div class="flex-1">
            <ep-b-pagination
              :model-value="versionumero"
              :total="versions"
              :items-per-page="1"
              class="mb-0"
              @update:model-value="updateVersionumero"
            />
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
              class="info flex"
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
      <EpEditointiKoodistoSelect
        ref="editointiKoodistoSelectRef"
        :store="store"
        :codes="features.codes || []"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed, watch, onMounted, getCurrentInstance, unref, reactive } from 'vue';
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
import { EpDropdown, EpDropdownItem, EpDropdownText } from '@shared/components/EpDropdown';
import { useSlots } from 'vue';
import { $t, $sdt, $ago, $success, $fail, $confirmModal, $vahvista } from '@shared/utils/globals';
import { useVuelidate } from '@vuelidate/core';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import { inject } from 'vue';
import EpEditointiKoodistoSelect from './EpEditointiKoodistoSelect.vue';

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
  preSave: {
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

const currentLock = computed(() => props.store.currentLock || null);

const isSaving = computed(() => props.store.isSaving || false);

const validator = computed(() => ({ inner: props.store.validator || null }));

const isEditing = computed(() =>  props.store.isEditing || false);

const revisions = computed(() => props.store.revisions || []);

const features = computed(() => unref(props.store.features as any) || {});

const editointiKoodistoSelectRef = ref<InstanceType<typeof EpEditointiKoodistoSelect> | null>(null);

const showKooditaOption = computed(() => {
  const codes = features.value.codes;
  const hooks = props.store?.hooks;
  return _.isArray(codes) && codes.length > 0 && !!hooks?.addCoding && !features.value.hasCoding;
});

const showPoistaKooditusOption = computed(() => !!props.store?.hooks?.removeCoding && !!features.value.hasCoding);

const codingMenuVisible = computed(() => showKooditaOption.value || showPoistaKooditusOption.value);

const aloitaKooditus = async () => {
  await editointiKoodistoSelectRef.value?.aloitaKooditus();
};

const poistaKooditus = async () => {
  try {
    if (!await $vahvista($t('varmista-poista-kooditus-otsikko') as string, $t('varmista-poista-kooditus') as string)) {
      return;
    }

    await props.store.removeCoding();
    await props.store.init();
    $success($t('sisalto-kooditus-poistettu') as string);
  }
  catch (err) {
    console.log(err);
    $fail($t('kooditus-epaonnistui') as string);
  }
};

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
  && !versiohistoriaVisible.value,
);

const muokkausEiSallittu = computed(() =>
  !isEditing.value
  && latest.value
  && !features.value.editable,
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
  current.value && current.value !== latest.value,
);

const hasKeskusteluSlot = computed(() => !!slots.keskustelu);
const hasPerusteSlot = computed(() => !!slots.peruste);
const hasOhjeSlot = computed(() => !!slots.ohje);
const hasInfoSlotContent = computed(() => !!slots.info);
const hasFooterSlot = computed(() => !!slots.footer);
const hasCustomHeaderSlot = computed(() => !!slots.customheader);

const kommenttiHandler = inject('kommenttiHandler', null);

const saveHelpText = computed(() => {
  if (disabled.value) {
    return 'tallenna-kaynnissa';
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
  return $confirmModal?.msgBoxConfirm((vahvistusSisalto as any), {
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
    console.log(err);
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
      await props.preSave?.();
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

watch(isEditing, (newValue, oldValue) => {
  if (kommenttiHandler) {
    kommenttiHandler.setActive(!newValue && sidebarState.value === 1);
  }
});

watch(sidebarState, (newValue, oldValue) => {
  if (kommenttiHandler) {
    kommenttiHandler.setActive(!isEditing.value && newValue === 1);
  }
});

</script>

<style scoped lang="scss">
@import '../../styles/variables';

.info {
  background: $lightBlue2;
  border: $grey300 solid 1px;
  padding: 20px;
}

.icon {
  vertical-align: bottom;
}

.editointikontrolli {
  .ylapaneeli {
    background: #fff;
    border-bottom: 1px solid #E7E7E7;

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
    background-color: $lightBlue2;
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
