import { mount } from '@vue/test-utils';
import EpTekstikappaleLisays from './EpTekstikappaleLisays.vue';
import Vue, { nextTick } from 'vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpKoodistoSelect component', () => {
  function mountWrapper(props: any, methods: any) {
    return mount(EpTekstikappaleLisays,
      {
        props: {
          ...props,
          tallenna: methods.saveTekstikappale,
        },
        attachToDocument: true,
        global: {
          ...globalStubs,
        },
      });
  }

  test('Renders', async () => {
    const wrapper = mountWrapper({
      tekstikappaleet: [],
      paatasovalinta: true,
    }, {
      saveTekstikappale: (saveTekstikappale) => {},
    });

    await nextTick();

    wrapper.find('#tekstikappalelisaysBtn').trigger('click');

    await nextTick();
    expect(wrapper.html()).toContain('uusi-tekstikappale');
    expect(wrapper.html()).toContain('tekstikappale-nimi-ohje');
    expect(wrapper.html()).toContain('toisen-tekstikappaleen-alla');

    wrapper.setProps({ paatasovalinta: false });

    await nextTick();

    expect(wrapper.html()).not.toContain('toisen-tekstikappaleen-alla');
  });

  test.skip('saving without main branch', async () => {
    let tekstikappale;
    const wrapper = mountWrapper({
      tekstikappaleet: ['tekstk1', 'tekstk2'],
      paatasovalinta: false,
      otsikkoRequired: false,
    }, {
      saveTekstikappale: (otsikko, saveTekstikappale) => {
        tekstikappale = {
          otsikko,
          saveTekstikappale,
        };
      },
    });

    await nextTick();

    expect(wrapper.findAll('button.btn-primary[disabled]')).toHaveLength(1);

    wrapper.findAll('option').at(1).setSelected();

    await Vue.nextTick();

    expect(wrapper.findAll('button.btn-primary[disabled]')).toHaveLength(0);

    wrapper.find('button.btn-primary').trigger('click');

    await Vue.nextTick();

    expect(tekstikappale.saveTekstikappale).toEqual('tekstk1');
  });

  test.skip('saving with main branch', async () => {
    let tekstikappale;
    const wrapper = mountWrapper({
      tekstikappaleet: ['tekstk1', 'tekstk2'],
      paatasovalinta: true,
    }, {
      saveTekstikappale: (otsikko, saveTekstikappale) => {
        tekstikappale = {
          otsikko,
          saveTekstikappale,
        };
      },
    });

    await nextTick();

    wrapper.find('input').setValue('otsikko1');

    await nextTick();

    expect(wrapper.vm.taso).toBe('paataso');
    expect(wrapper.findAll('button.btn-primary[disabled]')).toHaveLength(0);

    wrapper.findAll('input').at(0)
      .setValue('otsikko1');

    await nextTick();

    expect(wrapper.findAll('button.btn-primary[disabled]')).toHaveLength(0);

    // wrapper.find('button.btn-primary').trigger('click');

    // await nextTick();

    // expect(tekstikappale.otsikko).toEqual({ 'fi': 'otsikko1' });
    // expect(tekstikappale.saveTekstikappale).toEqual({});
  });

  test('Renders Opintokokonaisuuden nimi label', async () => {
    const wrapper = mountWrapper({
      tekstikappaleet: [],
      paatasovalinta: true,
      modalId: 'opintokokonaisuusLisays',
    }, {
      saveTekstikappale: () => {},
    });

    await nextTick();

    expect(wrapper.html()).toContain('opintokokonaisuuden-nimi');
  });
});
