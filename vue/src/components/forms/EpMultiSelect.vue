<template>
  <div>
    <label
      v-if="labelSlot"
      :for="id"
      class="label"
    ><slot name="label" /></label>
    <VueMultiselect
      v-model="model"
      :track-by="track"
      :options="filteredOptions"
      :close-on-select="closeOnSelect"
      :clear-on-select="clearOnSelect"
      :placeholder="placeholder"
      select-label=""
      selected-label=""
      deselect-label=""
      :multiple="multiple"
      ref="multiselect"
      :class="inputClass"
      :label="label"
      :custom-label="customLabel"
      :group-values="groupValues"
      :group-label="groupLabel"
      :id="id"
      :group-select="groupSelect"
      :searchable="searchable"
      :max-height="maxHeight"
      :loading="loading"
      :internal-search="internalSearch"
      :disabled="disabled"
      :allow-empty="allowEmpty"
      :open-direction="openDirection"
      :taggable="taggable"
      :tag-placeholder="tagPlaceholder"
      :aria-controls="id"
      @search-change="onSearchChange"
      @remove="remove"
      @tag="addTag"
    >
      <template #beforeList>
        <slot name="beforeList" />
      </template>

      <template #singleLabel="{ option }">
        <slot
          name="singleLabel"
          :option="option"
        />
      </template>
      <template #option="{ option, search }">
        <div class="d-flex align-items-center">
          <div
            class="w-100"
            role="option"
            :aria-selected="optionChecked(option)"
          >
            <slot
              name="checkbox"
              :option="option"
            >
              <input
                v-if="multiple"
                type="checkbox"
                :checked="optionChecked(option)"
              >
            </slot>
            <slot
              name="option"
              :option="option"
              :search="search"
            >
              <span class="ml-2">{{ getOptionLabel(option) }}</span>
            </slot>
          </div>
          <EpMaterialIcon
            v-if="optionChecked(option)"
            class="mr-2"
          >
            check
          </EpMaterialIcon>
        </div>
      </template>
      <template #tag="{ option, search, remove }">
        <slot
          name="tag"
          :option="option"
          :search="search"
          :remove="remove"
        />
      </template>
      <template #noResult>
        <slot name="noResult">
          <div>{{ $t('ei-hakutuloksia') }}</div>
        </slot>
      </template>
      <template #noOptions>
        <slot name="noOptions">
          <div>{{ $t('ei-vaihtoehtoja') }}</div>
        </slot>
      </template>
      <template #selection="{ values, search, isOpen }">
        <slot
          name="selection"
          :values="values"
          :search="search"
          :is-open="isOpen"
        />
      </template>
      <template #afterList>
        <slot name="afterList" />
      </template>
    </VueMultiselect>
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
      v-if="help"
      class="form-text text-muted"
    >{{ $t(help) }}</small>
    <slot name="helptext" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, useSlots, useTemplateRef, getCurrentInstance } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import VueMultiselect from 'vue-multiselect';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import _ from 'lodash';
import { hasSlotContent } from '../../utils/vue-utils';

const props = defineProps({
  modelValue: {
    required: true,
  },
  multiple: {
    default: false,
    type: Boolean,
  },
  trackBy: {
    type: String,
  },
  label: {
    type: String,
  },
  customLabel: {
    type: Function,
  },
  options: {
    required: true,
    type: Array,
  },
  help: {
    default: '',
    type: String,
  },
  placeholder: {
    default: '',
    type: String,
  },
  tagPlaceholder: {
    default: '',
    type: String,
  },
  searchIdentity: {
    default: null,
    type: Function,
  },
  groupValues: {
    type: String,
  },
  groupLabel: {
    type: String,
  },
  groupSelect: {
    default: false,
    type: Boolean,
  },
  searchable: {
    default: true,
    type: Boolean,
  },
  loading: {
    default: false,
    type: Boolean,
  },
  internalSearch: {
    default: false,
    type: Boolean,
  },
  closeOnSelect: {
    default: true,
    type: Boolean,
  },
  taggable: {
    default: false,
    type: Boolean,
  },
  clearOnSelect: {
    default: false,
    type: Boolean,
  },
  maxHeight: {
    type: Number,
  },
  disabled: {
    default: false,
    type: Boolean,
  },
  allowEmpty: {
    default: true,
    type: Boolean,
  },
  openDirection: {
    default: '',
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
});

const emit = defineEmits(['update:modelValue', 'search', 'remove', 'tag']);
const v$ = useVuelidate();
const slots = useSlots();
const multiselect = useTemplateRef('multiselect');
const search = ref('');

onMounted(() => {
  const multiselectEl = document.querySelector('.multiselect');

  if (multiselectEl) {
    multiselectEl.setAttribute('aria-expanded', 'false');
    multiselectEl.removeAttribute('aria-owns');
    const inputEl = multiselectEl.querySelector('input');
    if (inputEl) {
      inputEl.setAttribute('aria-autocomplete', 'list');
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          multiselectEl?.setAttribute('aria-expanded', multiselectEl?.classList.contains('multiselect--active') + '');
        }
      });
    });
    observer.observe(multiselectEl, { attributes: true, attributeFilter: ['class'] });
  }

  const options = document.querySelectorAll('.multiselect li[role="option"]');
  if (options) {
    options.forEach((option) => {
      option.removeAttribute('role');
    });
  }
});

const filteredOptions = computed(() => {
  if (search.value && props.searchIdentity) {
    return _.filter(props.options, x => _.includes(
      _.toLower(props.searchIdentity!(x) || ''),
      _.toLower(search.value || '')));
  }
  return props.options;
});

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

const hasValue = computed(() => {
  return !_.isEmpty(props.modelValue);
});

const track = computed(() => {
  return props.trackBy;
});

const id = computed(() => {
  return _.uniqueId('multiselect-');
});

const validation = computed(() => {
  return v$.value || {};
});

function optionChecked(option) {
  return option === props.modelValue || !_.isEmpty(_.filter(props.modelValue, x => x === option));
}

function getOptionLabel(option) {
  if (_.isEmpty(option)) return '';
  if (!_.isEmpty(props.label) && !_.isEmpty(_.get(option, props.label))) return _.get(option, props.label);
  return option;
}

// Using regular function instead of debouncing directly since we need to access props
async function onSearchChange(ev) {
  if (props.searchIdentity) {
    search.value = ev;
  }
  else {
    emit('search', ev);
  }
}

const inputClass = computed(() => {
  return {
    'is-invalid': !!(props.validationError),
    'is-valid': !!(props.validMessage && !props.validationError),
  };
});

function remove(option) {
  emit('remove', option);
}

function sulje() {
  multiselect.value?.deactivate();
}

function addTag(tag) {
  emit('tag', tag);
}

const labelSlot = computed(() => {
  return hasSlotContent(slots.label);
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

:deep(.multiselect__tags) {
  border: 1px solid $black;
  background-color: $white;
  padding-left:10px;
  border-radius: 0;
}

:deep(.multiselect__tag) {
  background-color: $white;
  color: $black;
  margin: 0px;
}

:deep(.multiselect__placeholder) {
  margin-bottom: 0px;
  padding-top: 0px;
}

:deep(.multiselect--active) {
  .multiselect__tags {
    border-top: 2px solid $black;
  }
}

:deep(.multiselect--above) {
  .multiselect__content-wrapper {
    border: 1px solid $black;
    border-bottom: 0;
  }
}
:deep(.multiselect--above.multiselect--active) {
  .multiselect__tags {
    border-top: 2px solid $black;
  }
}

:deep(.multiselect__content-wrapper) {
  border: 1px solid $black;
  width: fit-content;
  min-width: 100%;
  margin-top: -2px;

  .multiselect__option--highlight::after {
    background-color: $blue-lighten-5;
  }
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

:deep(.multiselect__option--disabled) {
  background: none !important;
  color: $disabled !important;
}

:deep(.multiselect__option--selected) {
  font-weight: 400;
}

:deep(.multiselect__input) {
  padding-left: 0px;
  font-size: 14px;
}

:deep(.multiselect__option--highlight) {
    background-color: #bbb;
    color: #fff;
  }

:deep(.multiselect__option--selected) {
  &.multiselect__option--highlight{
    background:$green;
    color:#fff
  }
}

:deep(.multiselect__tags) {
  .multiselect__tag {
    border: 1px solid $black;
    margin-right: 10px;

    .multiselect__tag-icon {
      margin-right: 5px;
    }
  }

  .remove-all {
    .material-icons {
      font-size: 18px;
    }
  }
}

:deep(.multiselect__tag-icon:focus), :deep(.multiselect__tag-icon:hover) {
  background: $gray;
}

:deep(.multiselect) {
  @include focus-within;
}
</style>
