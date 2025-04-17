
<template>
  <component
    :is="`h${headingLevel}`"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>
<script setup lang="ts">
import { h, computed, useSlots } from 'vue';

const props = defineProps({
  level: {
    type: Number,
    required: true,
  },
});

const slots = useSlots();

// Compute actual heading level
const headingLevel = computed(() => {
  if (props.level < 1) {
    return 1;
  }
  else if (props.level > 6) {
    return 6;
  }
  return props.level;
});
</script>
