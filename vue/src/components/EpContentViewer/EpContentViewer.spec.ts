import { mount } from '@vue/test-utils';
import EpContentViewer from './EpContentViewer.vue';
import { Kielet } from '../../stores/kieli';
import { globalStubs } from '@shared/utils/__tests__/stubs';

vi.mock('vue-router', () => (
  {
    useRoute: vi.fn(),
    useRouter: vi.fn(),
  }));
describe('EpContentViewer component', () => {
  const i18n = Kielet.i18n;


  function mountWrapper(props: any) {
    return mount({
      components: {
        EpContentViewer,
      },
      data() {
        return {
          ...props,
        };
      },
      global: {
        ...globalStubs,
      },
      template: '<div class="test"><ep-content-viewer :value="value" :termit="termit" :kuvat="kuvat" /></div>',
    });
  }

  test('Renders', () => {
    const wrapper = mountWrapper({
      value: '<p>Lorem ipsum</p>',
      termit: [],
      kuvat: [],
    });

    expect(wrapper.html()).toContain('Lorem ipsum');
  });

  test('Renders image text', () => {
    const wrapper = mountWrapper({
      value: '<p>Lorem ipsum <img data-uid="123-123" alt="kuvateksti" /></p>',
      termit: [],
      kuvat: [{
        src: 'url/osoite',
        id: '123-123',
      }],
    });

    expect(wrapper.findAll('figure')).toHaveLength(1);
    expect(wrapper.find('figure').find('img')
      .html()).toContain('src="url/osoite"');
    expect(wrapper.find('figure').find('figcaption')
      .html()).toContain('kuvateksti');
  });

  // Todo: termit
});
