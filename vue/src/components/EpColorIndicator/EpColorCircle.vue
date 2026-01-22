<template>
  <EpPopover
    :triggers="['hover']"
    :disabled="!help"
  >
    <template #trigger>
      <span
        ref="circle"
        :style="circleStyle"
        :title="help ? $t(help) : ''"
        :class="circleClass"
      >
      </span>
    </template>
    <span>{{ $t(help) }}</span>
  </EpPopover>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import EpPopover from '../EpPopover/EpPopover.vue';

const props = defineProps({
  color: {
    type: String,
    default: '#000000',
  },
  help: {
    type: String,
    required: false,
  },
  size: {
    type: Number,
    default: 10,
  },
});

const circle = useTemplateRef('circle');

const circleStyle = computed(() => {
  return {
    'min-height': props.size + 'px',
    'min-width': props.size + 'px',
    'background': props.color,
  };
});

const circleClass = computed(() => {
  return props.help ? 'circle circle-tooltip' : 'circle';
});
</script>

<style lang="scss" scoped>
@import '../../styles/_variables.scss';

.circle {
  background: black;
  border-radius: 100%;
  display: inline-block;
}

.circle-tooltip {
  cursor: help;
}

</style>
