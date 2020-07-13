import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import EpViimeaikainenToiminta from './EpViimeaikainenToiminta.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { Kielet } from '../../stores/kieli';
import { MuokkaustietoStore } from '../../stores/MuokkaustietoStore';
import { delay } from '../../utils/delay';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';

Vue.use(BootstrapVue);

describe('EpViimeaikainenToiminta component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    const store = new MuokkaustietoStore();

    const wrapper = mount(EpViimeaikainenToiminta, {
      localVue,
      propsData: {
        muokkaustietoStore: store,
      },
      mocks: {
        $t: x => x,
      },
      stubs: {
        fas: '<div />',
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
