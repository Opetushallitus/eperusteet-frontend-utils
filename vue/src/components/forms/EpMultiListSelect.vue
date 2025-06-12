<template>
  <div v-if="isEditing">

    {{ innerModels }}

    <div
      v-for="(innerModel, i) in innerModelValidations"
      :key="i"
      class="row mb-2"
    >
      <div class="col-11">
        <VueMultiselect
          v-model="innerModels[i]"
          :disabled="isLoading"
          class="groupselect"
          :options="items"
          :multiple="false"
          track-by="text"
          label="text"
          select-label=""
          selected-label=""
          deselect-label=""
          :placeholder="''"
          :class="{'is-invalid': !innerModel.valid }"
          @select="handleInput($event, i)"
        >
          <template #option="{ option }">
            <div :class="{'child': option.child, 'unselectable': option.unselectable}">
              <slot
                name="option"
                :option="option"
              >
                {{ option.text }}
              </slot>
            </div>
          </template>

          <template #singleLabel="{ option }">
            <slot
              v-if="option.value"
              name="singleLabel"
              :option="option"
            >
              {{ option.text }}
            </slot>
            <div
              v-else
              class="valitse"
            >
              {{ $t('valitse') }}
            </div>
          </template>

          <template #noResult>
            <div>{{ $t('ei-hakutuloksia') }}</div>
          </template>
          <template #noOptions>
            <div>{{ $t('ei-vaihtoehtoja') }}</div>
          </template>
        </VueMultiselect>
      </div>
      <div class="col-1">
        <ep-button
          v-if="!required || (i > 0 && !isLoading)"
          button-class="p-0 pt-2 roskalaatikko"
          variant="link"
          icon="delete"
          @click="poistaValinta(i)"
        />
      </div>
    </div>

    <ep-spinner v-if="isLoading" />
    <ep-button
      v-else-if="multiple"
      button-class="pl-0 lisaa-valinta"
      variant="outline-primary"
      icon="add"
      @click="lisaaValinta()"
    >
      <slot name="lisaaTeksti">
        {{ $t(lisaaTeksti) }}
      </slot>
    </ep-button>

    <div
      v-if="!validationError && validMessage"
      class="valid-feedback"
    >
      {{ $t(validMessage) }}
    </div>
    <div
      v-else-if="validationError && invalidMessage "
      class="invalid-feedback"
    >
      {{ $t(invalidMessage) }}
    </div>
    <div
      v-else-if="validationError && !invalidMessage"
      class="invalid-feedback"
    >
      {{ $t('validation-error-' + validationError, validation.$params[validationError]) }}
    </div>
    <small
      v-if="help && isEditing"
      class="form-text text-muted"
    >{{ $t(help) }}</small>
  </div>
  <div v-else>
    <div
      v-for="(innerModel, i) in innerModelValidations"
      :key="i"
      class="row"
      :class="{'mb-2': i < innerModelValidations.length-1}"
    >
      <div class="col-11">
        <slot
          v-if="innerModels[i].value"
          name="singleLabel"
          :option="innerModels[i]"
        >
          {{ innerModels[i].text }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import VueMultiselect from 'vue-multiselect';

export interface InnerModelValidations {
  innerModel: any;
  valid: boolean;
}

export interface MultiListSelectItem {
  value: any,
  text: string,
  unselectable: boolean,
  child: boolean,
}

const props = defineProps({
  items: {
    required: true,
    type: Array as () => MultiListSelectItem[],
  },
  modelValue: {
    required: true,
  },
  tyyppi: {
    required: false,
    type: String,
  },
  validationError: {
    type: String,
  },
  validMessage: {
    type: String,
  },
  invalidMessage: {
    type: String,
  },
  validation: {
    default: null,
  },
  required: {
    required: false,
    default: false,
    type: Boolean,
  },
  isLoading: {
    default: false,
    type: Boolean,
  },
  multiple: {
    default: true,
    type: Boolean,
  },
  isEditing: {
    default: true,
    type: Boolean,
  },
  help: {
    default: '',
    type: String,
  },
  equality: {
    required: false,
    default: _.isEqual,
    type: Function,
  },
});

const emit = defineEmits(['update:modelValue']);
const v$ = useVuelidate();
const innerModels = ref<any[]>([]);

const innerModelsValues = computed(() => {
  return _.chain(innerModels.value)
    .filter(innerModel => (_.isArray(innerModel.value) && !_.isEmpty(innerModel.value)) || !_.isNil(innerModel.value))
    .map(innerModel => innerModel.value)
    .value();
});

const innerModelValidations = computed(() => {
  return _.map(innerModels.value, (innerModel, index) => {
    let valid = true;
    if (props.validation && props.validation.$each && props.validation.$each.$iter[index]) {
      valid = !props.validation.$each.$iter[index].$invalid;
    }

    return {
      innerModel,
      valid,
    } as InnerModelValidations;
  });
});

const lisaaTeksti = computed(() => {
  if (props.tyyppi) {
    return 'lisaa-' + props.tyyppi;
  }
  return 'lisaa';
});

function updateValue() {
  if (props.multiple) {
    emit('update:modelValue', [...innerModelsValues.value]);
  }
  else {
    emit('update:modelValue', innerModelsValues.value[0]);
  }
}

function lisaaValinta() {
  innerModels.value = [
    ...innerModels.value,
    {},
  ];
}

function poistaValinta(index: number) {
  innerModels.value = _.filter(innerModels.value, (val, valIndex) => index !== valIndex);
  updateValue();
}

function handleInput(selected: any, index: number) {
  if (_.isEmpty(selected) || selected.unselectable) {
    poistaValinta(index);
    lisaaValinta();
  }
  else {
    if (_.size(_.filter(innerModels.value, (innerModel) => innerModel === selected)) === 1) {
      updateValue();
    }
    else {
      // Need to directly set the value in the array
      innerModels.value[index] = {};
    }
  }
}

function changeInnerModels(items: any[], value: any) {
  let valueArray = _.isArray(value) ? value : [value];

  if (_.size(items) > 0) {
    innerModels.value = _.chain(valueArray)
      .map((singleValue) => _.head(_.filter(items, (item) => {
        return props.equality(item.value, singleValue);
      })))
      .filter(singleValue => _.isObject(singleValue))
      .value();

    updateValue();
  }
}

// Watch for changes in props.items
watch(() => props.items, (newItems) => {
  changeInnerModels(newItems, props.modelValue);
  if (props.required && _.isEmpty(innerModels.value)) {
    innerModels.value = [{}];
  }

}, { immediate: true });

// Watch for changes in props.modelValue
watch(() => props.modelValue, (newValue) => {
  if ((_.isArray(newValue) && _.isEmpty(newValue)) && !props.required) {
    innerModels.value = [];
  }
}, { immediate: true });
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

  .unselectable {
    cursor: default;
  }

  :deep(.multiselect__tags) {
    border: 2px solid #E0E0E1;
    border-radius: 10px;
    font-size: 1rem;
    background-color: $white;
  }

  :deep(.multiselect__element) {
    margin: 0px;
    padding: 0px;
    line-height: 1rem;
  }

  :deep(.multiselect__option) {
    padding: 0px;
    margin: 0px;
    background-color: $white;
    color: $black;
  }

  :deep(.multiselect__option div) {
    padding: 12px;
    margin: 0px;
  }

  :deep(.multiselect__option div.child) {
    padding-left: 35px;
  }

  :deep(.multiselect__option--highlight div) {
    background-color: $blue-lighten-1;
    color: $white;
  }

  :deep(.multiselect__option .unselectable) {
    background-color: $white;
    color: $gray-lighten-1;
  }

  :deep(.is-invalid .multiselect__content-wrapper) {
    border-color: #dc3545;
  }

  :deep(.is-valid .multiselect__content-wrapper) {
    border-color: $valid;
  }

  :deep(.is-invalid .multiselect__tags) {
    border-color: #dc3545;
  }

  :deep(.is-valid .multiselect__tags) {
    border-color: $valid;
  }

  // Piilotettu Bootstrapissa oletuksena
  :deep(.invalid-feedback),
  :deep(.valid-feedback) {
    display: block;
  }

  .valitse {
    color: $gray-lighten-2;
  }
</style>
