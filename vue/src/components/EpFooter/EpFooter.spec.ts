import { mount } from '@vue/test-utils';
import EpFooter from './EpFooter.vue';
import { globalStubs } from '../../utils/__tests__/stubs';
import EpLinkki from '../EpLinkki/EpLinkki.vue';
import EpMaterialIcon from '../EpMaterialIcon/EpMaterialIcon.vue';
import EpExternalLink from '../EpExternalLink/EpExternalLink.vue';
import { TietoapalvelustaStore } from '../../stores/TietoapavelustaStore';
import { vi } from 'vitest';

vi.mock('../../stores/TietoapavelustaStore', () => {
  return {
    TietoapalvelustaStore: vi.fn().mockImplementation(() => ({
      state: {
        tietoapalvelusta: null,
      },
      tietoapalvelusta: {
        value: null,
      },
      fetch: vi.fn().mockResolvedValue(undefined),
    })),
  };
});

describe('EpFooter component', () => {
  test('Renders', async () => {
    const wrapper = mount(EpFooter, {
      components: {
        EpLinkki,
        EpMaterialIcon,
        EpExternalLink,
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
