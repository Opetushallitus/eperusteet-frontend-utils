import { mount } from '@vue/test-utils';
import EpViimeaikainenToiminta from './EpViimeaikainenToiminta.vue';
import { createI18n } from 'vue-i18n';
import { mock } from '@shared/utils/jestutils';
import { MuokkaustietoStore } from '@shared/stores/MuokkaustietoStore';

describe('EpViimeaikainenToiminta component', () => {
  test('Renders', async () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'fi',
      messages: {
        fi: {},
      },
    });

    const store = mock(MuokkaustietoStore);

    const wrapper = mount(EpViimeaikainenToiminta, {
      global: {
        plugins: [i18n],
        stubs: {
          RouterLink: true,
        },
        mocks: {
          $t: x => x,
        },
      },
      props: {
        muokkaustietoStore: store,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
