<template>
  <div>
    <b-form-checkbox
      :value="innerValue"
      :disabled="!isEditing"
      :inline="inline"
      :switch="asSwitch"
      :class="{ 'custom-checkbox-lg': !asSwitch && lgSize, 'custom-switch-lg': asSwitch && lgSize }"
      @input="handleInput"
    >
      <slot />
    </b-form-checkbox>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
    required: false,
  },
  inline: {
    type: Boolean,
    default: true,
  },
  isSwitch: {
    type: Boolean,
    default: true,
  },
  checkbox: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    required: false,
    default: undefined,
  },
});

const emit = defineEmits(['update:modelValue']);

const lgSize = computed(() => {
  return props.size ? props.size === 'lg' : false;
});

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const asSwitch = computed(() => {
  return !props.checkbox && props.isSwitch;
});

const handleInput = (val) =>{
  innerValue.value = val;
};

const uniqueId = computed(() => {
  return `ep-toggle-${Math.random().toString(36)}`;
});
</script>

<style scoped lang="scss">

@import '@shared/styles/bootstrap.scss';
@import '@shared/styles/_mixins.scss';

:deep(.custom-checkbox .custom-control-input:disabled:checked ~ .custom-control-label::before) {
  border-width: 0;
}

large checkbox
:deep(.custom-checkbox-lg) {
  padding-left: 2rem;
  .custom-control-input {
    left: 0;
    width: 1.5rem;
    height: 1.5rem;
  }
}

:deep(.custom-checkbox-lg label.custom-control-label::before) {
  top: 0rem;
  left: -1.7rem;
  width: 1.5rem;
  height: 1.5rem;
}

:deep(.custom-checkbox-lg label.custom-control-label::after) {
  top: 0rem;
  left: -1.7rem;
  width: 1.5rem;
  height: 1.5rem;
}

// Large switch
:deep(.custom-switch-lg) {
  padding-left: 3rem;
  .custom-control-input {
    left: 0;
    width: 2.625rem;
    height: 1.5rem;
  }
}

:deep(.custom-switch-lg label.custom-control-label::before) {
  top: 0rem;
  left: -3.125rem;
  width: 2.625rem;
  height: 1.5rem;
}

:deep(.custom-switch-lg label.custom-control-label::after) {
  top: 0.125rem;
  left: -3rem;
  width: 1.25rem;
  height: 1.25rem;
}

:deep(.custom-switch .custom-control-input:checked ~ .custom-control-label::after) {
  transform: translateX(1.125rem)
}

:deep(.custom-checkbox) {
  @include focus-within;
}

</style>
