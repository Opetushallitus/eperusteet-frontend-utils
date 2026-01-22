<template>
  <div v-if="isEditing">
    <div v-if="items && (!multiple || innerModel)">
      <select
        v-if="!useCheckboxes"
        v-model="innerModel"
        class="form-control"
        :multiple="multiple"
        :class="{ 'is-invalid': isInvalid, 'is-valid': isValid }"
        :disabled="disabled"
      >
        <option
          v-if="enableEmptyOption"
          :value="null"
          :disabled="emptyOptionDisabled"
          :hidden="emptyOptionDisabled"
        >
          {{ $t(placeholder) }}
        </option>
        <option
          v-for="(item, idx) in items"
          :key="idx"
          :value="item"
        >
          <slot
            name="default"
            :item="item"
          >
            {{ item }}
          </slot>
        </option>
      </select>
      <EpFormGroup
        v-else
        class="m-0 p-0"
      >
        <EpToggleGroup
          v-model="innerModel"
          :items="items"
          stacked
          :class="{ 'is-invalid': isInvalid, 'is-valid': isValid }"
        >
          <template #default="{ item }">
            <slot
              name="default"
              :item="item"
            >
              <span>{{ item }}</span>
            </slot>
          </template>
        </EpToggleGroup>
      </EpFormGroup>
      <div
        v-if="!validationError && validMessage"
        class="valid-feedback"
      >
        {{ $t(validMessage) }}
      </div>
      <div
        v-else-if="validationError && invalidMessage"
        class="block text-red-600 text-sm mt-1"
      >
        {{ $t(invalidMessage) }}
      </div>
      <div
        v-else-if="validationError && !invalidMessage"
        class="block text-red-600 text-sm mt-1"
      >
        {{ $t('validation-error-' + validationError) }}
      </div>
      <small
        v-if="help && isEditing"
        class="form-text text-gray-500"
      >{{ $t(help) }}</small>
    </div>
    <ep-spinner v-else />
  </div>
  <div v-else>
    <ul>
      <li
        v-for="(item, idx) in displayValue"
        :key="idx"
      >
        <slot
          name="default"
          :item="item"
        >
          <span>{{ item }}</span>
        </slot>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, watch, getCurrentInstance } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { $t } from '@shared/utils/globals';

import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpToggleGroup from './EpToggleGroup.vue';
import EpFormGroup from './EpFormGroup.vue';

const props = defineProps({
  isEditing: {
    default: false,
    type: Boolean,
  },
  items: {
    required: true,
    type: Array,
  },
  modelValue: {
    required: true,
  },
  useCheckboxes: {
    default: false,
    type: Boolean,
  },
  multiple: {
    default: false,
    type: Boolean,
  },
  enableEmptyOption: {
    default: true,
    type: Boolean,
  },
  help: {
    default: '',
    type: String,
  },
  placeholder: {
    default: '',
    type: String,
  },
  disabled: {
    default: false,
    type: Boolean,
  },
  emptyOptionDisabled: {
    default: false,
    type: Boolean,
  },
  validation: {
    type: Object,
    default: () => ({}),
  },
  validMessage: {
    default: '',
    type: String,
  },
  invalidMessage: {
    default: '',
    type: String,
  },
});

const emit = defineEmits(['update:modelValue']);

const displayValue = computed(() => {
  return _.filter(props.items, (item) => _.includes(props.modelValue, item));
});

const innerModel = computed({
  get() {
    if (props.modelValue) {
      return props.modelValue;
    }
    else if (props.multiple) {
      return [];
    }
    else {
      return null;
    }
  },
  set(value) {
    if (_.isArray(value)) {
      if (!_.isEqual(value, props.modelValue)) {
        emit('update:modelValue', [...value]);
      }
    }
    else {
      if (!_.isEqual(value, props.modelValue)) {
        emit('update:modelValue', value);
      }
    }

    if (props.validation?.$touch) {
      props.validation?.$touch();
    }
  },
});

// Import validation functions from the validation mixin
const v$ = useVuelidate(props.validation, innerModel);

const validationError = computed(() => {
  return v$.value.$invalid;
});

const isValid = computed(() => {
  return v$.value.$valid;
});

const isInvalid = computed(() => {
  return v$.value.$invalid;
});

// Watch for items changes (replaces @Watch decorator)
watch(
  () => props.items,
  () => {
    if (!props.enableEmptyOption && _.size(props.items) > 0 && props.modelValue === null && !props.multiple) {
      innerModel.value = _.first(props.items);
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

select {
  // Chrome pakottaa oman border-radiuksen ilman
  appearance: none;
  background: url('../../../public/img/icons/vakanen-alas.svg') no-repeat right $white;
  background-position-x: calc(100% - 5px);
  background-position-y: calc(100% - 2px);
}

:deep(label.custom-control-label::before) {
  border: 2px solid #E0E0E1;
  border-radius: 0.2rem;
}

:deep(input.custom-control-input) {
  appearance: none;
}


select {
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 500;

  &:focus {
    border-color: #47a4f5;
    outline: none !important;
    box-shadow: none !important;
  }
}
</style>
