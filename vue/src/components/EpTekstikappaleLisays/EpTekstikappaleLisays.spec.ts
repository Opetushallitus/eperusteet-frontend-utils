import { mount } from '@vue/test-utils';
import EpTekstikappaleLisays from './EpTekstikappaleLisays.vue';
import { nextTick } from 'vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpTekstikappaleLisays component', () => {
  function mountWrapper(props: any, methods: any) {
    return mount(EpTekstikappaleLisays,
      {
        props: {
          ...props,
          tallenna: methods.saveTekstikappale,
        },
        attachTo: document.body,
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

    expect(wrapper.html()).toContain('uusi-tekstikappale');

    wrapper.find('#tekstikappalelisaysBtn').trigger('click');

    await nextTick();
    // Modal content is teleported to document.body (PrimeVue Dialog)
    const bodyHtml = () => document.body.innerHTML;
    expect(bodyHtml()).toContain('tekstikappale-nimi-ohje');
    expect(bodyHtml()).toContain('toisen-tekstikappaleen-alla');

    await wrapper.setProps({ paatasovalinta: false });

    await nextTick();

    expect(bodyHtml()).not.toContain('toisen-tekstikappaleen-alla');

    wrapper.unmount();
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

    const options = wrapper.findAll('option');
    expect(options.length).toBeGreaterThan(1);
    // @ts-expect-error DOMWrapper typings mark setSelected as private
    await options[1].setSelected();

    await nextTick();

    expect(wrapper.findAll('button.btn-primary[disabled]')).toHaveLength(0);

    wrapper.find('button.btn-primary').trigger('click');

    await nextTick();

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

    const inputs = wrapper.findAll('input');
    expect(inputs.length).toBeGreaterThan(0);
    await inputs[0].setValue('otsikko1');

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

    wrapper.find('#tekstikappalelisaysBtn').trigger('click');

    await nextTick();

    expect(document.body.innerHTML).toContain('opintokokonaisuuden-nimi');

    wrapper.unmount();
  });
});
