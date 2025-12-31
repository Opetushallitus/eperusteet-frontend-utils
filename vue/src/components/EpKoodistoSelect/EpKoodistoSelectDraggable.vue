<template>
  <ep-koodisto-select
    :model-value="modelValue"
    :store="store"
    :is-editing="isEditing"
    :nayta-arvo="naytaArvo"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #default="{ open }">
      <b-input-group>
        <ep-material-icon
          class="order-handle inner-drag-handle mr-2 flex-shrink-0"
        >
          drag_indicator
        </ep-material-icon>
        <b-form-input
          :class="inputClass"
          :value="displayValue"
          disabled
        />
        <b-input-group-append>
          <b-button
            variant="primary"
            @click="open"
          >
            {{ buttonText || $t('hae-koodistosta') }}
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </template>
  </ep-koodisto-select>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EpKoodistoSelect from './EpKoodistoSelect.vue';
import EpMaterialIcon from '../EpMaterialIcon/EpMaterialIcon.vue';
import { KoodistoSelectStore } from './KoodistoSelectStore';
import { $kaanna } from '@shared/utils/globals';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  store: {
    type: Object as () => KoodistoSelectStore,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: true,
  },
  naytaArvo: {
    type: Boolean,
    default: false,
  },
  inputClass: {
    type: String,
    default: 'taitotaso-input',
  },
  buttonText: {
    type: String,
    default: '',
  },
});

defineEmits(['update:modelValue']);

const displayValue = computed(() => {
  if (props.modelValue && props.modelValue.nimi) {
    return $kaanna(props.modelValue.nimi);
  }
  return '';
});
</script>

<style scoped lang="scss">
.inner-drag-handle {
  position: absolute;
  padding: 8px 0 0 0;
  left: 6px;
  z-index: 100;
}

:deep(.taitotaso-input) {
  padding-left: 2rem !important;
}
</style>

