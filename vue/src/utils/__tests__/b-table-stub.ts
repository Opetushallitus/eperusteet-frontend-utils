import { h, renderSlot } from 'vue';

export const bTableStub = {
  props: ['items', 'fields'],
  render() {
    const items = this.items || [];
    const fields = this.fields || [];

    return h('div', { class: 'b-table' }, [
      // Render table headers
      h('div', { class: 'table-header' }, [
        fields.map(field => {
          const fieldKey = typeof field === 'string' ? field : field.key;
          const headSlotName = `head(${fieldKey})`;
          if (this.$slots[headSlotName]) {
            return h('div', { class: `header-${fieldKey}` }, [
              renderSlot(this.$slots, headSlotName),
            ]);
          }
          return h('div', { class: `header-${fieldKey}` }, fieldKey);
        }),
      ]),
      // Render table rows
      h('div', { class: 'table-body' }, [
        items.map((item, index) =>
          h('div', { class: 'table-row', key: index }, [
            fields.map(field => {
              const fieldKey = typeof field === 'string' ? field : field.key;
              const cellSlotName = `cell(${fieldKey})`;
              if (this.$slots[cellSlotName]) {
                return h('div', { class: `cell-${fieldKey}` }, [
                  renderSlot(this.$slots, cellSlotName, {
                    item: item,
                    value: item[fieldKey],
                    index: index,
                  }),
                ]);
              }
              return h('div', { class: `cell-${fieldKey}` }, item[fieldKey] || '');
            }),
          ]),
        ),
      ]),
      // Render default slot
      renderSlot(this.$slots, 'default'),
      // Dynamically render any other slots that aren't cell or head slots
      ...Object.keys(this.$slots)
        .filter(slotName =>
          slotName !== 'default'
          && !slotName.startsWith('cell(')
          && !slotName.startsWith('head('),
        )
        .map(slotName =>
          h('div', { class: `b-table__slot-${slotName}` }, [
            renderSlot(this.$slots, slotName),
          ]),
        ),
    ]);
  },
};
