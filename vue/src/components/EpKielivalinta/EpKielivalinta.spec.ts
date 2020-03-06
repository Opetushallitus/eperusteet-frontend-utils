import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import { findContaining } from '../../utils/jestutils';
import EpKielivalinta from './EpKielivalinta.vue';
import { Kieli } from '../../tyypit';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';
import { delay } from '../../utils/delay';
import { Kielet } from '../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import EpCollapse from '../EpCollapse/EpCollapse.vue';

Vue.use(BootstrapVue);

describe('EpKielivalinta component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    const wrapper = mount(EpKielivalinta, {
      localVue,
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
});
