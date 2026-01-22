<template>
  <div
    v-if="isEditing"
    class="ep-date-picker"
  >
    <b-form-datepicker
      :value="modelValueComputed"
      :locale="locale"
      start-weekday="1"
      :placeholder="$t('valitse-pvm')"
      :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
      :state="state"
      reset-button
      close-button
      :label-reset-button="$t('tyhjenna')"
      :label-close-button="$t('sulje')"
      :label-no-date-selected="$t('valitse-pvm')"
      :label-help="$t('kalenteri-navigointi-ohje')"
      :value-as-date="true"
      :hide-header="true"
      :no-flip="true"
      @input="onInput"
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
        class="block text-red-600 text-sm mt-1"
      >
        {{ $t(invalidMessage) }}
      </div>
      <div
        v-else
        class="block text-red-600 text-sm mt-1"
      >
        {{ message }}
      </div>
    </div>
    <small
      v-if="help && isEditing"
      class="form-text text-gray-500"
    >{{ $t(help) }}</small>
  </div>
  <div v-else>
    {{ locdate }}
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { Kielet } from '../../stores/kieli';
import { useVuelidate } from '@vuelidate/core';
import { $sd, $ldt, $ld, $t } from '@shared/utils/globals';

// Define props
const props = defineProps({
  modelValue: {
    type: [Date, Number, String],
    required: true,
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

// Computed properties
const modelValueComputed = computed(() => {
  if (_.isNumber(props.modelValue)) {
    return new Date(props.modelValue);
  }
  return props.modelValue;
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

const locale = computed(() => {
  return Kielet.getUiKieli.value;
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
const onInput = (event: any) => {
  if (event && props.endOfDay) {
    event.setHours(23);
    event.setMinutes(59);
    event.setSeconds(59);
  }
  emit('update:modelValue', event);
  if (props.validation) {
    props.validation.$touch();
  }
};

const onBlur = () => {
  emit('blur');
};
</script>

<style scoped lang="scss">
:deep(.ep-datepicker-validation) {
  padding-right: calc(3em + .75rem) !important;
}

:deep(.ep-datepicker-validation ~ .mx-input-append) {
  right: 30px;
}

</style>
