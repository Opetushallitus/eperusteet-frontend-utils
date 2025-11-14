<template>
  <div class="ep-radio">
    <div class="radio-option">
      <input
        :id="uniqueId"
        type="radio"
        :name="name"
        :value="value"
        :checked="equals"
        :disabled="!isEditing || disabled"
        @change="updateValue(value)"
      >
      <label :for="uniqueId">
        <slot>{{ label }}</slot>
      </label>
    </div>
    <div
      v-if="showMessage && help"
      class="help-text"
    >
      {{ $t(help) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '../../utils/globals';
import _ from 'lodash';

const props = defineProps({
  modelValue: {
    required: true,
  },
  value: {
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  isEditing: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: undefined,
  },
  help: {
    type: String,
    default: '',
  },
  showMessage: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const uniqueId = computed(() => {
  return `ep-radio-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
});

const updateValue = (value) => {
  emit('update:modelValue', value);
};

const equals = computed(() => {
  return _.isEqual(props.modelValue, props.value);
});
</script>

<style scoped lang="scss">
.ep-radio {
  margin-bottom: 0.5rem;
}

.radio-option {
  input[type="radio"] {
    margin-right: 0.5rem;
  }

  label {
    margin-bottom: 0;
    cursor: pointer;
  }
}

.help-text {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

input[type="radio"]:disabled + label {
  color: #6c757d;
  cursor: not-allowed;
}
</style>
