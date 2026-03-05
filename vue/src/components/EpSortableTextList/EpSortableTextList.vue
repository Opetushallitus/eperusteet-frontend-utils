<template>
  <div>
    <template v-if="isEditing">
      <VueDraggable
        v-bind="defaultDragOptions"
        v-model="innerModel"
        tag="div"
      >
        <div
          v-for="(model, i) in innerModel"
          :key="group+i"
          class="flex flex-wrap pb-2"
        >
          <div class="w-11/12">
            <slot
              name="input"
              :model="model"
              :index="i"
            >
              <EpInput
                v-model="innerModel[i]"
                :is-editing="isEditing"
              >
                <template #left>
                  <div
                    class="order-handle m-2"
                  >
                    <EpMaterialIcon>drag_indicator</EpMaterialIcon>
                  </div>
                </template>
              </EpInput>
            </slot>
          </div>
          <div
            v-if="isEditing"
            class="w-1/12 text-center"
          >
            <div
              class="default-icon clickable mt-2"
              @click="poistaTeksti(i)"
            >
              <EpMaterialIcon icon-shape="outlined">
                delete
              </EpMaterialIcon>
            </div>
          </div>
        </div>
      </VueDraggable>
      <EpButton
        v-if="isEditing"
        variant="outline"
        icon="add"
        @click="lisaaTeksti()"
      >
        <slot name="default">
          {{ $t('lisaa-teksti') }}
        </slot>
      </EpButton>
    </template>
    <template v-else-if="innerModel.length > 0">
      <ul>
        <li
          v-for="(model, i) in innerModel"
          :key="group+i"
        >
          <slot
            name="li"
            :model="model"
          >
            {{ $kaanna(model) }}
          </slot>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import EpButton from '../EpButton/EpButton.vue';
import _ from 'lodash';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { VueDraggable } from 'vue-draggable-plus';
import { $t, $kaanna } from '@shared/utils/globals';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  sortable: {
    type: Boolean,
    default: true,
  },
  group: {
    type: String,
    required: false,
    default: 'sortableTextList',
  },
});

const emit = defineEmits(['update:modelValue']);

const innerModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const lisaaTeksti = () => {
  innerModel.value = [
    ...innerModel.value,
    {},
  ];
};

const poistaTeksti = (poistettavaIndex: number) => {
  innerModel.value = _.filter(innerModel.value, (teksti, index) => index !== poistettavaIndex);
};

const defaultDragOptions = computed(() => {
  return {
    animation: 300,
    emptyInsertThreshold: 10,
    handle: '.order-handle',
    disabled: !props.isEditing && props.sortable,
    ghostClass: 'dragged',
    group: {
      name: props.group,
    },
  };
});
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

</style>
