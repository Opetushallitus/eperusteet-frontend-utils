<template>
  <div class="ep-content-view">
    <div
      v-if="hasHeader"
      class="header border-bottom-1"
    >
      <slot name="header" />
    </div>
    <div class="content">
      <slot name="default" />
    </div>
    <slot name="after" />
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { hasSlotContent } from '../../utils/vue-utils';

const slots = useSlots();

const hasHeader = computed(() => {
  return hasSlotContent(slots.header);
});
</script>

<style scoped lang="scss">

@import "../../styles/_variables.scss";

.content {
  padding: $content-padding;
}

.header {
  padding: $content-padding;
}

</style>
