import { mount } from '@vue/test-utils';
import EpJulkaisuHistoria from './EpJulkaisuHistoria.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpJulkaisuHistoria component', () => {
  test('Renders', async () => {
    const wrapper = mount(EpJulkaisuHistoria, {
      props: {
        julkaisut: [],
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.html()).toContain('ei-julkaisuja');
  });

  test('Renders with data', async () => {
    const wrapper = mount(EpJulkaisuHistoria, {
      props: {
        julkaisut: [
          {
            revision: 1,
            tiedote: { fi: 'tiedote' },
            luotu: '1614073923059',
            luoja: 'testi',
            tila: 'JULKAISTU',
          },
          {
            revision: 2,
            tiedote: { fi: 'tiedote' },
            luotu: '1614073923052',
            luoja: 'testi2',
            tila: 'JULKAISTU',
          },
          {
            revision: 3,
            tiedote: { fi: 'tiedote' },
            luotu: '1614073923053',
            luoja: 'testi2',
            tila: 'KESKEN',
          },
        ],
        palauta: () => {},
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.html()).not.toContain('ei-julkaisuja');
    expect(wrapper.html()).toContain('julkaistu-versio');
    expect(wrapper.html()).toContain('julkaisu-kesken');
    expect(wrapper.html()).toContain('palauta');
  });
});
