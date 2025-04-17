import { mount, RouterLinkStub } from '@vue/test-utils';
import Osaamistavoitteet from './Osaamistavoitteet.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

// Vue.use(BootstrapVue);

describe('Osaamistavoitteet', () => {
  test('Renders', async () => {
    const wrapper = mount(Osaamistavoitteet, {
      props: {
        isEditing: false,
        tyyppi: 'pakollinen',
        perusteData: {},
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
