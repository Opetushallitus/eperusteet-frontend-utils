<template>
  <div
    v-if="items"
    class="ep-table"
    :class="{ 'borderless': borderless, [theadClass]: theadClass }"
  >
    <DataTable
      :value="tableValue"
      :data-key="resolvedDataKey"
      :striped-rows="striped"
      :hover-rows="hover"
      :responsive-layout="responsive ? 'scroll' : 'default'"
      :table-style="fixed ? 'table-layout: fixed' : undefined"
      :selection="selectionValue"
      :selection-mode="selectionMode"
      :paginator="usePagination"
      :rows="perPage"
      :first="firstRow"
      :total-records="totalRecords"
      :show-headers="showHeaders"
      :lazy="noLocalSorting || isRemotePagination"
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
        :header-class="field.thClass"
        :body-style="field.tdStyle"
        :body-class="field.tdClass"
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
            :item="unwrapRow(slotProps.data)"
            :value="getCellValue(slotProps.data, field)"
            :formatted-value="formatCellValue(slotProps.data, field)"
            :index="slotProps.index"
            :data="{ item: unwrapRow(slotProps.data), value: getCellValue(slotProps.data, field), index: slotProps.index }"
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
      <template #paginatorfirstpagelinkicon>
        {{ $t('alkuun') }}
      </template>
      <template #paginatorprevpagelinkicon>
        <EpMaterialIcon>keyboard_double_arrow_left</EpMaterialIcon>
      </template>
      <template #paginatornextpagelinkicon>
        <EpMaterialIcon>keyboard_double_arrow_right</EpMaterialIcon>
      </template>
      <template #paginatorlastpagelinkicon>
        {{ $t('loppuun') }}
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import _ from 'lodash';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

export interface TableField {
  key: string;
  label?: string;
  thStyle?: string | object;
  thClass?: string;
  tdStyle?: string | object;
  tdClass?: string;
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
    type: [String, Function],
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
  totalRows: {
    type: Number,
    default: undefined,
  },
});

const EP_TABLE_ROW_INDEX_KEY = '__epTableRowIndex';
const EP_TABLE_PRIMITIVE_KEY = '__epTablePrimitive';

const emit = defineEmits(['row-selected', 'row-clicked', 'update:currentPage', 'sort-changed']);

function isPlainRow(row: any) {
  return _.isPlainObject(row);
}

function unwrapRow(row: any) {
  if (isPlainRow(row) && _.has(row, EP_TABLE_PRIMITIVE_KEY)) {
    return row[EP_TABLE_PRIMITIVE_KEY];
  }
  return row;
}

const internalSelection = ref<any>(null);

const resolvedDataKey = computed(() => {
  return props.dataKey || EP_TABLE_ROW_INDEX_KEY;
});

const rows = computed(() => {
  if (props.dataKey) {
    return props.items;
  }

  return _.map(props.items, (row: any, index: number) => {
    if (isPlainRow(row)) {
      return { ...row, [EP_TABLE_ROW_INDEX_KEY]: index };
    }
    return {
      [EP_TABLE_ROW_INDEX_KEY]: index,
      [EP_TABLE_PRIMITIVE_KEY]: row,
    };
  });
});

const isRemotePagination = computed(() => props.totalRows !== undefined);

const tableValue = computed(() => {
  if (!isRemotePagination.value && props.noLocalSorting && usePagination.value && props.perPage) {
    return _.slice(rows.value, firstRow.value, firstRow.value + props.perPage);
  }
  return rows.value;
});

const totalRecords = computed(() => {
  if (isRemotePagination.value) {
    return props.totalRows;
  }
  return props.items?.length ?? 0;
});

const selectionValue = computed(() => {
  return props.selection !== undefined ? props.selection : internalSelection.value;
});

const usePagination = computed(() => {
  return !!props.items && props.items.length > 0 && props.perPage !== undefined && props.perPage > 0;
});

const internalCurrentPage = ref(props.currentPage);

watch(() => props.currentPage, (page) => {
  internalCurrentPage.value = page;
});

watch(() => props.items?.length, (length) => {
  if (isRemotePagination.value || !props.perPage || length == null) return;
  const lastPage = Math.max(1, Math.ceil(length / props.perPage));
  if (internalCurrentPage.value > lastPage) {
    internalCurrentPage.value = lastPage;
    emit('update:currentPage', lastPage);
  }
});

const firstRow = computed(() => {
  if (!usePagination.value || !props.perPage) return 0;
  return (internalCurrentPage.value - 1) * props.perPage;
});

const sortOrderValue = computed(() => {
  if (!props.sortBy) return undefined;
  return props.sortDesc ? -1 : 1;
});

const rowClassValue = computed(() => {
  if (props.rowClass == null || props.rowClass === '') return undefined;
  if (typeof props.rowClass === 'string') {
    const cls = props.rowClass;
    return () => cls;
  }
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
  emit('row-selected', selection);
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
  internalCurrentPage.value = newPage;
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
  const unwrapped = unwrapRow(item);
  if (!_.isPlainObject(unwrapped)) {
    return unwrapped;
  }
  return _.get(unwrapped, field.key);
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
@import '@shared/styles/_variables.scss';

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

    .p-paginator {
      justify-content: center;
      background: transparent;
      border: none;
      margin-top: 1rem;

      .p-paginator-current {
        display: none;
      }

      .p-paginator-first,
      .p-paginator-last,
      .p-paginator-page,
      .p-paginator-prev,
      .p-paginator-next {
        color: $link;
      }

      .p-disabled {
        color: $disabled;
        opacity: 0.5;
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
