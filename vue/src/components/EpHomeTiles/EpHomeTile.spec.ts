import { mount, RouterLinkStub } from '@vue/test-utils';
import EpHomeTile from './EpHomeTile.vue';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';
import { Kielet } from '../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

// Vue.use(BootstrapVue);

describe('EpHomeTile component', () => {
  test('Renders state', async () => {
    const wrapper = mount(EpHomeTile, {
      props: {
        icon: 'add',
        color: 'red',
        route: { name: 'perusteprojektit' },
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  test('Router link', async () => {
    const wrapper = mount(EpHomeTile, {
      props: {
        icon: 'add',
        color: 'red',
        href: 'https://eperusteet.opintopolku.fi',
        count: 1,
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
