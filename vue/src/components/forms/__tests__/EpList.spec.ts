import { mount } from '@vue/test-utils';
import EpList from '../EpList.vue';
import { createI18n } from 'vue-i18n';
import { nextTick } from 'vue';
import { defineComponent } from 'vue';
import { mocks } from '@shared/utils/jestutils';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpList component', () => {
  const valueMock = [{ id: 1, kentta: 'arvo1' }, { id: 2, kentta: 'arvo2' }];

  const i18n = createI18n({
    legacy: false,
    locale: 'fi',
    messages: {
      fi: {
        'lisaa-sisalto': 'lisaasisalto',
      },
    },
  });

  function mountWrapper() {
    // Create wrapper component that uses EpList
    const TestComponent = defineComponent({
      components: {
        EpList,
      },
      props: ['isEditing'],
      data() {
        return {
          value: valueMock,
        };
      },
      template: '<ep-list :is-editable="isEditing" kentta="kentta" v-model="value" />',
    });

    return mount(TestComponent, {
      global: {
        ...globalStubs,
      },
    });
  }

  test('Renders list with content', async () => {
    const wrapper = mountWrapper();

    expect(wrapper.html()).toContain('arvo1');
    expect(wrapper.html()).toContain('arvo2');
  });

  test.skip('Delete list content', async () => {
    const wrapper = mountWrapper();

    await wrapper.setProps({ isEditing: true });
    await nextTick();

    expect(wrapper.findAll('div.arvo')).toHaveLength(2);
    expect(wrapper.vm.value).toHaveLength(2);

    await wrapper.findAll('button.btn-link')[0].trigger('click');
    await nextTick();

    expect(wrapper.vm.value).toHaveLength(1);
    expect(wrapper.findAll('div.arvo')).toHaveLength(1);
  });

  test.skip('Add list content', async () => {
    const wrapper = mountWrapper();

    await wrapper.setProps({ isEditing: true });
    await nextTick();

    expect(wrapper.vm.value).toHaveLength(2);
    expect(wrapper.findAll('div.arvo')).toHaveLength(2);

    await wrapper.find('.ep-button button').trigger('click');
    await nextTick();

    expect(wrapper.vm.value).toHaveLength(3);
    expect(wrapper.findAll('div.arvo')).toHaveLength(3);
  });
});
