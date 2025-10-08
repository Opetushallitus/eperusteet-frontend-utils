import { mount, RouterLinkStub } from '@vue/test-utils';
import EpKayttaja from './EpKayttaja.vue';
import { Kieli } from '../../tyypit';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';
import { delay } from '../../utils/delay';
import { Kielet } from '../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import EpCollapse from '../EpCollapse/EpCollapse.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { ref } from 'vue';
import { nextTick } from 'vue';

// Mock the Kielet store with a reactive value for uiKieli
const uiKieliRef = ref('fi');

vi.mock('../../stores/kieli', () => ({
  Kielet: {
    uiKieli: {
      get value() {
        return uiKieliRef.value;
      },
      set value(val) {
        uiKieliRef.value = val;
      },
    },
    setUiKieli: vi.fn((kieli) => {
      uiKieliRef.value = kieli;
    }),
    search: vi.fn().mockReturnValue(true),
    i18n: {
      t: vi.fn().mockImplementation((key) => key),
      fallbackLocale: 'fi',
    },
  },
  UiKielet: ['fi', 'sv', 'en'],
}));
// Mock router with push method
const mockRouter = {
  currentRoute: {
    params: {
      lang: 'fi',
    },
  },
  push: vi.fn().mockImplementation((route) => {
    mockRouter.currentRoute = route;
    return Promise.resolve();
  }),
};

// Provide the mock router
const mockUseRouter = vi.fn().mockReturnValue(mockRouter);
vi.mock('vue-router', () => ({
  useRouter: () => mockUseRouter(),
}));

describe('EpKayttaja component', () => {
  test('Renders', async () => {

    const wrapper = mount(EpKayttaja, {
      components: {
        EpCollapse,
      },
      props: {
        tiedot: {
          kutsumanimi: 'etunimi',
          sukunimi: 'sukunimi',
        },
        sovellusOikeudet: [
          {
            eperusteSovellus:
              {
                sovellus: 'APP_EPERUSTEET',
                url: 'eperuste-url',
              },
            valittu: true,
          },
          {
            eperusteSovellus: {
              sovellus: 'APP_EPERUSTEET_AMOSAA',
              url: 'amosaa-url',
            },
            valittu: false,
          },
        ],
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toContain('etunimi sukunimi');

    // Verify initial UI language is 'fi'
    expect(wrapper.find('.uikieli small').text()).toBe('fi');

    // Open language selection dropdown
    await wrapper.findAll('.ep-collapse').at(1)
      .trigger('click');
    await wrapper.vm.$nextTick();

    // Change language to Swedish using the component's method
    await wrapper.vm.valitseUiKieli(Kieli.sv);

    // Wait for all promises to resolve
    await new Promise(resolve => setTimeout(resolve, 0));

    // Force component update to ensure reactive changes are applied
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Verify router was called with new language
    expect(mockRouter.push).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({ lang: 'sv' }),
    }));

    // Verify Kielet store was updated
    expect(uiKieliRef.value).toBe('sv');

    // Verify UI now shows the updated language
    expect(wrapper.find('.uikieli small').text()).toBe('sv');

    // Verify selected application is shown
    expect(wrapper.find('.valittu-sovellus small').text()).toBe('APP_EPERUSTEET');

    // Open application selection dropdown
    await wrapper.findAll('.ep-collapse .collapse-button').at(1)
      .trigger('click');
    await nextTick();

    // Verify application options are shown
    expect(wrapper.findAll('.sovellusoikeus').length).toBe(2);
    expect(wrapper.html()).toContain('amosaa-url');

    expect(wrapper.html()).toMatchSnapshot();
  });
});
