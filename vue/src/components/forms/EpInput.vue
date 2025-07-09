<template>
  <div v-if="isEditing">
    <div class="input-container d-flex align-items-center">
      <input
        v-bind="$attrs"
        class="input-style form-control"
        :class="[ inputClass ]"
        :placeholder="placeholderValue"
        :type="type === 'number' ? 'number' : 'text'"
        step="any"
        :value="val"
        :disabled="disabled"
        @focus="onInputFocus"
        @blur="onInputBlur"
        @input="onInput($event.target.value)"
      >
      <div
        v-if="hasLeftSlot"
        class="addon addon-left"
      >
        <slot name="left" />
      </div>
      <div
        v-if="hasRightSlot"
        class="addon addon-right"
      >
        <slot name="right" />
      </div>
      <div
        v-if="hasSuffixSlot"
        class="ml-2"
      >
        <slot name="suffix" />
      </div>
    </div>
    <div v-if="showMessage">
      <div
        v-if="!validationError && validMessage"
        class="valid-feedback"
      >
        {{ $t(validMessage) }}
      </div>
      <div
        v-if="validationError && isDirty"
        :class="{ 'is-warning': isWarning }"
      >
        <div
          v-if="invalidMessage"
          class="invalid-feedback"
        >
          {{ $t(invalidMessage) }}
        </div>
        <div
          v-else
          class="invalid-feedback"
        >
          {{ message }}
        </div>
      </div>
      <small
        v-if="help && isEditing"
        class="form-text text-muted"
      >{{ $t(help) }}</small>
    </div>
  </div>
  <div
    v-else
    v-bind="$attrs"
  >
    <h2 v-if="isHeader">
      {{ val }}
    </h2>
    <span v-else-if="val">{{ val }}{{ unit ? ' ' + $kaannaOlioTaiTeksti(unit) : '' }}</span>
    <span
      v-else-if="placeholderValue"
      class="placeholder"
    >{{ placeholderValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, getCurrentInstance } from 'vue';
import _ from 'lodash';
import { Kielet } from '../../stores/kieli';
import { createLogger } from '../../utils/logger';
import { unescapeStringHtml } from '@shared/utils/inputs';
import { useVuelidate } from '@vuelidate/core';
import { hasSlotContent } from '../../utils/vue-utils';
import { $kaannaPlaceholder } from '@shared/utils/globals';

const logger = createLogger('EpInput');

const TextArea = document.createElement('textarea');

function escapeHtml(str: string | null) {
  if (!str) {
    return '';
  }
  else {
    TextArea.textContent = str;
    return removeHiddenCharacters(TextArea.innerHTML);
  }
}

function removeHiddenCharacters(input: string): string {
  // Regular expression to match common hidden or invisible characters
  const hiddenCharactersRegex = /[\u00AD\u200B\u200C\u200D\u2060\uFEFF\u2028\u2029\u00A0\u2009\u200A\u2003\u2002\u202A\u202B\u202C\u202D\u202E]/g;
  return input.replace(hiddenCharactersRegex, '');
}

// Define props
const props = defineProps({
  type: {
    default: 'localized',
    type: String,
    validator: (value: string) => ['localized', 'string', 'number'].includes(value)
  },
  modelValue: {
    required: true
  },
  isHeader: {
    default: false,
    type: Boolean
  },
  isEditing: {
    default: false,
    type: Boolean
  },
  help: {
    default: '',
    type: String
  },
  placeholder: {
    default: '',
    type: String
  },
  showValidValidation: {
    default: true,
    required: false,
    type: Boolean
  },
  showMessage: {
    default: true,
    type: Boolean
  },
  unit: {
    required: false
  },
  disabled: {
    default: false,
    type: Boolean
  },
  change: {
    required: false,
    type: Function
  },
  validation: {
    required: false,
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
  }
});

// Define emits
const emit = defineEmits(['update:modelValue', 'focus', 'blur']);

// Validation setup
const v$ = useVuelidate();

// State
const focus = ref(false);
const slots = useSlots();

// Computed properties
const hasLeftSlot = computed(() => {
  return hasSlotContent(slots.left);
});

const hasRightSlot = computed(() => {
  return hasSlotContent(slots.right);
});

const hasSuffixSlot = computed(() => {
  return hasSlotContent(slots.suffix);
});

const inputClass = computed(() => {
  return {
    'left-padded': hasLeftSlot.value,
    'right-padded': hasRightSlot.value,
    'is-invalid': !props.isWarning && isInvalid.value,
    'is-warning': props.isWarning && isInvalid.value,
    'is-valid': isValid.value && props.showValidValidation,
  };
});

const validationError = computed(() => {
  return props.validation?.error;
});

const isDirty = computed(() => {
  return props.validation?.$dirty;
});

const isInvalid = computed(() => {
  return props.validation?.error;
});

const isValid = computed(() => {
  return props.validation?.isValid;
});

const message = computed(() => {
  return props.validation?.message;
});

const val = computed(() => {
  const target = _.isObject(props.modelValue)
    ? (props.modelValue as any)[Kielet.getSisaltoKieli.value]
    : props.modelValue;

  return unescapeStringHtml(target);
});

const placeholderValue = computed(() => {
  if (!focus.value) {
    if (props.placeholder) {
      return props.placeholder;
    }

    return $kaannaPlaceholder(props.modelValue as any, !props.isEditing);
  }
  return '';
});

const onInput = (input: any) => {
  if (props.type === 'string' && !_.isString(props.modelValue) && typeof props.modelValue !== 'undefined') {
    logger.warn('Given value is not a string:', props.modelValue);
  }

  if (props.type === 'number' && !_.isNumber(props.modelValue) && typeof props.modelValue !== 'undefined') {
    logger.warn('Given value is not a number:', props.modelValue);
  }

  if (props.type === 'localized'
    && !_.isPlainObject(props.modelValue)
    && !_.isNull(props.modelValue)
    && !_.isUndefined(props.modelValue)) {
    logger.warn('Given value is not an object:', props.modelValue);
  }

  if (props.type === 'number') {
    emit('update:modelValue', Number(input));
  }
  else if (props.type !== 'localized' || _.isString(props.modelValue)) {
    emit('update:modelValue', escapeHtml(input));
  }
  else {
    emit('update:modelValue', {
      ...(_.isObject(props.modelValue) ? props.modelValue as any : {}),
      [Kielet.getSisaltoKieli.value]: _.isString(input) ? escapeHtml(input) : input,
    });
  }

  if (props.change) {
    props.change();
  }
};

const onInputFocus = () => {
  focus.value = true;
  emit('focus');
};

const onInputBlur = () => {
  focus.value = false;
  emit('blur');
};
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.input-container {
  position: relative;

  .addon {
    position: absolute;
  }

  input.left-padded {
    padding-left: 32px;
  }

  input.right-padded {
    padding-right: 18px;
  }

  .addon-left {
    top: 0;
    left: 0;
  }

  .addon-right {
    right: 0;
  }

}

input.input-style {
  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
}

input.is-warning:focus {
  border-color: #ffc107;
}

input.is-invalid:focus {
  border-color: #dc3545;
}

input {
  &.is-valid {
    border-color: #E0E0E1;
  }

  &.is-valid:focus {
    border-color: $valid;
  }
}

input::placeholder {
  color: #adb5bd;
}

.is-warning {
  .invalid-feedback {
    color: orange;
  }
}

:deep(.invalid-feedback), :deep(.valid-feedback) {
}

// Piilotettu Bootstrapissa oletuksena
.invalid-feedback {
  display: block;
}

.placeholder {
  opacity: 0.5;
}

</style>
