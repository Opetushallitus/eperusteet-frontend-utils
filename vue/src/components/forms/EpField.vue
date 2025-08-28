<template>
  <ep-input
    class="form-data"
    :model-value="modelValue"
    :is-editing="isEditing"
    :is-header="isHeader"
    :type="type"
    :validation="validation"
    :help="help"
    :show-valid-validation="showValidValidation"
    :unit="unit"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #suffix>
      <slot />
    </template>
  </ep-input>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import EpInput from './EpInput.vue';

const props = defineProps({
  modelValue: { type: [String, Object], required: true },
  isHeader: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false },
  type: { type: String, default: 'localized' },
  help: { type: String, default: '' },
  showValidValidation: { type: Boolean, default: true },
  unit: { type: [String, Object], required: false },
  validation: {
    required: false,
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);
</script>
