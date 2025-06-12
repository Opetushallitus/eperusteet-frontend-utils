<template>
  <span
    :class="'material-icons' + shape"
    class="icon"
    :style="{color: color, fontSize: size, background: background}"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  iconShape: { type: String, required: false, default: '' },
  color: { type: String, required: false },
  background: { type: String, required: false },
  size: { type: String, required: false },
});

const shape = computed(() => {
  if (props.iconShape === 'outlined' || props.iconShape === 'rounded') {
    return '-' + props.iconShape;
  }
  else {
    return '';
  }
});
</script>

<style lang="scss" scoped>

.icon {
  display: inline-block !important;
  vertical-align: sub;
}

</style>
