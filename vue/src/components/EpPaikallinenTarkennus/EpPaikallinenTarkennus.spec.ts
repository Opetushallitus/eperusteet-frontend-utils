import { mount } from '@vue/test-utils';
import { mocks } from '../../utils/jestutils';
import EpPaikallinenTarkennus from './EpPaikallinenTarkennus.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';

describe('EpPaikallinenTarkennus', () => {

  const options = (data, slots = {}) => {
    return {
      props: {
        ...data,
      },
      global: {
        ...globalStubs,
      },
      slots,
    };
  };

  it('default settings', async () => {
    const wrapper = mount(
      EpPaikallinenTarkennus,
      options({},
        { default: '<div>paikallinen tarkennus</div>' },
      ),
    );

    await nextTick();

    expect(wrapper.html()).toContain('ep-collapse');
    expect(wrapper.html()).toContain('paikallinen-teksti');
    expect(wrapper.html()).toContain('paikallinen tarkennus');
  });

  it('no header', async () => {
    const wrapper = mount(
      EpPaikallinenTarkennus,
      options({
        noheader: true,
      },
      { default: '<div>paikallinen tarkennus</div>' },
      ),
    );

    await nextTick();
    expect(wrapper.html()).not.toContain('ep-collapse');
    expect(wrapper.html()).not.toContain('paikallinen-teksti');
    expect(wrapper.html()).toContain('paikallinen tarkennus');
  });

  it('non collapsable', async () => {
    const wrapper = mount(
      EpPaikallinenTarkennus,
      options({
        avattava: false,
      },
      { default: '<div>paikallinen tarkennus</div>' },
      ),
    );

    await nextTick();
    expect(wrapper.html()).not.toContain('ep-collapse');
    expect(wrapper.html()).toContain('paikallinen-teksti');
    expect(wrapper.html()).toContain('paikallinen tarkennus');
  });
});
