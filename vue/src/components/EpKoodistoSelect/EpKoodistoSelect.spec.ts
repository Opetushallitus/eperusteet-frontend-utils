import { mount } from '@vue/test-utils';
import EpKoodistoSelect from './EpKoodistoSelect.vue';
import { KoodistoSelectStore } from './KoodistoSelectStore';
import { Page } from '../../tyypit';
import { KoodistoKoodiDto } from '../../api/eperusteet';
import _ from 'lodash';
import { vi } from 'vitest';
import Vue from 'vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';

describe.skip('EpKoodistoSelect component', () => {
  let mockData = {
    data: [{
      koodiUri: 'koodiuri1',
      koodiArvo: 'koodiarvo1',
    }, {
      koodiUri: 'koodiuri2',
      koodiArvo: 'koodiarvo2',
    }, {
      koodiUri: 'koodiuri3',
      koodiArvo: 'koodiarvo3',
    }] as KoodistoKoodiDto[],
    sivu: 0,
    sivukoko: 3,
    sivuja: 1,
  } as Page<KoodistoKoodiDto>;

  const store = new KoodistoSelectStore({
    koodisto: 'test',
    query: vi.fn(async (query, page, koodisto, onlyValid) => {
      // Make sure to update the store's internal state when query is called
      store.state.value.data = mockData;
      return mockData;
    }),
  });

  function mountWrapper(props: any, methods: any) {
    return mount(EpKoodistoSelect,
      {
        props: {
          store: store,
          ...props,
        },
        slots: {
          default: '<template #default="{ open }"><b-button id="open" @click="open">lisaa koodi</b-button></template>',
        },
        listeners: {
          add: methods.lisaaKoodit,
        },
        attachToDocument: true,
        global: {
          ...globalStubs,
        },
      });
  }

  test.only('Renders', async () => {
    const wrapper = mountWrapper({
      multiple: false,
    }, {
      lisaaKoodit: (valittuKoodi) => {},
    });
    await nextTick();
    wrapper.find('#open').trigger('click');
    await nextTick();
    expect(wrapper.html()).toContain('koodiarvo1');
  });

  test('single row selected and returned', async () => {
    let koodi;
    const wrapper = mountWrapper({
      multiple: false,
    }, {
      lisaaKoodit: (valittuKoodi) => {
        koodi = valittuKoodi;
      },
    });
    await nextTick();
    wrapper.find('#open').trigger('click');
    await nextTick();

    wrapper.findAll('tr[role="row"]').at(1).trigger('click');

    await nextTick();

    expect(koodi.uri).toBe('koodiuri1');
  });

  test('multiple rows selected and returned', async () => {
    let koodit;
    const wrapper = mountWrapper({
      multiple: true,
    }, {
      lisaaKoodit: (valittuKoodi) => {
        koodit = valittuKoodi;
      },
    });
    await nextTick();
    wrapper.find('#open').trigger('click');
    await nextTick();

    wrapper.findAll('tr[role="row"]').at(1)
      .trigger('click');
    await nextTick();

    wrapper.findAll('tr[role="row"]').at(2)
      .trigger('click');

    await nextTick();

    expect(_.size(koodit)).toBe(0);
    wrapper.find('footer.modal-footer').find('.btn-primary')
      .trigger('click');
    await nextTick();

    expect(_.size(koodit)).toBe(2);
    expect(koodit[0].uri).toBe('koodiuri1');
    expect(koodit[1].uri).toBe('koodiuri2');
  });
});
