import { createLocalVue, mount } from '@vue/test-utils';
import EpTekstikappaleLisays from './EpTekstikappaleLisays.vue';
import BootstrapVue from 'bootstrap-vue';
import { mocks } from '@shared/utils/jestutils';
import Vuelidate from 'vuelidate';
import Vue from 'vue';

describe('EpKoodistoSelect component', () => {
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  localVue.use(Vuelidate);

  function mountWrapper(props: any, methods: any) {
    return mount(EpTekstikappaleLisays,
      {
        propsData: {
          ...props,
          tallenna: methods.saveTekstikappale,
        },
        attachToDocument: true,
        localVue,
        mocks: mocks,
      });
  }

  test('Renders', async () => {
    const wrapper = mountWrapper({
      tekstikappaleet: [],
      paatasovalinta: true,
    }, {
      saveTekstikappale: (saveTekstikappale) => {},
    });

    (wrapper.find({ ref: 'tekstikappalelisaysModal' }).vm as any).static = true;
    await localVue.nextTick();

    wrapper.find('#tekstikappalelisaysBtn').trigger('click');

    await localVue.nextTick();
    expect(wrapper.html()).toContain('lisaa-uusi-tekstikappale');
    expect(wrapper.html()).toContain('toisen-tekstikappaleen-alla');

    wrapper.setProps({ paatasovalinta: false });

    await Vue.nextTick();

    expect(wrapper.html()).not.toContain('toisen-tekstikappaleen-alla');
  });

  test('saving without main branch', async () => {
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

    (wrapper.find({ ref: 'tekstikappalelisaysModal' }).vm as any).static = true;
    await localVue.nextTick();
    wrapper.find('#tekstikappalelisaysBtn').trigger('click');
    await localVue.nextTick();

    expect(wrapper.findAll('button.btn-primary[disabled]')).toHaveLength(1);

    wrapper.findAll('option').at(1)
      .setSelected();

    await Vue.nextTick();

    expect(wrapper.findAll('button.btn-primary[disabled]')).toHaveLength(0);

    wrapper.find('button.btn-primary').trigger('click');

    await Vue.nextTick();

    expect(tekstikappale.saveTekstikappale).toEqual('tekstk1');
  });

  test('saving with main branch', async () => {
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

    (wrapper.find({ ref: 'tekstikappalelisaysModal' }).vm as any).static = true;
    await localVue.nextTick();
    await localVue.nextTick();

    wrapper.find('#tekstikappalelisaysBtn').trigger('click');
    await localVue.nextTick();

    wrapper.find('input').setValue('otsikko1');

    await Vue.nextTick();

    expect(wrapper.vm.$data.taso).toBe('paataso');
    expect(wrapper.findAll('button.btn-primary[disabled]')).toHaveLength(0);

    wrapper.findAll('input').at(0)
      .setValue('otsikko1');

    await Vue.nextTick();

    expect(wrapper.findAll('button.btn-primary[disabled]')).toHaveLength(0);

    wrapper.find('button.btn-primary').trigger('click');

    await Vue.nextTick();

    expect(tekstikappale.otsikko).toEqual({ 'fi': 'otsikko1' });
    expect(tekstikappale.saveTekstikappale).toEqual({});
  });

  test('Renders Opintokokonaisuuden nimi label', async () => {
    const wrapper = mountWrapper({
      tekstikappaleet: [],
      paatasovalinta: true,
      modalId: 'opintokokonaisuusLisays',
    }, {
      saveTekstikappale: () => {},
    });

    (wrapper.find({ ref: 'tekstikappalelisaysModal' }).vm as any).static = true;
    await localVue.nextTick();

    await Vue.nextTick();

    expect(wrapper.html()).toContain('opintokokonaisuuden-nimi');
  });
});
