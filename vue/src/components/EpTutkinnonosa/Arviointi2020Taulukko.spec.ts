import { mount, RouterLinkStub } from '@vue/test-utils';
import Arviointi2020Taulukko from './Arviointi2020Taulukko.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('Arviointi 2020', () => {
  test('Renders', async () => {
    const wrapper = mount(Arviointi2020Taulukko, {
      props: {
        arviointi: {
          osaamistasonKriteerit: [{
            osaamistaso: {
              otsikko: {
                fi: 'otsikko',
              },
            },
            kriteerit: [{
              fi: 'kriteeri',
            }],
          }],
        },
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.html()).toContain('otsikko');
    expect(wrapper.html()).toContain('kriteeri');
  });
});
