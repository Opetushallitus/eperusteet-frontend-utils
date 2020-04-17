import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import { findContaining } from '../../utils/jestutils';
import EpKayttaja from './EpKayttaja.vue';
import { Kieli } from '../../tyypit';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';
import { delay } from '../../utils/delay';
import { Kielet } from '../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import EpCollapse from '../EpCollapse/EpCollapse.vue';

Vue.use(BootstrapVue);

describe('EpKayttaja component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    let currentRoute = {
      x: 42,
      params: {
        lang: 'fi',
      },
    };

    const wrapper = mount(EpKayttaja, {
      localVue,
      propsData: {
        tiedot: {
          kutsumanimi: 'etunimi',
          sukunimi: 'sukunimi',
        },
      },
      mocks: {
        $t: x => x,
        $router: {
          currentRoute,
          async push(route: any) {
            currentRoute = route;
          },
        },
      },
      stubs: {
        fas: '<div />',
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).toContain('etunimi sukunimi');
    expect(wrapper.html()).toContain('kieli: fi');
    wrapper.find(EpCollapse).trigger('click');
    await delay();
    await (wrapper.vm as any).valitseUiKieli(Kieli.sv);

    expect(currentRoute).toEqual({
      x: 42,
      params: {
        lang: 'sv',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
