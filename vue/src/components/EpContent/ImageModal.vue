<template>
  <div class="imageselector">
    <ep-spinner v-if="isLoading" />

    <div v-else>
      <div>
        <div
          v-if="!imageData"
          class="imgselect"
        >
          <div class="mb-4">
            {{ $t('kuvalisays-modal-selite') }}
          </div>
          <ep-form-content name="valitse-kuva">
            <vue-select
              :value="selectedValue"
              @input="selectedValue = $event"
              :disabled="options.length === 0"
              :filter-by="filterBy"
              :placeholder="options.length > 0 ? $t('valitse') : $t('ei-lisattyja-kuvia')"
              :options="options"
              label="id"
              :clearable="true"
            >
              <template #selected-option="option">
                <img
                  class="preview-selected"
                  :src="option.src"
                >
              </template>
              <template #option="option">
                <img
                  class="preview"
                  :src="option.src"
                >
                {{ option.nimi }}
              </template>
            </vue-select>
          </ep-form-content>
        </div>

        <div v-if="!selectedValue || imageData">
          <ep-kuva-lataus
            v-model="imageData"
            :saved="imageSaved"
            @cancel="peruuta"
          />
        </div>

        <div v-if="selectedValue || imageData">
          <ep-form-content
            name="kuvateksti"
            class="mt-3"
          >
            <ep-field
              v-model="kuvateksti"
              :is-editing="true"
              :validation="v$.kuvateksti"
              :help="'teksti-naytetaan-kuvan-alla'"
              @input="onKuvatekstichange"
            />
          </ep-form-content>

          <ep-form-content class="mt-3">
            <template #header>
              <label>{{ $t('kuvan-vaihtoehtoinen-teksti') }} *</label>
            </template>
            <ep-field
              v-model="vaihtoehtoinenteksti"
              :is-editing="true"
              :validation="v$.vaihtoehtoinenteksti"
              :help="'teksti-naytetaan-ruudunlukijalaitteelle'"
              @input="onVaihtoehtoinentekstiChange"
            />
          </ep-form-content>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end mt-3">
      <ep-button
        class="mr-3"
        variant="link"
        @click="close(false)"
      >
        {{ $t('peruuta') }}
      </ep-button>
      <ep-button
        variant="primary"
        :disabled="invalid"
        @click="close(true)"
      >
        {{ $t('lisaa-kuva') }}
      </ep-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed, onMounted, getCurrentInstance } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { Kielet } from '@shared/stores/kieli';
import EpKuvaLataus, { ImageData } from '@shared/components/EpTiedosto/EpKuvaLataus.vue';
import { IKuvaHandler, ILiite } from './KuvaHandler';
import { $t, $success, $fail } from '@shared/utils/globals';
import VueSelect from 'vue-select';
import EpButton from '@shared/components/EpButton/EpButton.vue';

const props = defineProps({
  loader: {
    type: Object as () => IKuvaHandler,
    required: true,
  },
  modelValue: {
    type: Object as () => { value?: string },
    required: true,
  },
  kuvatekstiProp: {
    type: Object,
    required: true,
  },
  vaihtoehtotekstiProp: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'onClose', 'onKuvatekstichange', 'onVaihtoehtoinentekstiChange']);

// State variables
const imageSaved = ref(false);
const imageData = ref<ImageData | null>(null);
const isLoading = ref(true);
const files = ref<ILiite[]>([]);
const kuvateksti = ref<any>({});
const vaihtoehtoinenteksti = ref<any>({});

const options = computed(() => {
  return files.value;
});

const selectedValue = computed({
  get: () => {
    const it = _.findIndex(files.value, f => f.id === props.modelValue.value);
    if (it >= 0) {
      return files.value[it];
    }
    return undefined;
  },
  set: (liite: any) => {
    if (liite) {
      emit('update:modelValue', liite.id);
      v$.value.$touch();
    }
    else {
      emit('update:modelValue', null);
    }
  },
});

const kuvaValittu = computed(() => {
  return selectedValue.value || imageData.value;
});

// Setup vuelidate
const rules = computed(() => ({
  vaihtoehtoinenteksti: {
    [Kielet.getSisaltoKieli.value]: {
      required,
    },
  },
  kuvaValittu: {
    required,
  },
}));

const v$ = useVuelidate(rules, { vaihtoehtoinenteksti, kuvaValittu });

const invalid = computed(() => {
  return v$.value.$invalid;
});

// Methods
async function close(save: boolean) {
  if (save && !imageSaved.value) {
    await saveImage();
  }

  emit('onClose', save);
}

function filterBy(option: any, label: string, search: string) {
  return (option.nimi || '')
    .toLowerCase()
    .indexOf(search.toLowerCase()) > -1;
}

async function saveImage() {
  if (imageData.value) {
    const formData = new FormData();
    formData.append('file', imageData.value.file);
    formData.append('nimi', imageData.value.file.name);
    formData.append('width', _.toString(imageData.value.width));
    formData.append('height', _.toString(imageData.value.height));
    try {
      const tallenettuId = await props.loader.api().post(props.loader.endpoint(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      imageSaved.value = true;
      files.value = await props.loader.hae();
      selectedValue.value = { id: tallenettuId.data };

      $success($t('kuva-tallennettu-onnistuneesti'));
    }
    catch (err) {
      console.error(err);
      $fail($t('kuva-lisays-epaonnistui'));
    }
  }
}

function onKuvatekstichange(value: any) {
  emit('onKuvatekstichange', value[Kielet.getSisaltoKieli.value]);
}

function onVaihtoehtoinentekstiChange(value: any) {
  emit('onVaihtoehtoinentekstiChange', value[Kielet.getSisaltoKieli.value]);
}

function peruuta() {
  imageData.value = null;
  selectedValue.value = null;
  imageSaved.value = false;
}

// Lifecycle hooks
onMounted(async () => {
  kuvateksti.value = {
    [Kielet.getSisaltoKieli.value]: props.kuvatekstiProp || props.vaihtoehtotekstiProp,
  };

  vaihtoehtoinenteksti.value = {
    [Kielet.getSisaltoKieli.value]: props.vaihtoehtotekstiProp,
  };

  try {
    isLoading.value = true;
    files.value = await props.loader.hae();
  }
  finally {
    isLoading.value = false;
  }

  if (props.modelValue.value) {
    selectedValue.value = files.value.find(f => f.id === props.modelValue.value);
  }

  emit('onKuvatekstichange', kuvateksti.value[Kielet.getSisaltoKieli.value]);
  emit('onVaihtoehtoinentekstiChange', vaihtoehtoinenteksti.value[Kielet.getSisaltoKieli.value]);
});
</script>

<style scoped lang="scss">
.imageselector {
  .imgselect {
    margin-bottom: 12px;
  }

  label.uploadbtn {
    width: 100%;
  }

  img.preview-selected {
    width: 100%;
  }

  img.preview {
    width: 40%;
  }

  img.esikatselukuva {
    width: 100%;
    margin-bottom: 10px;
    border: 3px solid #eee;
  }

  input {
    margin-bottom: 10px;
  }

  .buttons {
    width: 100%;
  }

  :deep(#fileInput) {
    display: none;
  }
}
</style>
