<template>
  <draggable
    v-bind="defaultDragOptions"
    v-model="model"
    tag="div"
  >
    <EpCollapse
      v-for="(modelObject, index) in model"
      :key="'EpDraggableCollapse_' + index"
      :border-bottom="index < model.length -1"
      :collapsable="!isEditing"
      :use-padding="false"
    >
      <template #header>
        <slot
          name="header"
          :data="modelObject"
        />
      </template>
      <div class="d-flex">
        <div class="order-handle mr-3">
          <EpMaterialIcon v-if="isEditing">
            drag_indicator
          </EpMaterialIcon>
        </div>
        <div class="w-100">
          <slot
            :data="modelObject"
            :index="index"
          />
        </div>
      </div>
    </EpCollapse>
  </draggable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import draggable from 'vuedraggable';
import { DEFAULT_DRAGGABLE_PROPERTIES } from '@shared/utils/defaults';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  isEditing: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
  },
});

const defaultDragOptions = computed(() => {
  return {
    ...DEFAULT_DRAGGABLE_PROPERTIES,
    disabled: !props.isEditing,
    group: {
      name: 'EpDraggableCollapse',
    },
  };
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
