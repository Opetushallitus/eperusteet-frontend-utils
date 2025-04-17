<template>
  <div>
    <draggable
      v-bind="defaultDragOptions"
      v-model="model"
      tag="div"
    >
      <b-row
        v-for="(sisalto, index) in model"
        :key="'edKehOsaaminen'+index"
        class="pb-2"
      >
        <b-col cols="11">
          <ep-input
            v-model="sisalto[sisaltokieli]"
            :is-editing="isEditing"
            type="string"
            class="flex-grow-1"
          >
            <template #left>
              <div
                class="order-handle m-2"
              >
                <EpMaterialIcon>drag_indicator</EpMaterialIcon>
              </div>
            </template>
          </ep-input>
        </b-col>
        <b-col cols="1">
          <div
            class="clickable mt-2"
            @click="poistaKuvaus(sisalto)"
          >
            <EpMaterialIcon class="default-icon">
              delete
            </EpMaterialIcon>
          </div>
        </b-col>
      </b-row>
    </draggable>

    <ep-button
      variant="outline"
      icon="add"
      class="mt-1"
      @click="lisaaKuvaus()"
    >
      {{ $t('lisaa-kuvaus') }}
    </ep-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as _ from 'lodash';
import EpInput from '@shared/components/forms/EpInput.vue';
import { Kielet } from '@shared/stores/kieli';
import draggable from 'vuedraggable';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

// Two-way binding for v-model
const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

// Computed properties
const defaultDragOptions = computed(() => {
  return {
    animation: 300,
    emptyInsertThreshold: 10,
    handle: '.order-handle',
    disabled: !props.isEditing,
    ghostClass: 'dragged',
    group: {
      name: 'kuvaukset',
    },
  };
});

const sisaltokieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

// Methods
function poistaKuvaus(sisalto) {
  emit('update:modelValue', _.filter(props.modelValue, row => row !== sisalto));
}

function lisaaKuvaus() {
  emit('update:modelValue', [...props.modelValue, {}]);
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
