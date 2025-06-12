<template>
  <div class="content">
    <div :class="{'container': container}">
      <div v-if="hasHeaderSlot">
        <slot name="header" />
      </div>
      <div
        v-if="hasDefaultSlot"
        :class="{'view-content': hasHeaderSlot}"
      >
        <slot name="default" />
      </div>
      <slot name="custom-content" />
    </div>
    <slot name="after" />
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { hasSlotContent } from '../../utils/vue-utils';

const props = defineProps({
  container: {
    type: Boolean,
    default: false
  }
});

const slots = useSlots();

const hasHeaderSlot = computed(() => {
  return hasSlotContent(slots.header);
});

const hasDefaultSlot = computed(() => {
  return hasSlotContent(slots.default);
});
</script>

<style scoped lang="scss">

@import "../../styles/_variables.scss";

.content {
  padding: 20px;
}

.col-fixed {
  flex: 0 0 $main-view-offset;
}

h5 {
  overflow-x: hidden;
}

.view-content {
  margin-top: 40px;
}

</style>
