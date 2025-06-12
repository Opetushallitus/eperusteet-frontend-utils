import { mount, RouterLinkStub } from '@vue/test-utils';
import EpAikatauluListaus from './EpAikatauluListaus.vue';
import Vue, { nextTick } from 'vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpAikatauluListaus component', () => {
  test('Renders', async () => {
    const wrapper = mount(EpAikatauluListaus, {
      props: {
        aikataulutProp: [{
          id: 42,
          tapahtuma: 'luominen',
          tapahtumapaiva: new Date(),
          tavoite: 'test',
        }],
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });

  test.skip('julkivalinta', async () => {
    const wrapper = mount(EpAikatauluListaus, {
      props: {
        aikataulutProp: [{
          id: 42,
          tapahtuma: 'luominen',
          tapahtumapaiva: new Date(),
          tavoite: 'test',
        }, {
          id: 43,
          tapahtuma: 'tavoite',
          tapahtumapaiva: new Date(),
          tavoite: 'test',
          julkinen: true,
        }],
        julkinenValinta: true,
      },
      global: {
        ...globalStubs,
      },
    });

    await nextTick();

    expect(wrapper.findAll('.paatavoite')).toHaveLength(0);
    expect(wrapper.findAll('.yleistavoite')).toHaveLength(1);

    const julkiChkbox = wrapper.find('.yleistavoite b-form-checkbox').element as any;
    expect(julkiChkbox.value).toBeTruthy();
  });
});
