import { mount, createLocalVue } from '@vue/test-utils';
import { mocks } from '../../utils/jestutils';
import EpPaikallinenTarkennus from './EpPaikallinenTarkennus.vue';

describe('EpPaikallinenTarkennus', () => {
  const localVue = createLocalVue();

  const options = (data, slots = {}) => {
    return {
      propsData: {
        ...data,
      },
      mocks: mocks,
      localVue,
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

    await localVue.nextTick();

    console.log(wrapper.html());

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

    await localVue.nextTick();
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

    await localVue.nextTick();
    expect(wrapper.html()).not.toContain('ep-collapse');
    expect(wrapper.html()).toContain('paikallinen-teksti');
    expect(wrapper.html()).toContain('paikallinen tarkennus');
  });
});
