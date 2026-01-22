<template>
  <div
    class="filter"
    role="search"
    :class="{'maxWidth': maxWidth}"
  >
    <label
      v-if="labelSlot"
      :for="id"
    ><slot name="label" /></label>
    <label
      v-if="srOnlyLabelText"
      :for="id"
      class="sr-only"
    >{{ srOnlyLabelText }}</label>
    <span class="form-control-feedback">
      <EpMaterialIcon class="icon">search</EpMaterialIcon>
    </span>
    <input
      :id="id"
      class="form-control"
      type="search"
      :placeholder="placeholderText"
      aria-describedby="hakuohje"
      :value="val"
      :maxlength="maxlength"
      @input="onInput($event.target.value)"
    >
    <p
      id="hakuohje"
      class="sr-only"
    >
      {{ $t('saavutettavuus-hakuohje') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, getCurrentInstance, useSlots } from 'vue';
import { Kielet } from '../../stores/kieli';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { hasSlotContent } from '../../utils/vue-utils';
import { $t } from '@shared/utils/globals';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  maxWidth: {
    type: Boolean,
    default: false,
  },
  maxlength: {
    type: Number,
  },
  srOnlyLabelText: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const instance = getCurrentInstance();
const slots = useSlots();

const id = computed(() => {
  return _.uniqueId('search-');
});

const icon = computed(() => {
  return props.isLoading ? 'spinner' : 'search';
});

const placeholderText = computed(() => {
  if (props.placeholder != null) {
    return props.placeholder;
  }

  return $t('etsi');
});

const onInput = (input: any) => {
  emit('update:modelValue', input);
};

const val = computed(() => {
  if (_.isObject(props.modelValue)) {
    return (props.modelValue as any)[Kielet.getSisaltoKieli.value];
  }
  else {
    return props.modelValue;
  }
});

const labelSlot = computed(() => {
  return hasSlotContent(slots.label);
});
</script>

<style scoped lang="scss">
.icon {
  vertical-align: middle;
}

.filter {
  position: relative;

  &.maxWidth {
    max-width: 100%;
  }

  .form-control {
    padding-left: 2.375rem;
    border: 1px solid #2a2a2a;
    border-radius: 0;
    background-color: #fff;
    display: block;
    width: 100%;
    height: calc(1.5em + .875rem + 2px);
    // padding: .4375rem .625rem;
    font-size: 1rem;
    font-weight: 400;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;

    &::placeholder {
      color: #888;
    }
  }

  .form-control-feedback {
    position: absolute;
    z-index: 2;
    display: block;
    width: 2.375rem;
    height: 2.375rem;
    line-height: 2.375rem;
    text-align: center;
    pointer-events: none;
    color: #555;
  }
}
</style>
