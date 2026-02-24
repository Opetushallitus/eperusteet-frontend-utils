<template>
  <FileUpload
    ref="fileUploadRef"
    mode="advanced"
    :accept="accept"
    :multiple="false"
    :custom-upload="true"
    :choose-label="chooseLabel"
    @select="onSelect"
    :auto="true"
  >
    <template #empty>
        <div class="flex items-center justify-center flex-col">
            <EpMaterialIcon class="!border-2 !rounded-full !p-2">cloud_upload</EpMaterialIcon>
            <p class="mt-6 mb-0">{{ $t('fu-placeholder') }}</p>
        </div>
    </template>
  </FileUpload>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FileUpload from 'primevue/fileupload';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const fileUploadRef = ref();

function clear() {
  fileUploadRef.value?.clear();
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
    top: 120px;
    left: 95px;
  }

  :deep(.p-fileupload-content) {
    position: relative;
    top: -50px;
  }

</style>
