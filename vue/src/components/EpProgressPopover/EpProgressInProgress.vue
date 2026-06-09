<template>
  <EpProgress
    :slices="slices"
    :height="height"
    :width="width"
  />
</template>

<script setup lang="ts">
import EpProgress from './EpProgress.vue';

defineProps({
  height: {
    type: Number,
    default: 60,
  },
  width: {
    type: Number,
    default: 60,
  },
  slices: {
    type: Array as () => number[],
    required: false,
    default: () => [0.2, 0.5, 1],
  },

});
</script>
