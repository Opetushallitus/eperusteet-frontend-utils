<template>
  <div class="d-flex">
    <EpLaajuusInput
      v-model="model.laajuus"
      :is-editing="isEditing"
      :validation="validation.laajuus"
    >
      <span />
    </EpLaajuusInput>

    <EpMultiSelect
      v-if="isEditing"
      v-model="model.laajuusYksikko"
      :options="laajuusYksikot"
      :close-on-select="true"
      :clear-on-select="false"
      :placeholder="$t('valitse-laajuus-yksikko')"
      :validation="validation.laajuusYksikko"
    >
      <template #singleLabel="{ option }">
        {{ $t(option.toLowerCase() + '-lyhenne') }}
      </template>
      <template #option="{ option }">
        {{ $t(option.toLowerCase() + '-partitiivi') }}
      </template>
    </EpMultiSelect>
    <div
      v-if="!isEditing && model.laajuusYksikko && model.laajuus"
      class="ml-2"
    >
      <span> {{ $t(laajuusYksikkoLyhenne) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import EpErrorWrapper from '../forms/EpErrorWrapper.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpLaajuusInput from '@shared/components/forms/EpLaajuusInput.vue';
import { LaajuusYksikkoEnum } from '@shared/api/amosaa';
import _ from 'lodash';

export interface Laajuus {
  laajuus?: number;
  laajuusYksikko?: LaajuusYksikkoEnum;
}

const props = defineProps({
  modelValue: {
    required: true,
    type: Object as () => Laajuus,
  },
  isEditing: {
    default: false,
    type: Boolean,
  },
  validationError: {
    type: Object,
  },
});

const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

const v$ = useVuelidate();

const validation = computed(() => {
  // Adapt to component's validation structure
  return v$.value || {};
});

const laajuusYksikot = computed(() => {
  return [
    LaajuusYksikkoEnum.OPINTOPISTE,
    LaajuusYksikkoEnum.OPINTOVIIKKO,
    LaajuusYksikkoEnum.TUNTI,
    LaajuusYksikkoEnum.VIIKKO,
    LaajuusYksikkoEnum.OSAAMISPISTE,
    LaajuusYksikkoEnum.VUOSI,
    LaajuusYksikkoEnum.VUOSIVIIKKOTUNTI,
  ];
});

const laajuusYksikkoLyhenne = computed(() => {
  return _.lowerCase(props.modelValue.laajuusYksikko) + '-lyhenne';
});
</script>

<style lang="scss" scoped>
</style>
