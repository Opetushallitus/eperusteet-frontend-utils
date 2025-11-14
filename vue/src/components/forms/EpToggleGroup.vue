<template>
  <div class="ep-toggle-group">
    <b-form-checkbox-group
      v-if="isEditing"
      :checked="innerValue"
      :value="innerValue"
      :stacked="stacked"
      @input="innerValue = $event"
    >
      <b-form-checkbox
        v-for="(item, index) in items"
        :key="uniqueId + index"
        :value="item"
      >
        <slot :item="item" />
      </b-form-checkbox>
    </b-form-checkbox-group>
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

const uniqueId = computed(() => {
  return `ep-toggle-group-${Math.random().toString(36)}`;
});
</script>

<style scoped lang="scss">

</style>
