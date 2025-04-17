import { mount } from '@vue/test-utils';
import EpFooter from './EpFooter.vue';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';
import { Kielet } from '../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { globalStubs } from '../../utils/__tests__/stubs';
import EpLinkki from '../EpLinkki/EpLinkki.vue';
import EpMaterialIcon from '../EpMaterialIcon/EpMaterialIcon.vue';
import EpExternalLink from '../EpExternalLink/EpExternalLink.vue';

describe('EpFooter component', () => {
  test('Renders', async () => {
    const wrapper = mount(EpFooter, {
      components: {
        EpLinkki,
        EpMaterialIcon,
        EpExternalLink,
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
