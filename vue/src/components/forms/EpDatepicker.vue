<template>
  <div
    v-if="isEditing"
    class="ep-date-picker flex flex-col w-[225px]"
  >
    <DatePicker
      :model-value="dateValue"
      date-format="dd.mm.yy"
      :placeholder="$t('valitse-pvm')"
      :showButtonBar="true"
      :invalid="state === false"
      show-icon
      :manual-input="true"
      class="ep-date-input-wrapper"
      :class="{ 'is-invalid': state === false }"
      @update:model-value="onDateSelect"
      @blur="onBlur"
    />

    <div
      v-if="!validationError && validMessage"
      class="valid-feedback"
    >
      {{ $t(validMessage) }}
    </div>
    <div
      v-else-if="validationError && isDirty"
      :class="{ 'is-warning': isWarning }"
    >
      <div
        v-if="invalidMessage"
        class="validation-error"
      >
        {{ $t(invalidMessage) }}
      </div>
      <div
        v-else
        class="validation-error"
      >
        {{ message }}
      </div>
    </div>
    <small
      v-if="help && isEditing"
      class="form-help"
    >{{ $t(help) }}</small>
  </div>
  <div v-else>
    {{ locdate }}
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import DatePicker from 'primevue/datepicker';
import { $sd, $ldt, $ld, $t } from '@shared/utils/globals';

// Define props
const props = defineProps({
  modelValue: {
    type: [Date, Number, String, null],
    required: false,
  },
  type: {
    type: String,
    default: 'sd',
    validator(value: string) {
      return _.includes(['date', 'datetime', 'sd'], value);
    },
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  help: {
    type: String,
    default: '',
  },
  showValidValidation: {
    type: Boolean,
    default: true,
    required: false,
  },
  endOfDay: {
    type: Boolean,
    default: false,
  },
  validation: {
    type: Object,
    default: null,
  },
  validMessage: {
    type: String,
    default: null,
  },
  invalidMessage: {
    type: String,
    default: null,
  },
  isWarning: {
    type: Boolean,
    default: false,
  },
});

// Define emits
const emit = defineEmits(['update:modelValue', 'blur']);

// Validation setup
const v$ = useVuelidate();

// Computed properties - Date | null for PrimeVue DatePicker
const dateValue = computed(() => {
  const val = props.modelValue;
  if (val == null || val === '') return null;
  const date = _.isNumber(val) ? new Date(val) : (val instanceof Date ? val : new Date(val));
  if (isNaN(date.getTime())) return null;
  return date;
});

const state = computed(() => {
  if (!props.showValidValidation || props.validation?.isValid) {
    return null;
  }
  return props.validation?.isValid;
});

const locdate = computed(() => {
  if (!props.modelValue) {
    return $t('ei-asetettu');
  }
  else if (props.type === 'datetime') {
    return $ldt(props.modelValue);
  }
  else if (props.type === 'sd') {
    return $sd(props.modelValue);
  }
  else {
    return $ld(props.modelValue);
  }
});

const validationError = computed(() => {
  return props.validation?.error;
});

const isDirty = computed(() => {
  return props.validation?.$dirty;
});

const message = computed(() => {
  return props.validation?.message;
});

// Methods
const onDateSelect = (date: Date | null) => {
  let value: Date | null = date;
  if (date && props.endOfDay) {
    value = new Date(date);
    value.setHours(23, 59, 59, 999);
  }
  emit('update:modelValue', value);
  if (props.validation) {
    props.validation.$touch();
  }
};

const onBlur = () => {
  emit('blur');
};
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.ep-date-input-wrapper {
  :deep(.p-inputtext) {
    padding: 0.375rem 0.75rem;
    border: 1px solid $grey300;
    border-radius: 4px;
    font-size: 1rem;
    line-height: 1.5;
  }

  &.is-invalid :deep(.p-inputtext) {
    border-color: $invalid;
  }
}

.validation-error {
  display: block;
  color: $invalid;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-help {
  color: $grey500;
  font-size: 0.875rem;
}
</style>
