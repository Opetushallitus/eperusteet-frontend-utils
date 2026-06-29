<template>
  <div>
    <div
      v-if="!fileSelected"
      class="tiedosto-lataus ei-tiedostoa"
    >
      <EpFileUpload
        ref="fileInput"
        :accept="accept"
        :choose-label="browseText"
        @input="onInput"
      />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import EpFileUpload from '@shared/components/EpFileUpload/EpFileUpload.vue';
import _ from 'lodash';
import { $t } from '@shared/utils/globals';

const props = defineProps({
  file: {
    required: false,
    default: null,
  },
  fileTypes: {
    type: Array as () => string[],
    required: true,
  },
});

const emit = defineEmits(['input']);
const fileInput = useTemplateRef('fileInput');

const onInput = async (file: File) => {
  emit('input', file);
};

const accept = computed(() => {
  return _.join(props.fileTypes, ', ');
});

const fileSelected = computed(() => {
  return !!props.file;
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

const reset = () => {
  (fileInput.value as { clear?: () => void })?.clear?.();
};

defineExpose({
  reset,
});
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

</style>
