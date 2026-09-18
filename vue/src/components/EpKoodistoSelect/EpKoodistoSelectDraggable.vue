<template>
  <ep-koodisto-select
    class="w-full min-w-0"
    :model-value="modelValue"
    :store="store"
    :is-editing="isEditing"
    :nayta-arvo="naytaArvo"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #default="{ open }">
      <div class="flex w-full min-w-0 items-center">
        <ep-material-icon
          class="order-handle mr-2 shrink-0"
          size="18px"
        >
          drag_indicator
        </ep-material-icon>
        <EpInputGroup class="min-w-0 grow">
          <ep-input
            :model-value="displayValue"
            :is-editing="true"
            disabled
          />
          <template #append>
            <EpButton
              variant="primary"
              @click="open"
            >
              {{ buttonText || $t('hae-koodistosta') }}
            </EpButton>
          </template>
        </EpInputGroup>
      </div>
    </template>
  </ep-koodisto-select>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EpInputGroup from '../EpInputGroup/EpInputGroup.vue';
import EpKoodistoSelect from './EpKoodistoSelect.vue';
import EpMaterialIcon from '../EpMaterialIcon/EpMaterialIcon.vue';
import EpButton from '../EpButton/EpButton.vue';
import { KoodistoSelectStore } from './KoodistoSelectStore';
import { $kaanna } from '@shared/utils/globals';
import EpInput from '../forms/EpInput.vue';

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
