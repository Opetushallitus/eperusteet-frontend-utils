import { mount, RouterLinkStub } from '@vue/test-utils';
import EpHomeTile from './EpHomeTile.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpHomeTile component', () => {
  test('Renders state', async () => {
    const wrapper = mount(EpHomeTile, {
      props: {
        icon: 'add',
        color: 'red',
        route: { name: 'perusteprojektit' },
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  test('Router link', async () => {
    const wrapper = mount(EpHomeTile, {
      props: {
        icon: 'add',
        color: 'red',
        href: 'https://eperusteet.opintopolku.fi',
        count: 1,
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
