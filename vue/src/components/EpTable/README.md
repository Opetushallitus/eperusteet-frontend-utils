# EpTable

A wrapper component around PrimeVue DataTable that provides Bootstrap-like table styling and API.

## Props

- `items` (Array, required): Array of data objects to display in the table
- `fields` (Array, required): Array of field definitions (see Field Definition below)
- `striped` (Boolean, default: false): Enable striped rows
- `fixed` (Boolean, default: false): Use fixed table layout
- `responsive` (Boolean, default: false): Enable responsive scrolling
- `hover` (Boolean, default: false): Enable hover effect on rows

## Field Definition

Each field can be an object with the following properties:

- `key` (String, required): Property name from the data object
- `label` (String): Header label for the column
- `thStyle` (String | Object): Styles for the header cell
- `tdStyle` (String | Object): Styles for the body cells
- `formatter` (Function): Custom formatter function `(value, key, item) => formatted value`

## Slots

Custom cell rendering can be achieved using scoped slots:

```vue
<EpTable :items="items" :fields="fields">
  <template #cell(fieldName)="{ item, value }">
    {{ value }}
  </template>
</EpTable>
```

## Example Usage

```vue
<template>
  <EpTable
    striped
    fixed
    responsive
    hover
    :fields="fields"
    :items="items"
  >
    <template #cell(name)="{ item }">
      <router-link :to="{ name: 'detail', params: { id: item.id } }">
        {{ item.name }}
      </router-link>
    </template>
  </EpTable>
</template>

<script setup>
import EpTable from '@shared/components/EpTable/EpTable.vue';

const fields = [
  { key: 'id', label: 'ID', thStyle: 'width: 15%' },
  { key: 'name', label: 'Name' },
  { 
    key: 'date', 
    label: 'Date',
    formatter: (value) => new Date(value).toLocaleDateString()
  }
];

const items = [
  { id: 1, name: 'Item 1', date: '2024-01-01' },
  { id: 2, name: 'Item 2', date: '2024-01-02' }
];
</script>
```

## Migration from Bootstrap b-table

The EpTable component is designed to be mostly compatible with Bootstrap Vue's b-table:

- Props: `striped`, `fixed`, `responsive`, `hover`, `fields`, `items` work the same way
- Slots: The main difference is in slot syntax:
  - b-table: `#cell(fieldname)="data"` where you access `data.item`
  - EpTable: `#cell(fieldname)="{ item }"` where `item` is directly available

### Example Migration

Before (b-table):
```vue
<b-table striped hover :fields="fields" :items="items">
  <template #cell(name)="data">
    {{ data.item.name }}
  </template>
</b-table>
```

After (EpTable):
```vue
<EpTable striped hover :fields="fields" :items="items">
  <template #cell(name)="{ item }">
    {{ item.name }}
  </template>
</EpTable>
```
