<template>
  <div class="ep-toggle-group" :class="{ 'stacked': stacked }">
    <div v-if="isEditing" class="checkbox-group">
      <EpToggle
        v-for="(item, index) in items"
        :key="uniqueId + index"
        :model-value="isItemSelected(item)"
        :checkbox="true"
        :is-switch="false"
        :is-editing="!disabled"
        :inline="!stacked"
        class="checkbox-item"
        @update:model-value="toggleItem(item)"
      >
        <slot :item="item" />
      </EpToggle>
    </div>
    <div v-else>
      <span
        v-for="(item, index) in innerValue"
        :key="uniqueId + index"
      >
        <slot :item="item" /><span
          v-if="index < innerValue.length - 1"
          class="mr-0"
        >, </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EpToggle from './EpToggle.vue';

const props = defineProps({
  modelValue: {
    type: Array as () => any[],
    default: () => [],
  },
  items: {
    type: Array as () => any[],
    required: true,
  },
  stacked: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isEditing: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const uniqueId = `ep-toggle-group-${Math.random().toString(36).substr(2, 9)}`;

const isItemSelected = (item: any) => {
  return innerValue.value.includes(item);
};

const toggleItem = (item: any) => {
  const newValue = [...innerValue.value];
  const index = newValue.indexOf(item);

  if (index > -1) {
    newValue.splice(index, 1);
  } else {
    newValue.push(item);
  }

  innerValue.value = newValue;
};
</script>

<style scoped lang="scss">
.ep-toggle-group {
  .checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &.stacked .checkbox-group {
    flex-direction: column;
    gap: 0.5rem;
  }

  .checkbox-item {
    margin: 0;
  }
}
</style>
