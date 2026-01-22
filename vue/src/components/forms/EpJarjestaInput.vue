<template>
  <div class="flex items-center w-full">
    <div class="flex items-center order-input pl-1 grow">
      <ep-material-icon
        class="order-handle"
        size="18px"
      >
        drag_indicator
      </ep-material-icon>
      <ep-input
        class="w-full"
        :model-value="modelValue"
        :is-editing="isEditing"
        :placeholder="placeholder"
        @update:model-value="$emit('update:modelValue', $event)"
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

