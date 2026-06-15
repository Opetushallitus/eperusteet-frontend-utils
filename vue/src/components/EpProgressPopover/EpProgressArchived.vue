<template>
  <EpProgress
    :slices="slices"
    :height="height"
    :width="width"
  />
</template>

<script setup lang="ts">
import EpProgress from './EpProgress.vue';

const slices = [0];

defineProps({
  height: {
    type: Number,
    default: 60,
  },
  width: {
    type: Number,
    default: 60,
  },
});
</script>
