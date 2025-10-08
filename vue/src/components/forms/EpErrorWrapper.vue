<template>
  <div
    class="d-flex flex-column"
    :class="{ 'is-warning': isWarning }"
  >
    <div class="d-flex">
      <slot />
    </div>
    <div>
      <b-form-invalid-feedback :state="false">
        {{ message }}
      </b-form-invalid-feedback>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useVuelidate } from '@vuelidate/core';
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
  warning: {
    type: Boolean,
    default: false,
  },
});

const v$ = useVuelidate();

const isWarning = computed(() => {
  if (validationError.value && props.validation?.$params) {
    return props.validation.$params[validationError.value]?.type === 'warning';
  }
  return false;
});

const isDirty = computed(() => {
  return props.validation?.$dirty || false;
});

const isInvalid = computed(() => {
  return props.validation && isDirty.value && props.validation.$invalid;
});

const isValid = computed(() => {
  return props.validation && !props.validation.$invalid;
});

const validators = computed(() => {
  return _(props.validation)
    .keys()
    .reject((key) => _.startsWith(key, '$'))
    .reject((key) => props.validation[key])
    .value();
});

const errorValidators = computed(() => {
  if (props.validation) {
    return _.reject(validators.value, x => props.validation.$params[x]?.type === 'warning');
  }
  return [];
});

const validationError = computed(() => {
  // Determine if we're in edit mode through inject or fallback to true
  const isEditing = inject('isEditing', true);

  if (isEditing === undefined || isEditing) {
    return _.first(errorValidators.value) || _.first(validators.value) || null;
  }
  else {
    return null;
  }
});

const message = computed(() => {
  if (validationError.value && !props.invalidMessage) {
    const prefix = isWarning.value
      ? 'validation-warning-'
      : 'validation-error-';
    // We need to get the translation function from the global properties
    // This is a simplification - ideally you'd use getCurrentInstance() to access $t
    // return $t(prefix + (validationError.value || ''), props.validation.$params[validationError.value]) || '';
    return validationError.value ? `${prefix}${validationError.value}` : '';
  }
  return '';
});

// Methods
const onFocus = () => {
  // Intentionally empty
};

const onBlur = () => {
  if (props.validation) {
    props.validation.$touch();
  }
};
</script>

<style scoped lang="scss">
.is-warning {
  .invalid-feedback {
    color: orange;
  }
}
</style>
