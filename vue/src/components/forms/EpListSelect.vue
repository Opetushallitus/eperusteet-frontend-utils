<template>
  <div>
    <div>
      <div>
        <EpInput
          v-model="search"
          type="string"
          is-editing
          @blur="onListBlur"
          @focus="onListFocus"
        />
      </div>
      <div class="searchlist-wrapper">
        <div
          v-if="search"
          class="searchlist"
        >
          <div
            v-for="option in filteredOptions"
            :key="option[identity]"
            class="searchitem"
          >
            <slot :option="option" />
          </div>
        </div>
      </div>
      <span class="clear" />
    </div>
    <div
      v-if="!validationError && validMessage"
      class="valid-feedback"
    >
      {{ $t(validMessage) }}
    </div>
    <div
      v-else-if="validationError && invalidMessage "
      class="block text-red-600 text-sm mt-1"
    >
      {{ $t(invalidMessage) }}
    </div>
    <div
      v-else-if="validationError && !invalidMessage"
      class="block text-red-600 text-sm mt-1"
    >
      {{ $t('validation-error-' + validationError, validation.$params[validationError]) }}
    </div>
    <small
      v-if="help"
      class="form-text text-gray-500"
    >{{ $t(help) }}</small>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import Multiselect from 'vue-multiselect';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import _ from 'lodash';

const props = defineProps({
  options: {
    required: true,
    type: Array,
  },
  modelValue: {
    required: true,
    type: Array,
  },
  trackBy: {
    type: String,
  },
  identity: {
    required: true,
    type: String,
  },
  searchIdentity: {
    default: () => '',
    type: Function as () => null | ((v: any) => string | null | undefined),
  },
  help: {
    default: '',
    type: String,
  },
  validMessage: {
    type: String,
  },
  invalidMessage: {
    type: String,
  },
  validationError: {
    type: String,
  },
});

const emit = defineEmits(['update:modelValue']);

const search = ref('');
const hasFocus = ref(false);
const v$ = useVuelidate();

const validation = computed(() => {
  return v$.value || {};
});

const filteredOptions = computed(() => {
  if (search.value && props.searchIdentity) {
    return _.filter(props.options, x => _.includes(
      _.toLower(props.searchIdentity!(x) || ''),
      _.toLower(search.value || '')));
  }
  return props.options;
});

const model = computed(() => {
  return props.modelValue;
});

const track = computed(() => {
  return props.trackBy;
});

function changed(value: any) {
  emit('update:modelValue', value);
}

function onListBlur() {
  hasFocus.value = false;
}

function onListFocus() {
  hasFocus.value = true;
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.searchlist-wrapper {
  /* float: left; */
  display: inline-block;
  position: relative;
  top: 0;

  .searchlist {
    /* float: left; */
    /* #parent { overflow: hidden; float: left; width: 100%; } */
    position: absolute;
    left: 0;
    top: 0;
    border: 1px solid black;
    min-width: 120px;
    max-width: 576px;
    max-height: 356px;
    overflow-y: scroll;
    background: #ffffffff;
    z-index: 1000;
    border: 1px solid #ced4da;
    border-top: none;
  }
}
</style>
