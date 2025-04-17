<template>
  <div>
    <slot name="header" />

    <b-table
      v-if="modelValue && modelValue.length > 0"
      responsive
      borderless
      striped
      fixed
      hover
      :items="modelValue"
      :fields="fields"
      :selectable="true"
      select-mode="single"
      selected-variant=""
    >
      <template #cell(nimi)="{ item }">
        <span>
          {{ $kaanna(item.nimi) }}
        </span>
      </template>

      <template
        v-if="isEditing"
        #cell(poisto)="{ item }"
      >
        <ep-button
          variant="link"
          icon="delete"
          @click="remove(item)"
        />
      </template>
    </b-table>

    <ep-koodisto-select
      v-if="isEditing"
      v-model="koodi"
      :store="store"
      :is-editing="isEditing"
      :nayta-arvo="false"
      :multiple="true"
      :default-fields="koodistoSelectDefaultFields"
    >
      <template #default="{ open }">
        <ep-button
          icon="add"
          variant="outline"
          @click="open"
        >
          <slot name="button-text">
            lisaa-koodi
          </slot>
        </ep-button>
      </template>

      <template #empty>
        <span />
      </template>
    </ep-koodisto-select>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import EpButton from '../EpButton/EpButton.vue';
import { KoodistoSelectStore } from './KoodistoSelectStore';
import EpKoodistoSelect from '@shared/components/EpKoodistoSelect/EpKoodistoSelect.vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: null,
  },
  isEditing: {
    type: Boolean,
    default: true,
  },
  showKoodiArvo: {
    type: Boolean,
    default: true,
  },
  store: {
    type: Object as () => KoodistoSelectStore,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'remove']);

// Get instance to access global properties
const instance = getCurrentInstance();
const $t = instance?.appContext.config.globalProperties.$t;
const $kaanna = instance?.appContext.config.globalProperties.$kaanna;

const koodi = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
  },
});

const koodistoSelectDefaultFields = computed(() => {
  return props.showKoodiArvo ? ['nimi', 'arvo'] : ['nimi'];
});

const fields = computed(() => {
  return [{
    key: 'nimi',
    label: $t('nimi'),
  },
  ...(props.showKoodiArvo
    ? [
      {
        key: 'arvo',
        label: $t('koodi'),
        thStyle: { width: '10rem' },
      },
    ] : []),
  {
    key: 'poisto',
    label: '',
    thStyle: { width: '5rem' },
  }];
});

function remove(koodi) {
  emit('remove', koodi);
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

</style>
