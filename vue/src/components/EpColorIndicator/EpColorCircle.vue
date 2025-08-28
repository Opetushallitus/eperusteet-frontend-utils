<template>
  <span
    ref="circle"
    :style="circleStyle"
    :title="help ? $t(help) : ''"
    :class="circleClass"
  >
    <b-popover
      v-if="help"
      :target="() => circle"
      :placement="'top'"
      triggers="hover"
      variant="primary"
    >
      <span>{{ $t(help) }}</span>
    </b-popover>
  </span>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: '#000000'
  },
  help: {
    type: String,
    required: false
  },
  size: {
    type: Number,
    default: 10
  }
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
