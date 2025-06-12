<template>
  <ep-form-content>
    <slot name="header">
      <div class="d-flex">
        <span class="kuvatyyppi mr-1">{{ $t(tyyppi) }}</span>
        <EpInfoPopover :unique-id="tyyppi">
          {{ kuvatyyppiInfo }}
        </EpInfoPopover>
      </div>
    </slot>

    <EpTiedostoInput
      ref="fileInput"
      v-model="file"
      :file-types="fileTypes"
      :file="fileOrUrl"
      @input="onInput"
    >
      <slot>
        <div class="justify-content-around align-items-center h-100 m-3">
          <div v-if="kuvaUrl">
            <img :src="kuvaUrl">
            <div class="vali-viiva justify-content-center">
              <ep-button
                variant="link"
                icon="delete"
                class="mt-2"
                @click="removeImage()"
              >
                <slot name="poista">
                  {{ $t('poista') }}
                </slot>
              </ep-button>
            </div>
          </div>

          <div v-else-if="file">
            <div class="h-100 justify-content-around align-items-center">
              <figure>
                <img
                  v-if="previewUrl"
                  :src="previewUrl"
                >
                <figcaption>{{ $t('fu-valittu-tiedosto') }}: {{ file ? file.name : '' }}</figcaption>
              </figure>
            </div>
            <div class="justify-content-center">
              <ep-button
                v-if="fileValidi"
                variant="link"
                icon="save"
                class="mr-5"
                @click="saveImage()"
              >
                <slot name="tallenna">
                  {{ $t('tallenna') }}
                </slot>
              </ep-button>
              <ep-button
                variant="link"
                icon="keyboard_return"
                @click="file = null"
              >
                <slot name="peruuta">
                  {{ $t('peruuta') }}
                </slot>
              </ep-button>
            </div>
          </div>
        </div>
      </slot>
    </EpTiedostoInput>
  </ep-form-content>
</template>

<script setup lang="ts">
import { ref, computed, watch, useTemplateRef, getCurrentInstance } from 'vue';
import { Kielet } from '../../stores/kieli';
import _ from 'lodash';
import { fail } from '@shared/utils/notifications';
import EpButton from '../EpButton/EpButton.vue';
import EpFormContent from '../forms/EpFormContent.vue';
import EpTiedostoInput from '@shared/components/EpTiedosto/EpTiedostoInput.vue';
import EpInfoPopover from '@shared/components/EpInfoPopover/EpInfoPopover.vue';

const props = defineProps({
  tyyppi: {
    type: String,
    required: true,
  },
  kuvaUrl: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['saveImage', 'removeImage']);

const $t = getCurrentInstance()?.appContext.config.globalProperties.$t;

const file = ref(null);
const previewUrl = ref(null);
const fileMaxSize = 1 * 1024 * 1024;
const fileTypes = ['image/jpeg', 'image/png'];
const fileInput = useTemplateRef('fileInput');

const kieli = computed(() => {
  return Kielet.getSisaltoKieli;
});

const fileOrUrl = computed(() => {
  return file.value || props.kuvaUrl;
});

const fileValidi = computed(() => {
  return file.value != null && (file.value as any).size <= fileMaxSize && _.includes(fileTypes, (file.value as any).type);
});

const kuvatyyppiInfo = computed(() => {
  let secondaryInfo;
  if (props.tyyppi === 'kansikuva') {
    secondaryInfo = $t('kansikuva-suositus', { mitta: 400 });
  }
  else {
    secondaryInfo = $t('suositellut-mitat', { korkeus: 200, leveys: 2500 });
  }
  return $t('pdf-tiedosto-kuvaus') + ' ' + secondaryInfo;
});

// Watch for changes to kieli
watch(kieli, () => {
  file.value = null;
});

// Luodaan esikatselukuva kuvan valitsemisen jälkeen
function onInput(fileValue: any) {
  previewUrl.value = null;
  if (fileValue != null && fileValue.size > fileMaxSize) {
    fail('pdf-tiedosto-kuva-liian-suuri');
  }
  else if (fileValue != null && !_.includes(fileTypes, fileValue.type)) {
    fail('pdf-tiedosto-kuva-vaara-tyyppi');
  }
  else if (fileValue != null) {
    // Luodaan uusi lukija ja rekisteröidään kuuntelija
    const reader = new FileReader();
    reader.onload = (e: any) => {
      previewUrl.value = e.target.result;
    };

    // Ladataan kuva Base64 muodossa
    reader.readAsDataURL(fileValue);
  }
}

async function saveImage() {
  emit('saveImage', file.value, props.tyyppi);
}

async function removeImage() {
  emit('removeImage', props.tyyppi);
  file.value = null;
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

.dokumentit {

  .kuvatyyppi {
    font-size: 1rem;
    font-weight: 600;
  }

  img {
    max-width: 500px;
    max-height: 500px;
  }
}
</style>
