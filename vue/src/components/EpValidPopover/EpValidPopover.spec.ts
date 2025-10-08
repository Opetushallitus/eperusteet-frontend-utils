import { mount } from '@vue/test-utils';
import EpValidPopover from './EpValidPopover.vue';
import { createI18n } from 'vue-i18n';
import { Kielet } from '../../stores/kieli';
import { nextTick } from 'vue';

describe('EpValidPopover component', () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'fi',
    messages: {
      fi: {},
    },
  });

  test('Renders', async () => {
    const wrapper = mount(EpValidPopover, {
      global: {
        plugins: [i18n],
        stubs: {
          RouterLink: true,
        },
        mocks: {
          $t: x => x,
          $sd: x => x,
        },
      },
      props: {
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
    });

    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.html()).not.toContain('perusteessa-on-julkaisemattomia-muutoksia');
    expect(wrapper.html()).toContain('aseta-valmiiksi');

    await wrapper.setProps({
      julkaisemattomiaMuutoksia: true,
      julkaistava: true,
    });

    await nextTick();

    expect(wrapper.html()).toContain('perusteessa-on-julkaisemattomia-muutoksia');
    expect(wrapper.html()).toContain('siirry-julkaisunakymaan');
  });
});
