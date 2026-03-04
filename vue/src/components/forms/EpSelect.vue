<template>
  <div v-if="isEditing">
    <div v-if="items && (!multiple || innerModel)">
      <Select
        v-if="!useCheckboxes && !multiple"
        v-model="innerModel"
        :options="items"
        :placeholder="placeholder ? $t(placeholder) : undefined"
        :disabled="disabled"
        :invalid="isInvalid"
        :show-clear="enableEmptyOption && !emptyOptionDisabled"
        class="ep-select w-full"
        :class="{ 'is-invalid': isInvalid, 'is-valid': isValid }"
      >
        <template
          v-if="$slots.default"
          #value="{ value }"
        >
          <slot
            v-if="value != null"
            name="default"
            :item="value"
          >
            <span>{{ value }}</span>
          </slot>
        </template>
        <template
          v-if="$slots.default"
          #option="{ option }"
        >
          <slot
            name="default"
            :item="option"
          >
            <span>{{ option }}</span>
          </slot>
        </template>
      </Select>
      <MultiSelect
        v-else-if="!useCheckboxes && multiple"
        v-model="multiSelectModel"
        :options="items"
        :placeholder="placeholder ? $t(placeholder) : undefined"
        :disabled="disabled"
        :invalid="isInvalid"
        :show-clear="enableEmptyOption && !emptyOptionDisabled"
        class="ep-select w-full"
        :class="{ 'is-invalid': isInvalid, 'is-valid': isValid }"
      >
        <template
          v-if="$slots.default"
          #option="{ option }"
        >
          <slot
            name="default"
            :item="option"
          >
            <span>{{ option }}</span>
          </slot>
        </template>
      </MultiSelect>
      <EpFormGroup
        v-else
        class="m-0 p-0"
      >
        <EpToggleGroup
          v-model="toggleGroupModel"
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
import { computed, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { $t } from '@shared/utils/globals';

import Select from 'primevue/select';
import MultiSelect from 'primevue/multiselect';
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
  if (props.multiple && Array.isArray(props.modelValue)) {
    return _.filter(props.items, (item) => _.includes(props.modelValue as unknown[], item));
  }

  return props.modelValue != null ? [props.modelValue] : [];
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
  set(value: unknown) {
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

const multiSelectModel = computed({
  get: (): any[] => (Array.isArray(innerModel.value) ? (innerModel.value as any[]) : []),
  set: (value: any[]) => {
    innerModel.value = value; 
  },
});

const toggleGroupModel = computed({
  get: (): any[] => {
    const val = innerModel.value;
    return Array.isArray(val) ? val : (val != null ? [val] : []);
  },
  set: (value: any[]) => {
    innerModel.value = props.multiple ? value : (value[0] ?? null);
  },
});

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

watch(
  () => props.items,
  () => {
    if (!props.enableEmptyOption && _.size(props.items) > 0 && props.modelValue === null && !props.multiple) {
      const first = _.first(props.items);
      if (first !== undefined) {
        emit('update:modelValue', first);
      }
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

.ep-select {
  :deep(.p-select-label),
  :deep(.p-multiselect-label) {
    font-size: 1rem;
    line-height: 1.5;
    font-weight: 500;
  }

  :deep(.p-select),
  :deep(.p-multiselect) {
    &.p-invalid .p-select-label,
    &.p-invalid .p-multiselect-label {
      border-color: $alias-error;
    }
  }

  :deep(.p-focus) {
    .p-select-label,
    .p-multiselect-label {
      border-color: $blue-lighten-5;
      outline: none;
      box-shadow: none;
    }
  }
}
</style>
