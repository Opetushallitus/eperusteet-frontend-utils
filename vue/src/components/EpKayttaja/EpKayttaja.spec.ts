import { mount, RouterLinkStub } from '@vue/test-utils';
import EpKayttaja from './EpKayttaja.vue';
import { Kieli } from '../../tyypit';
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

function kayttajaDropdownRoot() {
  return document.querySelector('.ep-kayttaja-dropdown');
}

async function openKayttajaDropdown(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('.ep-dropdown-trigger').trigger('click');
  await nextTick();
  await nextTick();
}

describe('EpKayttaja component', () => {
  test('Renders', async () => {

    const wrapper = mount(EpKayttaja, {
      components: {
        EpCollapse,
      },
      attachTo: document.body,
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
        stubs: {
          ...globalStubs.stubs,
          RouterLink: RouterLinkStub,
        },
      },
    });

    expect(wrapper.html()).toContain('etunimi sukunimi');

    await openKayttajaDropdown(wrapper);

    // EpDropdown renders menu in document.body (PrimeVue Popover append-to="body")
    const menu = kayttajaDropdownRoot();
    expect(menu).toBeTruthy();

    // Verify initial UI language is 'fi'
    expect(menu!.querySelector('.uikieli small')?.textContent?.trim()).toBe('fi');

    // Change language to Swedish using the component's method
    await wrapper.vm.valitseUiKieli(Kieli.sv);

    await nextTick();

    // Verify router was called with new language
    expect(mockRouter.push).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({ lang: 'sv' }),
    }));

    // Verify Kielet store was updated
    expect(uiKieliRef.value).toBe('sv');

    // Verify UI now shows the updated language
    expect(kayttajaDropdownRoot()?.querySelector('.uikieli small')?.textContent?.trim()).toBe('sv');

    // Verify selected application is shown
    expect(kayttajaDropdownRoot()?.querySelector('.valittu-sovellus small')?.textContent?.trim()).toBe('APP_EPERUSTEET');

    // Open application selection collapse (second collapse-button: vaihda-sovellusta)
    const collapseButtons = kayttajaDropdownRoot()?.querySelectorAll('.collapse-button') ?? [];
    expect(collapseButtons.length).toBeGreaterThan(1);
    await collapseButtons[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    // Verify application options are shown
    expect(kayttajaDropdownRoot()?.querySelectorAll('.sovellusoikeus').length).toBe(2);
    expect(document.body.innerHTML).toContain('amosaa-url');

    expect(wrapper.html()).toMatchSnapshot();

    wrapper.unmount();
  });
});
