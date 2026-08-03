import { mount } from '@vue/test-utils';
import EpExternalLink from './EpExternalLink.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpExternalLink component', () => {

  function mountWrapper(props : any) {
    return mount({
      components: {
        EpExternalLink,
      },
      data() {
        return {
          ...props,
        };
      },
      template: '<ep-external-link v-if="teksti" :url="url">{{ teksti }}</ep-external-link> <ep-external-link v-else :url="url"></ep-external-link>',
    });
  }

  test('Renders external link ', async () => {
    const wrapper = mountWrapper({
      url: 'www.google.com',
      teksti: 'google',
    });

    expect(wrapper.html()).toContain('</span>google');
  });

  test('Renders external link ', async () => {
    const wrapper = mountWrapper({
      url: 'www.google.com',
      teksti: undefined,
    });

    expect(wrapper.html()).not.toContain('google <!----></a>');
    expect(wrapper.html()).toContain('>www.google.com</span>');
    expect(wrapper.html()).not.toContain('?paluuosoite');
  });
});
