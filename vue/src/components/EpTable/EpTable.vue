<template>
  <div
    v-if="items"
    class="ep-table"
    :class="{ 'borderless': borderless, [theadClass]: theadClass }"
  >
    <DataTable
      :value="items"
      :data-key="dataKey"
      :striped-rows="striped"
      :hover-rows="hover"
      :responsive-layout="responsive ? 'scroll' : 'default'"
      :table-style="fixed ? 'table-layout: fixed' : undefined"
      :selection="selectionValue"
      :selection-mode="selectionMode"
      :paginator="usePagination"
      :rows="perPage"
      :first="firstRow"
      :show-headers="showHeaders"
      :lazy="noLocalSorting"
      :sort-field="sortBy"
      :sort-order="sortOrderValue"
      :row-class="rowClassValue"
      @update:selection="onSelectionChange"
      @row-click="onRowClick"
      @page="onPageChange"
      @sort="onSort"
    >
      <Column
        v-if="selectionMode === 'multiple'"
        selection-mode="multiple"
        :style="{ width: '3rem' }"
      />
      <Column
        v-for="field in normalizedFields"
        :key="field.key"
        :field="field.key"
        :header="field.label"
        :header-style="field.thStyle"
        :body-style="field.tdStyle"
        :sortable="field.sortable"
        :class="field.class"
        :sort-field="field.sortByFormatted ? (item: any) => formatCellValue(item, field) : undefined"
      >
        <template
          v-if="$slots[`head(${field.key})`]"
          #header
        >
          <slot :name="`head(${field.key})`" />
        </template>
        <template #body="slotProps">
          <slot
            v-if="slotProps.data"
            :name="`cell(${field.key})`"
            :item="slotProps.data"
            :value="getCellValue(slotProps.data, field)"
            :index="slotProps.index"
            :data="{ item: slotProps.data, value: getCellValue(slotProps.data, field), index: slotProps.index }"
          >
            {{ formatCellValue(slotProps.data, field) }}
          </slot>
        </template>
      </Column>
      <template
        v-if="$slots.empty"
        #empty
      >
        <slot name="empty" />
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import _ from 'lodash';

export interface TableField {
  key: string;
  label?: string;
  thStyle?: string | object;
  tdStyle?: string | object;
  formatter?: (value: any, key: string, item: any) => any;
  sortable?: boolean;
  sortByFormatted?: boolean;
  class?: string;
}

const props = defineProps({
  items: {
    type: [Array, null],
    required: false,
  },
  fields: {
    type: Array as () => TableField[],
    required: true,
  },
  striped: {
    type: Boolean,
    default: false,
  },
  fixed: {
    type: Boolean,
    default: false,
  },
  responsive: {
    type: Boolean,
    default: false,
  },
  hover: {
    type: Boolean,
    default: false,
  },
  borderless: {
    type: Boolean,
    default: false,
  },
  selectMode: {
    type: String as () => 'none' | 'single' | 'multiple',
    default: 'none',
  },
  selectedVariant: {
    type: String,
    default: '',
  },
  perPage: {
    type: Number,
    default: undefined,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  theadClass: {
    type: String,
    default: '',
  },
  showHeaders: {
    type: Boolean,
    default: true,
  },
  sortBy: {
    type: String,
    default: undefined,
  },
  sortDesc: {
    type: Boolean,
    default: false,
  },
  noLocalSorting: {
    type: Boolean,
    default: false,
  },
  rowClass: {
    type: Function,
    default: undefined,
  },
  selection: {
    type: [Array, Object],
    default: undefined,
  },
  dataKey: {
    type: String,
    default: undefined,
  },
});

const emit = defineEmits(['row-selected', 'row-clicked', 'update:currentPage', 'sort-changed']);

const internalSelection = ref<any>(null);

const selectionValue = computed(() => {
  return props.selection !== undefined ? props.selection : internalSelection.value;
});

const usePagination = computed(() => {
  return props.perPage !== undefined && props.perPage > 0;
});

const firstRow = computed(() => {
  if (!usePagination.value || !props.perPage) return 0;
  return (props.currentPage - 1) * props.perPage;
});

const sortOrderValue = computed(() => {
  if (!props.sortBy) return undefined;
  return props.sortDesc ? -1 : 1;
});

const rowClassValue = computed(() => {
  if (!props.rowClass) return undefined;
  return props.rowClass as (data: any) => string | object | undefined;
});

const selectionMode = computed<'single' | 'multiple' | null>(() => {
  if (props.selectMode === 'none') return null;
  return props.selectMode === 'single' ? 'single' : 'multiple';
});

const onSelectionChange = (selection: any) => {
  if (props.selectMode === 'none' || props.selectMode === 'single') return;
  if (props.selection === undefined) {
    internalSelection.value = selection;
  }
  const selectedRows = Array.isArray(selection) ? selection : (selection ? [selection] : []);
  emit('row-selected', selectedRows);
};

const onRowClick = (event: any) => {
  if (props.selectMode === 'single') {
    internalSelection.value = event.data;
    emit('row-selected', [event.data]);
  }
  else {
    emit('row-clicked', event.data);
  }
};

const onPageChange = (event: any) => {
  if (!props.perPage) return;
  const newPage = Math.floor(event.first / props.perPage) + 1;
  emit('update:currentPage', newPage);
};

const onSort = (event: any) => {
  const field = typeof event?.sortField === 'string' ? event.sortField : undefined;
  if (field != null && event?.sortOrder != null) {
    emit('sort-changed', {
      sortBy: field,
      sortDesc: event.sortOrder === -1,
    });
  }
};

const normalizedFields = computed(() => {
  return props.fields.map((field) => {
    if (typeof field === 'string') {
      return {
        key: field,
        label: field,
      };
    }
    return field;
  });
});

function getCellValue(item: any, field: TableField) {
  return _.get(item, field.key);
}

function formatCellValue(item: any, field: TableField) {
  const value = getCellValue(item, field);

  if (field.formatter && item) {
    return field.formatter(value, field.key, item);
  }

  return value;
}
</script>

<style lang="scss" scoped>
.ep-table {
  :deep(.p-datatable) {
    border-radius: 0;

    .p-datatable-table {
      width: 100%;
      border-collapse: collapse;
    }

    .p-datatable-thead > tr > th {
      font-weight: 600;
      padding: 0.75rem;
      color: #495057;
      text-align: left;
      vertical-align: bottom;
      border-top: 1px solid #dee2e6;
      border-bottom: 2px solid #dee2e6;
    }

    .p-datatable-tbody > tr {

      &:nth-child(odd) {
        background-color: rgba(0, 0, 0, 0.05);
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.075);
      }

      > td {
        padding: 0.75rem;
        vertical-align: top;
        color: #212529;
        border-top: 1px solid #dee2e6;
      }
    }

    // Remove default PrimeVue striped styling
    .p-datatable-striped .p-datatable-tbody > tr.p-row-odd {
      background: transparent;
    }

    // Style DataTable's built-in paginator
    .p-paginator {
      background: transparent;
      border: none;
      padding: 1rem 0;

      .p-paginator-current {
        display: none;
      }

      .p-paginator-pages {
        .p-paginator-page {
          min-width: 2.5rem;
          height: 2.5rem;
          margin: 0 0.125rem;
          border-radius: 3px;
          color: #495057;

          &.p-highlight {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          &:not(.p-highlight):hover {
            background: #e9ecef;
          }
        }
      }

      .p-paginator-first,
      .p-paginator-prev,
      .p-paginator-next,
      .p-paginator-last {
        min-width: 2.5rem;
        height: 2.5rem;
        color: #495057;
        border-radius: 3px;
        margin: 0 0.125rem;

        &:not(.p-disabled):hover {
          background: #e9ecef;
        }

        &.p-disabled {
          opacity: 0.5;
        }
      }
    }
  }

  &.borderless :deep(.p-datatable) {
    .p-datatable-thead > tr > th {
      border: none;
    }

    .p-datatable-tbody > tr > td {
      border: none;
    }
  }

  &.hidden :deep(.p-datatable-thead) {
    display: none;
  }
}
</style>
