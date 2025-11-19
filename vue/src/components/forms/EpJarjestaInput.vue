<template>
  <div class="d-flex align-items-center w-100">
    <div class="d-flex align-items-center order-input pl-1 flex-grow-1">
      <ep-material-icon
        class="order-handle"
        size="18px"
      >
        drag_indicator
      </ep-material-icon>
      <ep-input
        class="w-100"
        :model-value="modelValue"
        :is-editing="isEditing"
        @update:model-value="$emit('update:modelValue', $event)"
        :placeholder="placeholder"
      />
    </div>
    <ep-button
      variant="link"
      icon="delete"
      @click="$emit('delete')"
    />
  </div>
</template>

<script setup lang="ts">
import EpMaterialIcon from '../EpMaterialIcon/EpMaterialIcon.vue';
import EpInput from './EpInput.vue';
import EpButton from '../EpButton/EpButton.vue';

defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  isEditing: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
});

defineEmits(['update:modelValue', 'delete']);
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.order-input {
  border: 1px solid $black;

  :deep(input) {
    border: none !important;
  }
}
</style>

