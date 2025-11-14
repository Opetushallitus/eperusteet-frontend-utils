import { mount } from '@vue/test-utils';
import EpJulkiLista from './EpJulkiLista.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';
import { wrap } from 'lodash';

// Vue.use(BootstrapVue);

describe('EpJulkiLista component', () => {

  const mountWrapper = (tietoMaara = 3) => {
    return mount(EpJulkiLista, {
      props: {
        tiedot: [],
        tietoMaara,
      },
      global: {
        ...globalStubs,
      },
    });
  };

  test('Renders information - no data', async () => {
    const wrapper = mountWrapper();

    expect(wrapper.html()).toContain('ei-tuloksia');
    expect(wrapper.html()).not.toContain('muokkausaika');
  });

  test('Renders list with one row', async () => {
    const wrapper = mountWrapper();

    wrapper.setProps({
      tiedot: [
        {
          otsikko: { 'fi': 'otsikko1' },
          uusi: false,
          muokattu: new Date(),
        },
      ],

    });

    await nextTick();

    expect(wrapper.html()).toContain('otsikko1');
    expect(wrapper.html()).toContain('muokkausaika');
    expect(wrapper.html()).not.toContain('katso-lisaa-tiedotteita');
  });

  test('Renders list with 2 row with button trigger', async () => {
    const wrapper = mountWrapper(2);

    wrapper.setProps({
      tiedot: [
        {
          otsikko: { 'fi': 'otsikko1' },
          uusi: false,
          muokattu: new Date(),
        },
        {
          otsikko: { 'fi': 'otsikko2' },
          uusi: true,
          muokattu: new Date(),
        },
        {
          otsikko: { 'fi': 'otsikko3' },
          uusi: false,
          muokattu: new Date(),
        },
        {
          otsikko: { 'fi': 'otsikko4' },
          uusi: false,
          muokattu: new Date(),
        },
      ],
    });

    await nextTick();

    expect(wrapper.html()).toContain('otsikko1');
    expect(wrapper.html()).toContain('otsikko2');

    expect(wrapper.findAll('div[class="otsikko"').at(0)
      .html()).not.toContain('uusi');
    expect(wrapper.findAll('div[class="otsikko"').at(1)
      .html()).not.toContain('uusi');

    expect(wrapper.html()).not.toContain('otsikko3');
    expect(wrapper.html()).not.toContain('otsikko4');
    expect(wrapper.html()).toContain('katso-lisaa-tiedotteita');

    wrapper.find('.b-button').trigger('click');

    await nextTick();

    expect(wrapper.html()).toContain('otsikko3');
    expect(wrapper.html()).toContain('otsikko4');
    expect(wrapper.html()).not.toContain('katso-lisaa-tiedotteita');
  });

  test.skip('Renders list with 2 and paging', async () => {
    const wrapper = mountWrapper(2);

    wrapper.setProps({
      listausTyyppi: 'sivutus',
      tiedot: [
        {
          otsikko: { 'fi': 'otsikko1' },
          uusi: false,
          muokattu: new Date(),
        },
        {
          otsikko: { 'fi': 'otsikko2' },
          uusi: true,
          muokattu: new Date(),
        },
        {
          otsikko: { 'fi': 'otsikko3' },
          uusi: false,
          muokattu: new Date(),
        },
        {
          otsikko: { 'fi': 'otsikko4' },
          uusi: false,
          muokattu: new Date(),
        },
      ],
    });

    await nextTick();

    expect(wrapper.html()).toContain('otsikko1');
    expect(wrapper.html()).toContain('otsikko2');
    expect(wrapper.html()).not.toContain('otsikko3');
    expect(wrapper.html()).not.toContain('otsikko4');

    expect(wrapper.findAll('.b-button').at(0)
      .html()).toContain('1');
    expect(wrapper.findAll('.b-button').at(1)
      .html()).toContain('2');

    wrapper.findAll('.b-button').at(1)
      .trigger('click');

    await nextTick();

    expect(wrapper.html()).not.toContain('otsikko1');
    expect(wrapper.html()).not.toContain('otsikko2');
    expect(wrapper.html()).toContain('otsikko3');
    expect(wrapper.html()).toContain('otsikko4');
  });
});
