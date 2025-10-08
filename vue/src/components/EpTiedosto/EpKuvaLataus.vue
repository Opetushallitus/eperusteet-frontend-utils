<template>
  <div>
    <h4 v-if="file">
      {{ $t('kuva') }}
    </h4>
    <h4 v-else>
      {{ $t('lataa-uusi-kuva') }}
    </h4>
    <span v-if="!file">({{ $t('max-koko') + ' ' + fileMaxSizeInMb + $t('megatavu-lyhenne') }})</span>

    <EpTiedostoInput
      :file-types="fileTypes"
      :file="file"
      @input="onInput"
    >
      <slot>
        <div
          v-if="file"
          class="justify-content-around align-items-center h-100"
        >
          <div class="h-100 justify-content-around align-items-center">
            <figure>
              <img
                v-if="previewUrl"
                :src="previewUrl"
                :width="previewWidth"
                :height="previewHeight"
              >
              <figcaption v-if="!saved">
                {{ $t('fu-valittu-tiedosto') }}: {{ file ? file.name : '' }}
              </figcaption>
              <figcaption
                v-if="!saved && file"
                :class="!fileValidi ? 'error' : ''"
              >
                {{ $t('fu-tiedosto-koko') }}: {{ fileSize }} {{ !fileValidi ? '(' + $t('max-koko') + ' ' + fileMaxSizeInMb + $t('megatavu-lyhenne') + ')' : '' }}
              </figcaption>
            </figure>
          </div>

          <div
            v-if="!saved"
            class="mb-3"
          >
            <div class="d-flex align-items-center">
              <ep-form-content
                name="kuvan-leveys"
                class="mb-3"
              >
                <div class="d-flex align-items-center">
                  <ep-field
                    v-model="width"
                    :is-editing="true"
                    type="number"
                  />
                  <span class="ml-1 mr-3">px</span>
                </div>
              </ep-form-content>

              <ep-form-content
                name="kuvan-korkeus"
                class="mb-3"
              >
                <div class="d-flex align-items-center">
                  <ep-field
                    v-model="height"
                    :is-editing="true"
                    type="number"
                  />
                  <span class="ml-1">px</span>
                </div>
              </ep-form-content>
            </div>

            <ep-toggle
              v-model="keepAspectRatio"
              :is-switch="false"
            >
              {{ $t('sailyta-mittasuhteet') }}
            </ep-toggle>
          </div>

          <ep-button
            variant="link"
            no-padding
            @click="cancel"
          >
            {{ $t('valitse-toinen-kuva') }}
          </ep-button>
        </div>
      </slot>
    </EpTiedostoInput>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import EpButton from '../EpButton/EpButton.vue';
import _ from 'lodash';
import EpField from '@shared/components/forms/EpField.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpTiedostoInput from '@shared/components/EpTiedosto/EpTiedostoInput.vue';
import { $fail, $t } from '@shared/utils/globals';

export interface ImageData {
  file: File;
  height: number;
  width: number;
  preview: string;
  previewUrl: string;
}

const props = defineProps({
  modelValue: {
    type: Object as () => ImageData,
    required: true,
  },
  saved: {
    type: Boolean,
    required: false,
  },
});

const emit = defineEmits(['update:modelValue', 'saveImage', 'cancel']);

const fileMaxSizeInMb = ref(1);
const fileMaxSize = computed(() => fileMaxSizeInMb.value * 1024 * 1024);
const fileTypes = ref(['image/jpeg', 'image/png']);
const keepAspectRatio = ref(true);
const changeBlock = ref(false);
const originalHeightRatio = ref(0);
const originalWidthRatio = ref(0);
const previewWidth = ref(0);
const previewHeight = ref(0);

onMounted(() => {
  if (props.modelValue) {
    originalHeightRatio.value = height.value / width.value;
    originalWidthRatio.value = width.value / height.value;
    recalcPreview();
  }
});

const setOriginalRatios = (width: number, height: number) => {
  originalHeightRatio.value = height / width;
  originalWidthRatio.value = width / height;
};

const previewUrl = computed(() => {
  if (props.modelValue) {
    return props.modelValue.previewUrl;
  }
  return undefined;
});

const file = computed(() => {
  if (props.modelValue) {
    return props.modelValue.file;
  }
  return undefined;
});

const fileValidi = computed(() => {
  return file.value != null && file.value.size <= fileMaxSize.value && _.includes(fileTypes.value, file.value.type);
});

const fileSize = computed(() => {
  let size = 0;
  if (file.value) {
    size = file.value.size / 1024;
  }
  return size > 1024 ? (size / 1024).toFixed(2) + $t('megatavu-lyhenne') : size.toFixed(1) + $t('kilotavu-lyhenne');
});

// Luodaan esikatselukuva kuvan valitsemisen jälkeen
async function onInput(file: File) {
  if (file != null && file.size > fileMaxSize.value) {
    $fail('pdf-tiedosto-kuva-liian-suuri');
  }

  if (file != null && !_.includes(fileTypes.value, file.type)) {
    $fail('pdf-tiedosto-kuva-vaara-tyyppi');
  }

  if (file != null) {
    // Luodaan uusi lukija ja rekisteröidään kuuntelija
    const reader = new FileReader();

    // Ladataan kuva Base64 muodossa
    reader.readAsDataURL(file);
    reader.onload = (evt: any) => {
      let img = new Image();
      img.onload = () => {
        emit('update:modelValue', {
          file,
          width: img.width,
          height: img.height,
          preview: reader.result,
          previewUrl: evt.target.result,
        } as ImageData);

        setOriginalRatios(img.width, img.height);
      };
      img.src = evt.target.result;
    };
  }
}

function cancel() {
  emit('cancel');
}

const width = computed({
  get: () => props.modelValue?.width,
  set: (value) => {
    if (keepAspectRatio.value && !changeBlock.value) {
      changeBlock.value = true;
      emit('update:modelValue', {
        ...props.modelValue,
        width: value,
        height: round(value * originalHeightRatio.value),
      });
    }
    else {
      emit('update:modelValue', {
        ...props.modelValue,
        width: value,
      });
    }
  },
});

const height = computed({
  get: () => props.modelValue?.height,
  set: (value) => {
    if (keepAspectRatio.value && !changeBlock.value) {
      changeBlock.value = true;
      emit('update:modelValue', {
        ...props.modelValue,
        height: value,
        width: round(value * originalWidthRatio.value),
      });
    }
    else {
      emit('update:modelValue', {
        ...props.modelValue,
        height: value,
      });
    }
  },
});

watch(width, () => {
  if (changeBlock.value) {
    changeBlock.value = false;
  }
  recalcPreview();
});

watch(height, () => {
  if (changeBlock.value) {
    changeBlock.value = false;
  }
  recalcPreview();
});

function recalcPreview() {
  previewWidth.value = width.value;
  previewHeight.value = height.value;

  if (width.value > height.value) {
    if (width.value > 500) {
      previewWidth.value = 500;
    }
    previewHeight.value = round(previewWidth.value * ((height.value / width.value)));
  }
  else {
    if (height.value > 500) {
      previewHeight.value = 500;
    }
    previewWidth.value = round(previewHeight.value * (width.value / height.value));
  }
}

function round(number) {
  return _.toNumber(parseFloat(number).toFixed(0));
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

.error {
  color: $invalid;
}
</style>
