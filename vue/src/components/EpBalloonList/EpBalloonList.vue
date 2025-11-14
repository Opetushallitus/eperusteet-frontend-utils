<template>
  <div>
    <VueDraggable
      v-bind="defaultDragOptions"
      v-model="inner"
      tag="div"
    >
      <div
        v-for="(item, idx) in inner"
        :key="idx"
        class="balloon-wrapper"
      >
        <div class="balloon d-flex">
          <div
            v-if="isDraggable"
            class="order-handle mr-2"
          >
            <EpMaterialIcon>drag_indicator</EpMaterialIcon>
          </div>
          <slot v-bind="{ item }" />
        </div>
      </div>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

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
  sortable: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const inner = computed({
  get: () => props.modelValue,
  set: (value: any[]) => {
    emit('update:modelValue', value);
  },
});

const isDraggable = computed(() => {
  return props.isEditing && props.sortable;
});

const defaultDragOptions = computed(() => {
  return {
    animation: 300,
    emptyInsertThreshold: 10,
    handle: '.order-handle',
    disabled: !isDraggable.value,
    ghostClass: 'dragged',
    group: {
      name: 'balloonsorts',
    },
  };
});
</script>

<style lang="scss" scoped>

.balloon-wrapper {
  margin-bottom: 6px;

  .balloon {
    background: #e6f6ff;
    border-radius: 60px;
    padding: 8px 8px 8px 18px;
    border: 1px solid #cdeeff;
  }
}

</style>
