import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import EpValidPopover from './EpValidPopover.vue';
import BootstrapVue from 'bootstrap-vue';
import { Kielet } from '../../stores/kieli';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';
import Vue from 'vue';

describe('EpValidPopover component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());
  localVue.use(BootstrapVue);

  test('Renders', async () => {
    const wrapper = mount(EpValidPopover, {
      localVue,
      propsData: {
        validoitava: {
          tila: 'luonnos',
          koulutustyyppi: 'koulutustyyppi_1',
        },
        validoinnit: {
          virheet: ['virhe1'],
        },
        julkaistava: false,
        julkaisemattomiaMuutoksia: false,
        tyyppi: 'peruste',
      },
      mocks: {
        $t: x => x,
        $sd: x => x,
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.html()).not.toContain('perusteessa-on-julkaisemattomia-muutoksia');
    expect(wrapper.html()).toContain('aseta-valmiiksi');

    wrapper.setProps(
      {
        ...wrapper.props,
        julkaisemattomiaMuutoksia: true,
        julkaistava: true,
      },
    );

    await Vue.nextTick();

    expect(wrapper.html()).toContain('perusteessa-on-julkaisemattomia-muutoksia');
    expect(wrapper.html()).toContain('siirry-julkaisunakymaan');
  });
});
