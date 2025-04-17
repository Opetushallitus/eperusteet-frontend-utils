<template>
  <div>
    <div
      v-if="!fileSelected"
      class="tiedosto-lataus ei-tiedostoa"
    >
      <b-form-file
        ref="fileInput"
        :accept="accept"
        :placeholder="placeholder"
        :drop-placeholder="dropPlaceholder"
        :browse-text="browseText"
        @input="onInput"
      />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, useTemplateRef } from 'vue';
import _ from 'lodash';

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

const instance = getCurrentInstance();
const $t = instance?.appContext.config.globalProperties.$t;

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

const resetFile = () => {
  if (!fileSelected.value) {
    fileInput.value?.reset();
  }
};

// Expose resetFile method for external components to use
defineExpose({
  resetFile,
});
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

.tiedosto-lataus {
  margin: 0;
  width:100%;
  border-width: 1px;
  border-color: $gray-lighten-2;
  border-style: dashed;
  border-radius: 10px;
  position: relative;

    &.tiedosto {
      background-color: $white;
      border-style: none;
    }

    &.ei-tiedostoa {
      height: 100px;
      background-color: $gray-lighten-7;
    }

  .custom-file::v-deep{
    height: 100%;
    flex-direction: column;
    justify-content: center;
    display: flex;

    input {
      display: none;
    }

    .custom-file-label {
      width: 100%;
      background-image: url('@assets/img/icons/lataus_ikoni.svg');
      background-repeat: no-repeat;
      background-position: left;
      border: 0;
      margin-left: 30px;
      margin-top: 10px;
      height: 50px;
      background-color: inherit;
      padding-top: 0;
      padding-left: 60px;
      position: relative;
      border-radius: 0;
    }

    .custom-file-label::after {
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
