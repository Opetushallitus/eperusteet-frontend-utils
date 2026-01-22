<template>
  <div class="ep-toggle" :class="{ 'inline': inline, 'large': lgSize }">
    <Checkbox
      v-if="!asSwitch"
      v-model="innerValue"
      :disabled="!isEditing"
      :binary="true"
      :input-id="uniqueId"
    />
    <ToggleSwitch
      v-else
      v-model="innerValue"
      :disabled="!isEditing"
      :input-id="uniqueId"
    />
    <label :for="uniqueId" class="toggle-label">
      <slot>{{ label }}</slot>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Checkbox from 'primevue/checkbox';
import ToggleSwitch from 'primevue/toggleswitch';

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: [Boolean, String],
    default: false,
    required: false,
  },
  label: {
    type: String,
    default: '',
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

// Convert string values to boolean
const normalizedValue = computed(() => {
  if (props.modelValue === 'true') return true;
  if (props.modelValue === 'false') return false;
  return Boolean(props.modelValue);
});

const innerValue = computed({
  get: () => normalizedValue.value,
  set: (value) => emit('update:modelValue', value),
});

const asSwitch = computed(() => {
  return !props.checkbox && props.isSwitch;
});

const handleUpdate = (value: boolean) => {
  emit('update:modelValue', value);
};

// Generate unique ID once, not on every render
const uniqueId = `ep-toggle-${Math.random().toString(36).substr(2, 9)}`;
</script>

<style scoped lang="scss">
.ep-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &.inline {
    display: inline-flex;
  }

  .toggle-label {
    cursor: pointer;
    margin: 0;
  }

  &.large {
    :deep(.p-checkbox) {
      width: 1.5rem;
      height: 1.5rem;

      .p-checkbox-box {
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    :deep(.p-toggleswitch) {
      width: 2.625rem;
      height: 1.5rem;

      .p-toggleswitch-slider {
        &:before {
          width: 1.25rem;
          height: 1.25rem;
        }
      }
    }
  }
}
</style>
