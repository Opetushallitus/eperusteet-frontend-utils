<template>
  <div>
    <div
      class="tiedosto-lataus"
      :class="file ? 'tiedosto' : 'ei-tiedosto'"
    >
      <b-form-file
        v-if="!file"
        ref="fileInput"
        :accept="accept"
        :placeholder="placeholder"
        :drop-placeholder="dropPlaceholder"
        :browse-text="browseText"
        @input="onInput"
      />

      <template v-if="file">
        <slot
          name="file-selected"
          :file="file"
        >
          <div class="pl-2 d-inline-block">
            <div>{{ $t('valittu-tiedosto') }}: {{ file ? file.name : '' }}</div>
            <div class="text-right pl-2 pt-4">
              <ep-button
                class="pl-5"
                @click="cancel"
              >
                <slot name="peruuta">
                  {{ $t('peruuta') }}
                </slot>
              </ep-button>
            </div>
          </div>
        </slot>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, getCurrentInstance } from 'vue';
import EpButton from '../EpButton/EpButton.vue';
import _ from 'lodash';
import { $t, $fail } from '@shared/utils/globals';

export interface FileData {
  file: File;
  binary?: ArrayBuffer;
  content?: string;
}

const props = defineProps({
  value: {
    type: Object as () => FileData | null,
    default: null,
  },
  fileTypes: {
    type: Array as () => string[],
    required: true,
  },
  asBinary: {
    type: Boolean,
    default: false,
  },
  fileMaxSize: {
    type: Number,
    default: 1 * 1024 * 1024,
  },
});

const emit = defineEmits(['input']);
const instance = getCurrentInstance();
const fileInput = useTemplateRef('fileInput');

const accept = computed(() => {
  return _.join(props.fileTypes, ', ');
});

const file = computed(() => {
  if (props.value) {
    return props.value.file;
  }
  return null;
});

const placeholder = computed(() => {
  return $t('fu-placeholder');
});

const dropPlaceholder = computed(() => {
  return $t('fu-placeholder');
});

const browseText = computed(() => {
  return $t('fu-browse-text');
});

function handleFail() {
  $fail($t('tiedosto-luku-virhe'));
  emit('input', null);
  resetFile();
}

// Luodaan esikatselukuva kuvan valitsemisen jälkeen
async function onInput(file: File) {
  if (file != null && file.size > props.fileMaxSize) {
    $fail($t('pdf-tiedosto-kuva-liian-suuri'));
  }

  if (file != null && !_.includes(props.fileTypes, file.type)) {
    $fail($t('pdf-tiedosto-kuva-vaara-tyyppi'));
  }

  if (file != null) {
    // Luodaan uusi lukija ja rekisteröidään kuuntelija
    const reader = new FileReader();
    if (props.asBinary) {
      reader.onload = () => {
        try {
          if (reader.result) {
            emit('input', {
              file,
              binary: reader.result,
            } as FileData);
          }
        }
        catch (e) {
          handleFail();
        }
      };
      reader.readAsBinaryString(file);
    }
    else {
      reader.onload = evt => {
        try {
          if (evt.target) {
            emit('input', {
              file,
              content: JSON.parse((evt.target.result as any)),
            } as FileData);
          }
        }
        catch (e) {
          handleFail();
        }
      };
      reader.readAsText(file);
    }
  }
}

function cancel() {
  emit('input', null);
}

function resetFile() {
  fileInput.value?.reset();
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

.kuvaus {
  font-size: 0.8rem;
  color: $gray;
}

.tiedosto-lataus {
  margin: 0px 0px;
  width:100%;
  border-width: 1px;
  border-color: $gray-lighten-2;
  border-style: dashed;
  border-radius: 10px;
  position: relative;

  img {
    max-width: 500px;
    max-height: 500px;
  }

  &.tiedosto {
    background-color: $white;
    border-style: none;
  }

  &.ei-tiedosto {
    height: 100px;
    background-color: $gray-lighten-7;
  }

  .custom-file:deep() {
    height: 100%;
    flex-direction: column;
    justify-content: center;
    display: flex;

    input {
      display: none;
    }

    .custom-file-label {
      width: 100%;
      background-image: url('../../../public/img/icons/lataus_ikoni.svg');
      background-repeat: no-repeat;
      background-position: left;
      border: 0px;
      margin-left: 30px;
      margin-top: 10px;
      height: 50px;
      background-color: inherit;
      padding-top: 0px;
      padding-left: 60px;
      position: relative;
      border-radius: 0;
    }

    .custom-file-label::after {
      padding: 60px 310px 0px 0px;
      text-decoration: underline;
      color: blue;
      padding: 0 0 0 0.20rem;
      display: inline;
      position: relative;
      background-color: $gray-lighten-7;
    }
  }
}

</style>
