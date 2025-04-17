import { mount } from '@vue/test-utils';
import EpPerusteContent from './EpPerusteContent.vue';
import { mocks } from '../../utils/jestutils';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';

describe('EpPerusteContent', () => {

  const options = (data) => {
    return {
      props: {
        ...data,
      },
      global: {
        ...globalStubs,
      },
    };
  };

  it('Read-only', async () => {
    const wrapper = mount(EpPerusteContent, options({
      perusteTekstiAvattu: true,
      perusteObject: {
        otsikko: {
          fi: 'otsikko1',
        },
        teksti: {
          fi: '<p>teksti1</p>',
        },
      },
      pohjaObject: {
        teksti: {
          fi: '<p>pohjan tekstia</p>',
        },
      },
      object: {
        teksti: {
          fi: 'teksti2',
        },
      },
    }));

    await nextTick();
    expect(wrapper.html()).toContain('otsikko1');
    expect(wrapper.html()).toContain('teksti1');
    expect(wrapper.html()).toContain('pohjan tekstia');

    expect(wrapper.html()).toContain('teksti2');
  });

  it('Read-only - no perusteobject', async () => {
    const wrapper = mount(EpPerusteContent, options({
      perusteTekstiAvattu: true,
      object: {
        teksti: {
          fi: 'teksti2',
        },
      },
    }));

    await nextTick();
    expect(wrapper.html()).not.toContain('perusteen-teksti');
    expect(wrapper.html()).toContain('teksti2');
  });

  it('No local text', async () => {
    const wrapper = mount(EpPerusteContent, options({
      perusteTekstiAvattu: true,
      perusteObject: {
        otsikko: {
          fi: 'otsikko1',
        },
        teksti: {
          fi: '<p>teksti1</p>',
        },
      },
      object: {
      },
    }));

    await nextTick();
    expect(wrapper.html()).toContain('otsikko1');
    expect(wrapper.html()).toContain('teksti1');
  });

  it('No local text - editing', async () => {
    const wrapper = mount(EpPerusteContent, options({
      perusteTekstiAvattu: true,
      isEditing: true,
      perusteObject: {
        otsikko: {
          fi: 'otsikko1',
        },
        teksti: {
          fi: '<p>teksti1</p>',
        },
      },
      object: {
      },
    }));

    await nextTick();
    expect(wrapper.html()).toContain('otsikko1');
    expect(wrapper.html()).toContain('teksti1');
  });
});
