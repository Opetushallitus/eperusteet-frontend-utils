<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div class="d-inline-flex">
      <EpMaterialIcon
        color="#3367E3"
        class="mr-2"
        alt="pdf"
      >picture_as_pdf</EpMaterialIcon>
      <slot />
    </div>
  </a>
</template>

<script setup lang="ts">
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
