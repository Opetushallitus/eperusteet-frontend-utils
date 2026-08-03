<template>
  <div v-if="!isEditing">
    <div v-if="model">
      {{ model }}
      <slot>
        {{ $t('osaamispiste') }}
      </slot>
    </div>
    <div v-else>
      -
    </div>
  </div>
  <div
    v-else
    class="flex flex-col"
  >
    <div class="flex items-center">
      <div class="grow">
        <ep-input
          v-model="model"
          type="number"
          min="0"
          max="999"
          :is-editing="isEditing"
          :validation="validation"
          @focus="onInputFocus"
        />
      </div>
      <div class="ml-2">
        <slot>
          {{ $t('osaamispiste') }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpErrorWrapper from '../forms/EpErrorWrapper.vue';
import { useVuelidate } from '@vuelidate/core';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  validation: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

// Use vuelidate for validation
const v$ = useVuelidate();

// Initialize the model with the value from props
const model = ref(props.modelValue || 0);

// Watch for changes in the value prop
watch(() => props.modelValue, (newValue) => {
  model.value = newValue;
}, { immediate: true });

// Watch for changes to the model
watch(() => model.value, (newValue) => {
  if (!isNaN(Number(newValue))) {
    model.value = Math.max(Math.min(9999, Number(newValue)), 0);
  }
  emit('update:modelValue', model.value);
}, { immediate: true });

const onInputFocus = () => {
  if (model.value === 0) {
    emit('update:modelValue', undefined);
  }
};
</script>

<style lang="scss" scoped>
</style>
