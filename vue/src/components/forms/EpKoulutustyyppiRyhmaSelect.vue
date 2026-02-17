<template>
  <EpMultiSelect
    v-model="model"
    :options="koulutustyyppiRyhmaOptions"
    :multiple="true"
    track-by="ryhma"
    label="ryhma"
    :searchable="false"
  >
    <template #checkbox>
      <span />
    </template>
    <template #option="{option}">
      <ep-color-indicator
        :size="10"
        :tooltip="false"
        :kind="option.ryhma"
      />
      {{ $t(option.ryhma) }}
    </template>

    <template #singleLabel="{option}">
      <ep-color-indicator
        v-if="option"
        :size="10"
        :tooltip="false"
        :kind="option.ryhma"
      />
      {{ $t(option.ryhma) }}
    </template>
    <template #selection="{ values }">
      <div class="d-flex align-items-center">
        <template v-if="values.length === 1">
          <span
            v-for="value in values"
            :key="'value' + value.ryhma"
            class="multiselect__tag"
          >
            <slot
              name="colorindicator"
              :koulutustyyppi="value.ryhma"
            >
              <EpColorIndicator
                :size="10"
                :kind="value.ryhma"
              />
            </slot>
            <span class="nimi ml-2">{{ $t(value.ryhma) }}</span>
            <span
              class="multiselect__tag-icon clickable"
              @click.prevent
              @mousedown.prevent.stop="remove(value)"
            />
          </span>
        </template>

        <span v-if="values.length > 1">
          {{ $t('valittu-x-koulutusta', { kpl: values.length }) }}
        </span>
      </div>
    </template>
  </EpMultiSelect>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import _ from 'lodash';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import { koulutustyyppiRyhmat, koulutustyyppiRyhmaSort, KoulutustyyppiRyhma } from '../../utils/perusteet';
import { $t } from '@shared/utils/globals';

const props = withDefaults(defineProps<{
  modelValue?: KoulutustyyppiRyhma[];
}>(), {
  modelValue: () => [],
});

const emit = defineEmits<{
  'update:modelValue': [value: KoulutustyyppiRyhma[]];
}>();

const model = computed({
  get: () => props.modelValue ?? [],
  set: (value: KoulutustyyppiRyhma[]) => {
    emit('update:modelValue', value);
  },
});

const koulutustyyppiRyhmaOptions = computed((): KoulutustyyppiRyhma[] => {
  return _.sortBy(koulutustyyppiRyhmat(), ryhma => koulutustyyppiRyhmaSort[ryhma.ryhma]);
});

function remove(value: KoulutustyyppiRyhma) {
  emit('update:modelValue', (props.modelValue ?? []).filter(v => v.ryhma !== value.ryhma));
}
</script>
