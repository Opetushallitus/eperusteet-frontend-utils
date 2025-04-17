import { mount } from '@vue/test-utils';
import EpPrefixList from './EpPrefixList.vue';
import { mocks } from '@shared/utils/jestutils';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import EpInput from '../forms/EpInput.vue';

describe('EpPrefixList', () => {
  it('Read-only', () => {
    const wrapper = mount(EpPrefixList, {
      global: {
        ...globalStubs,
        components: {
          EpInput,
        },
      },
      props: {
        modelValue: {
          kohde: {
            fi: 'kohde',
          },
          arvot: [{
            fi: 'arvo 1',
          }, {
            fi: 'arvo 2',
          }],
        },
      },
    });
    expect(wrapper.html()).toContain('kohde');
    expect(wrapper.html()).toContain('arvo 1');
    expect(wrapper.html()).toContain('arvo 2');
  });
});
