<template>
  <div>
    <Paginator
      :first="firstRecord"
      class="mt-4"
      :rows="perPage"
      :totalRecords="totalPages"
      @page="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Paginator from 'primevue/paginator';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
    default: 1,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  ariaControls: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const perPage = computed(() => {
  return props.itemsPerPage;
});

const totalPages = computed(() => {
  return props.total;
});

const firstRecord = computed(() => {
  return (props.modelValue - 1) * props.itemsPerPage;
});

const onPageChange = (event: any) => {
  const newPage = event.page + 1; // PrimeVue uses 0-based page index
  emit('update:modelValue', newPage);
};
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

:deep(.p-paginator) {
  justify-content: center;
}

:deep(.p-disabled) {
  color: $disabled;
  opacity: 0.5;
}
</style>
