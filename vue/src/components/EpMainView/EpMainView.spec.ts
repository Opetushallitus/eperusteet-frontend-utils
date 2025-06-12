import { mount } from '@vue/test-utils';
import EpMainView from './EpMainView.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpMainView component', () => {
  test('Renders', async () => {
    const wrapper = mount(EpMainView, {
      slots: {
        default: 'DEFAULT SLOT',
        'custom-content': 'CUSTOM CONTENT',
        after: 'AFTER CONTENT',
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toContain('DEFAULT SLOT');
    expect(wrapper.html()).toContain('CUSTOM CONTENT');
    expect(wrapper.html()).toContain('AFTER CONTENT');
  });
});
