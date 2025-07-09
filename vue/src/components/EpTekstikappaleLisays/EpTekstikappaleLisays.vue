<template>
  <div>
    <div v-b-modal="modalId">
      <slot name="lisays-btn">
        <ep-button
          id="tekstikappalelisaysBtn"
          variant="link"
          button-class="text-decoration-none"
        >
          <slot name="lisays-btn-icon">
            <EpMaterialIcon
              :color="'inherit'"
              :background="'inherit'"
              size="18px"
            >
              add
            </EpMaterialIcon>
          </slot>
          <span>
            <slot name="lisays-btn-text">
              {{ $t('uusi-tekstikappale') }}
            </slot>
          </span>
        </ep-button>
      </slot>
    </div>
    <b-modal
      :id="modalId"
      ref="tekstikappalelisaysModal"
      size="lg"
      centered
      @hidden="clear"
    >
      <template #modal-title>
        <slot name="modal-title">
          {{ $t('lisaa-uusi-tekstikappale') }}
        </slot>
      </template>

      <ep-form-content
        v-if="otsikkoRequired"
        :name="contentName"
      >
        <ep-field
          v-model="otsikko"
          class="mb-5"
          :is-editing="true"
          :validation="v$.otsikko"
          :show-valid-validation="true"
        />
      </ep-form-content>

      <ep-form-content v-if="!hideTaso">
        <template #header>
          <h3>
            <slot name="header">
              {{ $t('tekstikappaleen-sijainti-valikossa') }}
            </slot>
          </h3>
        </template>

        <div>
          <div v-if="paatasovalinta">
            <EpRadio
              v-model="taso"
              name="taso"
              value="paataso"
              class="mb-1"
            >
              {{ $t('paatasolla') }}
            </EpRadio>
            <EpRadio
              v-model="taso"
              name="taso"
              value="alataso"
              class="mb-1"
            >
              {{ $t('toisen-tekstikappaleen-alla') }}
            </EpRadio>
          </div>

          <ep-select
            v-model="valittuTekstikappale"
            class="mb-5 mt-2"
            :class="{'ml-4': paatasovalinta}"
            :items="tekstikappaleet"
            :is-editing="true"
            :enable-empty-option="true"
            :placeholder="'valitse-ylaotsikko'"
            :disabled="taso === 'paataso'"
            :empty-option-disabled="true"
          >
            <template #default="{ item }">
              <slot :tekstikappale="item">
                {{ item }}
              </slot>
            </template>
          </ep-select>
        </div>
      </ep-form-content>

      <template #modal-footer>
        <ep-button
          variant="link"
          @click="cancel"
        >
          {{ $t('peruuta') }}
        </ep-button>
        <ep-button
          :show-spinner="loading"
          :disabled="okDisabled"
          @click="save"
        >
          <slot name="footer-lisays-btn-text">
            {{ $t('lisaa-tekstikappale') }}
          </slot>
        </ep-button>
      </template>
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance, onMounted } from 'vue';
import _ from 'lodash';
import { useVuelidate } from '@vuelidate/core';
import { notNull, requiredOneLang } from '@shared/validators/required';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpSelect from '@shared/components/forms/EpSelect.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { BvModal } from 'bootstrap-vue';
import { nextTick } from 'vue';
import { Kielet } from '@shared/stores/kieli';
import EpRadio from '@shared/components/forms/EpRadio.vue';
import { $bvModal } from '@shared/utils/globals';

const props = defineProps({
  tekstikappaleet: {
    type: Array,
    required: true,
  },
  paatasovalinta: {
    type: Boolean,
    default: false,
  },
  hideTaso: {
    type: Boolean,
    default: false,
  },
  otsikkoRequired: {
    type: Boolean,
    default: true,
  },
  modalId: {
    type: String,
    default: 'tekstikappalelisays',
  },
  otsikkoNimi: {
    type: String,
    required: false,
  },
  tallenna: {
    type: Function,
    required: true,
  },
});

// Template refs
const tekstikappalelisaysModal = ref<InstanceType<any> | null>(null);

// Reactive state
const otsikko = ref({});
const valittuTekstikappale = ref({});
const taso = ref(props.paatasovalinta ? 'paataso' : 'alataso');
const loading = ref(false);

const rules = {
  otsikko: {
    [Kielet.getSisaltoKieli.value]: notNull(),
  },
};
const v$ = useVuelidate(rules, { otsikko });

// Computed properties
const okDisabled = computed(() => {
  return (props.otsikkoRequired && v$.value.otsikko.$invalid)
    || (taso.value === 'alataso' && _.isEmpty(valittuTekstikappale.value));
});

const contentName = computed(() => {
  if (props.otsikkoNimi) {
    return props.otsikkoNimi;
  }
  return props.modalId === 'opintokokonaisuusLisays' ? 'opintokokonaisuuden-nimi' : 'tekstikappale-nimi-ohje';
});

// Methods
async function save() {
  if (taso.value === 'paataso') {
    valittuTekstikappale.value = {};
  }

  loading.value = true;
  await props.tallenna(otsikko.value, valittuTekstikappale.value);
  loading.value = false;
  $bvModal.hide(props.modalId);
}

function clear() {
  otsikko.value = {};
  valittuTekstikappale.value = {};
  taso.value = 'paataso';
}

function cancel() {
  $bvModal.hide(props.modalId);
}

// Lifecycle hooks
onMounted(() => {
  taso.value = props.paatasovalinta ? 'paataso' : 'alataso';
});

defineExpose({
  taso,
});
</script>

<style scoped lang="scss">
.osaalue-piilotettu {
  background: gray;
}
</style>
