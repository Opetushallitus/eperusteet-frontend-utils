<template>
  <div class="termi-selector">
    <div class="modal-header">
      <h5 class="modal-title">
        {{ $t('valitse-kasite') }}
      </h5>
    </div>

    <div class="modal-body p-2">
      <div v-if="isEditing">
        <ep-form-content name="termin-nimi">
          <ep-field
            v-model="termiModel"
            help="termin-nimi"
            :validation="v$.muokattava.termi"
            :is-editing="true"
          />
        </ep-form-content>
        <ep-form-content name="termin-kuvaus">
          <ep-field
            v-model="selitysModel"
            help="termin-kuvaus"
            :validation="v$.muokattava.selitys"
            :is-editing="true"
          />
        </ep-form-content>
        <ep-form-content
          v-if="alaviiteSupported"
          name="alaviitteessa"
        >
          <ep-toggle v-model="muokattava.alaviite">
            {{ $t('nayta-alaviitteessa') }}
          </ep-toggle>
        </ep-form-content>
        <div class="flex gap-2">
          <ep-button
            variant="link"
            :show-spinner="isLoading"
            @click="peruuta"
          >
            {{ $t('peruuta') }}
          </ep-button>
          <ep-button
            id="tallenna-kasite"
            :disabled="v$.muokattava.$invalid"
            :show-spinner="isLoading"
            @click="tallenna"
          >
            {{ $t('tallenna') }}
          </ep-button>
        </div>
      </div>
      <div v-else>
        <ep-spinner v-if="isLoading" />
        <div v-else>
          <ep-select
            v-if="siivotutTermit.length > 0"
            v-model="valittu"
            :items="siivotutTermit"
            :is-editing="true"
            :enable-empty-option="true"
            :placeholder="'valitse-kasite'"
          >
            <template #default="{ item }">
              <div>
                <span>{{ $kaanna((item as ITermi)?.termi) }}</span>
              </div>
              <div
                v-if="(item as { selitys?: string })?.selitys"
                class="ps-3 small fw-light"
              >
                <span>{{ (item as { selitys: string }).selitys }}</span>
              </div>
            </template>
          </ep-select>
          <div class="mt-3">
            <ep-button
              v-if="valittu"
              id="muokkaa-termia"
              class="lisaa-painike"
              variant="link"
              @click="muokkaa(valittu)"
            >
              {{ $t('muokkaa-kasitetta') }}
            </ep-button>
            <ep-button
              id="lisaa-uusi-termi"
              class="lisaa-painike"
              variant="link"
              @click="muokkaa()"
            >
              {{ $t('lisaa-uusi-kasite') }}
            </ep-button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <div class="w-full flex justify-end gap-2">
        <ep-button
          class="mr-3"
          variant="link"
          @click="handleCancel"
        >
          {{ $t('peruuta') }}
        </ep-button>
        <ep-button
          v-if="!isEditing"
          variant="primary"
          :disabled="!valittu"
          @click="handleOk"
        >
          {{ $t('valitse') }}
        </ep-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { kasiteValidator } from '@shared/validators/kasite';
import EpSelect from '@shared/components/forms/EpSelect.vue';
import { IKasiteHandler, ITermi } from './KasiteHandler';
import _ from 'lodash';
import { useVuelidate } from '@vuelidate/core';
import { $kaanna } from '@shared/utils/globals';
import { unref } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  handler: {
    type: Object as () => IKasiteHandler,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'ok', 'cancel']);

// State variables
const termit = ref<ITermi[]>([]);
const isLoading = ref(false);
const isEditing = ref(false);
const muokattava = reactive<ITermi>({
  termi: {},
  selitys: {},
  alaviite: false,
});

// Setup validation
const rules = computed(() => {
  return {
    muokattava: kasiteValidator(),
  };
});

const v$ = useVuelidate(rules, { muokattava });

// Methods
const peruuta = async () => {
  isEditing.value = false;
};

const tallenna = async () => {
  try {
    isLoading.value = true;
    const uusi = await props.handler.addOrUpdate(muokattava);
    termit.value = props.handler.getAll();
    valittu.value = uusi;
    emit('update:modelValue', uusi.avain || '');
  }
  catch (e) {
    console.error(e);
  }
  finally {
    isLoading.value = false;
    isEditing.value = false;
  }
};

const muokkaa = (selected?: ITermi | { avain?: string }) => {
  if (selected?.avain) {
    const original = termit.value.find(t => t.avain === selected.avain);
    if (original) Object.assign(muokattava, original);
  }
  else {
    Object.assign(muokattava, {
      termi: {},
      selitys: {},
      alaviite: false,
    });
  }
  isEditing.value = true;
};

const valittu = computed({
  get: () => {
    // Find the selected term object from siivotutTermit (same refs as items) based on modelValue (avain)
    return siivotutTermit.value.find(k => k.avain === unref(props.modelValue)) || null;
  },
  set: (value: ITermi | null) => {
    emit('update:modelValue', value?.avain || '');
  },
});

const handleOk = () => {
  const viite = valittu.value?.avain || '';
  emit('ok', viite);
};

const handleCancel = () => {
  emit('cancel');
};

const alaviiteSupported = computed(() => {
  return _.has(muokattava, 'alaviite');
});

const termiModel = computed({
  get: () => muokattava.termi || {},
  set: (value) => {
    muokattava.termi = value;
  },
});

const selitysModel = computed({
  get: () => muokattava.selitys || {},
  set: (value) => {
    muokattava.selitys = value;
  },
});

const siivotutTermit = computed(() => {
  return termit.value.map(k => ({
    ...k,
    selitys: siivotaTermi(k),
  }));
});

const siivotaTermi = (termi: ITermi) => {
  const data = document.createElement('div');
  data.innerHTML = $kaanna(termi.selitys);
  return _.trim(data.textContent || data.innerText || '');
};

// Lifecycle hooks
onMounted(async () => {
  try {
    isLoading.value = true;
    termit.value = await props.handler.getAll();
    if (props.modelValue) {
      valittu.value = _.find(termit.value, (k) => k.avain === props.modelValue) || null;
    }
  }
  catch (err) {
    console.error('Failed to load terms:', err);
  }
  finally {
    isLoading.value = false;
  }
});
</script>

<style scoped lang="scss">
.termi-selector {
  min-width: 500px;
  max-width: 800px;
  background: white;
  // border-radius: 8px;
  // box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 1rem;

  .modal-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 500;
    color: #212529;
  }
}


.modal-footer {
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-top: 0;
  margin-top: 1rem;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.lisaa-painike {
  width: 100%;
}
</style>
