import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import EpHomeTile from './EpHomeTile.vue';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';
import { Kielet } from '../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

describe('EpHomeTile component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders state', async () => {
    const wrapper = mount(EpHomeTile, {
      localVue,
      propsData: {
        icon: 'plus',
        color: 'red',
        route: { name: 'perusteprojektit' },
      },
      mocks: {
        $t: x => x,
      },
      stubs: {
        fas: '<div />',
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  test('Router link', async () => {
    const wrapper = mount(EpHomeTile, {
      localVue,
      propsData: {
        icon: 'plus',
        color: 'red',
        href: 'https://eperusteet.opintopolku.fi',
      },
      mocks: {
        $t: x => x,
      },
      stubs: {
        fas: '<div />',
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

});

