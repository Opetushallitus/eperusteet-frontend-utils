import { mount, RouterLinkStub } from '@vue/test-utils';
import EpAikataulu from './EpAikataulu.vue';
import Vue from 'vue';

describe('EpAikataulu component', () => {

  test('Renders', async () => {
    const wrapper = mount(EpAikataulu, {
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
