<template>
  <div class="spinner">
    <ep-spinner v-if="isLoading" />
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import EpSpinner from './EpSpinner.vue';

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
});
</script>

<style>
</style>
