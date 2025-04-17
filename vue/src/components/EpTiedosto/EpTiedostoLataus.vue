<template>
  <div>
    <EpTiedostoInput
      ref="fileInput"
      :file-types="fileTypes"
      :file="file"
      @input="onInput"
    >
      <slot>
        <div
          v-if="file"
          class="pl-2 d-inline-block"
        >
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
    </EpTiedostoInput>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, getCurrentInstance } from 'vue';
import EpButton from '../EpButton/EpButton.vue';
import _ from 'lodash';
import EpTiedostoInput from '@shared/components/EpTiedosto/EpTiedostoInput.vue';

export interface FileData {
  file: File;
  binary?: ArrayBuffer;
  content?: string;
}

const props = defineProps({
  modelValue: {
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
    default: 10 * 1024 * 1024, // 10Mt
  },
});

const emit = defineEmits(['update:modelValue']);

// Get instance for $fail
const instance = getCurrentInstance();
const $fail = instance?.appContext.config.globalProperties.$fail;

const fileInput = useTemplateRef('fileInput');

const file = computed(() => {
  if (props.modelValue) {
    return props.modelValue.file;
  }
  return undefined;
});

function handleFail() {
  $fail($t('tiedosto-luku-virhe'));
  emit('update:modelValue', null);
  resetFile();
}

async function onInput(file: File) {
  if (file != null && file.size > props.fileMaxSize) {
    $fail($t('tiedosto-liian-suuri', { koko: 10 }));
  }
  else if (file != null && !_.includes(props.fileTypes, file.type)) {
    $fail($t('tiedostotyyppi-ei-sallittu'));
  }
  else if (file != null) {
    // Luodaan uusi lukija ja rekisteröidään kuuntelija
    const reader = new FileReader();
    if (props.asBinary) {
      reader.onload = () => {
        try {
          if (reader.result) {
            emit('update:modelValue', {
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
            emit('update:modelValue', {
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
  emit('update:modelValue', null);
}

function resetFile() {
  fileInput.value?.resetFile();
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

</style>
