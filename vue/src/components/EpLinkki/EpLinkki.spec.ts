import { mount, RouterLinkStub } from '@vue/test-utils';
import EpLinkki from './EpLinkki.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpLinkki component', () => {

  test('Renders', async () => {
    const wrapper = mount(EpLinkki, {
      propsData: {
        url: 'https://eperusteet.opintopolku.fi',
      },
      global: {
        ...globalStubs,
      },
    });

    const el = wrapper.find('a');
    expect(el.attributes('rel')).toEqual('noopener noreferrer');
    expect(wrapper.text()).toEqual('eperusteet.opintopolku.fi');
    expect(el.attributes('href')).toEqual('https://eperusteet.opintopolku.fi');
  });
});
