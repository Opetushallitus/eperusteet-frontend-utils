import { createLocalVue, mount } from '@vue/test-utils';
import EpContentViewer from './EpContentViewer.vue';
import { KieliStore } from '../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);


describe('EpContentViewer component', () => {

  const localVue = createLocalVue();

  KieliStore.setup(localVue);

  const i18n = KieliStore.i18n;

  function mountWrapper(props) {
    return mount(localVue.extend({
      components: {
        EpContentViewer,
      },
      data() {
        return props;
      },
      template: '<ep-content-viewer :value="value" :termit="termit" :kuvat="kuvat" />'
    }), {
      localVue,
      i18n,
    });
  }

  test('Renders', async () => {
    const wrapper = mountWrapper({
      value: '<p>Lorem ipsum</p>',
      termit: [],
      kuvat: [],
    });

    expect(wrapper.html()).toContain('Lorem ipsum');

  });

  // Todo: kuvat ja termit

});
