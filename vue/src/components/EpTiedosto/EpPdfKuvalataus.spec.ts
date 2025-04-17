import { mount, RouterLinkStub } from '@vue/test-utils';
import EpFileupload from './EpPdfKuvalataus.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpFileupload component', () => {
  test('Renders', async () => {
    const wrapper = mount(EpFileupload, {
      props: {
        tyyppi: 'binary',
        dto: null,
        kuvaUrl: 'kuva.png',
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
