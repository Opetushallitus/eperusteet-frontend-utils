import { mount, RouterLinkStub } from '@vue/test-utils';
import EpPerustietoData from './EpPerustietoData.vue';
import { Kielet } from '../../stores/kieli';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';
import { globalStubs } from '@shared/utils/__tests__/stubs';

// Vue.use(BootstrapVue);

describe('EpPerustietoData component', () => {
  test('Renders', async () => {
    const wrapper = mount(EpPerustietoData, {
      props: {
        icon: 'chevron-left',
        topic: 'topic',
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
