<template>
  <FileUpload
    :key="resetKey"
    ref="fileUploadRef"
    mode="advanced"
    :accept="accept"
    :multiple="false"
    :custom-upload="true"
    :choose-label="chooseLabel"
    :auto="true"
    :show-cancel-button="false"
    @select="onSelect"
  >
    <template #empty>
      <div class="flex items-center items-center icon-text-container">
        <EpMaterialIcon class="!border-2 !rounded-full !p-2">
          download
        </EpMaterialIcon>
        <div class="ml-2 mb-3">
          {{ $t('fu-placeholder') }}
        </div>
      </div>
    </template>
  </FileUpload>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FileUpload from 'primevue/fileupload';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const fileUploadRef = ref();
const resetKey = ref(0);

function clear() {
  resetKey.value += 1;
}

defineExpose({ clear });

const props = withDefaults(
  defineProps<{
    accept?: string;
    chooseLabel?: string;
  }>(),
  {
    accept: undefined,
    chooseLabel: undefined,
  },
);


const emit = defineEmits<{
  input: [file: File];
}>();

function onSelect(event: { files: File | File[] }) {
  const files = event.files;
  if (!files) return;
  const file = Array.isArray(files) ? files[0] : files;
  if (file) emit('input', file);
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

  .p-fileupload {
    width: 100% !important;
    height: 100px !important;
    border: 2px dashed $grey300;
    border-radius: 10px;
    background-color: $grey50;

    .icon-text-container {
      position: relative;
      top: -5px;
    }
  }

  :deep(.icon) {
    border: 2px dashed $grey500;
    color: $grey500;
  }

  :deep(.p-fileupload-upload-button, .p-fileupload-cancel-button) {
    display: none;
  }

  :deep(.p-fileupload-cancel-button) {
    display: none;
  }

  :deep(.p-fileupload-header) {
    position: relative;
    top: 25px;
    left: 52px;
    width: 50%;

    button {
      z-index: 100;
      background: transparent;
      border: none;
      color: $link;
      text-decoration-line: underline;

      svg {
        display: none;
      }

      &:hover {
        background: transparent;
        border: none;
        color: $link-hover-color;
      }
    }
  }

  :deep(.p-fileupload-content) {
    position: relative;
    top: -50px;
  }

</style>
