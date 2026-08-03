import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import EpTable from './EpTable.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

const fields = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
];

const items = [
  { id: 1, name: 'Alpha' },
  { id: 2, name: 'Beta' },
  { id: 3, name: 'Gamma' },
];

function mountTable(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(EpTable, {
    props: {
      fields,
      items,
      ...props,
    },
    slots,
    attachTo: document.body,
    global: {
      ...globalStubs,
    },
  });
}

describe('EpTable component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('renders rows with formatter output', async () => {
    const wrapper = mountTable({
      fields: [
        {
          key: 'name',
          label: 'Name',
          formatter: (value: string) => `formatted:${value}`,
        },
      ],
    });

    await nextTick();

    expect(document.body.textContent).toContain('formatted:Alpha');
    expect(document.body.textContent).toContain('formatted:Beta');

    wrapper.unmount();
  });

  test('renders custom cell slot content', async () => {
    const wrapper = mountTable(
      {},
      {
        'cell(name)': '<span class="custom-cell">{{ item.name }}!</span>',
      },
    );

    await nextTick();

    expect(document.body.querySelectorAll('.custom-cell').length).toBeGreaterThan(0);
    expect(document.body.textContent).toContain('Alpha!');

    wrapper.unmount();
  });

  test('emits row-selected with single row on row click', async () => {
    const wrapper = mountTable({
      selectMode: 'single',
      dataKey: 'id',
    });

    await nextTick();

    const row = document.body.querySelector('.p-datatable-tbody tr');
    expect(row).toBeTruthy();
    row!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    await nextTick();

    expect(wrapper.emitted('row-selected')).toBeTruthy();
    expect(wrapper.emitted('row-selected')![0][0]).toEqual([items[0]]);

    wrapper.unmount();
  });

  test('emits row-selected when multiple selection changes', async () => {
    const wrapper = mountTable({
      selectMode: 'multiple',
      dataKey: 'id',
    });

    await nextTick();

    const dataTable = wrapper.findComponent({ name: 'DataTable' });
    dataTable.vm.$emit('update:selection', [items[0], items[1]]);

    await nextTick();

    expect(wrapper.emitted('row-selected')).toBeTruthy();
    expect(wrapper.emitted('row-selected')![0][0]).toEqual([items[0], items[1]]);

    wrapper.unmount();
  });

  test('emits update:currentPage on paginator page change', async () => {
    const manyItems = Array.from({ length: 12 }, (_, index) => ({
      id: index + 1,
      name: `Item ${index + 1}`,
    }));

    const wrapper = mountTable({
      items: manyItems,
      perPage: 5,
      currentPage: 1,
    });

    await nextTick();

    const dataTable = wrapper.findComponent({ name: 'DataTable' });
    dataTable.vm.$emit('page', { first: 5, rows: 5 });

    await nextTick();

    expect(wrapper.emitted('update:currentPage')).toBeTruthy();
    expect(wrapper.emitted('update:currentPage')![0][0]).toBe(2);

    wrapper.unmount();
  });
});
