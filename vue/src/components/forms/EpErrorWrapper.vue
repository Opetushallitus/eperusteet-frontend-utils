<template>
  <div class="d-flex flex-column">
    <slot />
    <b-form-invalid-feedback :state="!validation?.$invalid">
      {{ $t(message) }}
    </b-form-invalid-feedback>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import _ from 'lodash';

const props = defineProps({
  validMessage: {
    type: String,
    required: false,
  },
  invalidMessage: {
    type: String,
    required: false,
  },
  validation: {
    type: Object,
    default: null,
  },
});

const isEditing = inject('isEditing', true);

// Get all failed validators (keys without $ prefix that have value === false)
const failedValidators = computed(() => {
  if (!props.validation) {
    return [];
  }
  return _(props.validation)
    .keys()
    .reject((key) => _.startsWith(key, '$'))
    .filter((key) => props.validation[key] === false)
    .value();
});

const validationError = computed(() => {
  if (isEditing === undefined || isEditing) {
    return _.first(failedValidators.value) || null;
  }
  return null;
});

const message = computed(() => {
  if (validationError.value && !props.invalidMessage) {
    return `validation-error-${validationError.value}`;
  }
  return '';
});
</script>
