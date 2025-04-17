import { mount, RouterLinkStub } from '@vue/test-utils';
import EpAikatauluModal from './EpAikatauluModal.vue';

describe('EpAikatauluModal component', () => {

  test('Renders', async () => {
    const wrapper = mount(EpAikatauluModal, {
      propsData: {
        aikataulut: [{
          id: 42,
          tapahtuma: 'luominen',
          tapahtumapaiva: new Date(),
          tavoite: 'test',
        }],
      },
      mocks: {
        $t: x => x,
        $sd: x => x,
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
