import { createLocalVue, mount } from '@vue/test-utils';
import Vue from 'vue';
import EpEditorMenuBar from './EpEditorMenuBar.vue';
import EpContent from './EpContent.vue';
import { KieliStore, Kielet } from '@shared/stores/kieli';
import { Kieli } from '@shared/tyypit';
import { Editor } from 'tiptap';
import '@/config/bootstrap';
import '@/config/fontawesome';

import {
  Blockquote,
  Bold,
  Underline,
  Strike,
  Italic,
  Code,
  CodeBlock,
  HardBreak,
  History,
  BulletList,
  ListItem,
  OrderedList,
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from 'tiptap-extensions';

function createEditor(config: any) {
  return new Editor({
    content: '',
    editable: config.isEditable,
    extensions: [
      new HardBreak(),
      new History(),
      new Blockquote(),
      new Bold(),
      new Italic(),
      new Strike(),
      new Underline(),
      new BulletList(),
      new OrderedList(),
      new ListItem(),
      // new Image(),
      new Table({ resizable: true }),
      new TableHeader(),
      new TableCell(),
      new TableRow(),
    ],
  });
}

function createWrapper(localVue, config: any = {}) {
  const wrapper = mount(EpEditorMenuBar as any, {
    localVue,
    attachToDocument: true,
    i18n: KieliStore.i18n,
    propsData: {
      help: '',
      layout: 'simplified',
      sticky: false,
      isEditable: false,
      editor: createEditor(config),
      ...config,
    },
  } as any);
  return wrapper;
}


describe.only('EpContent component', async () => {

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterAll(() => {
    (console.error as any).mockRestore();
  });

  const localVue = createLocalVue();
  KieliStore.setup(localVue);
  const propsData = {
    help: '',
    layout: 'simplified',
    sticky: false,
    isEditable: false,
    value: {
      fi: 'foo',
      sv: 'sv',
    },
  };

  const wrapper = mount(EpContent as any, {
    localVue,
    attachToDocument: true,
    i18n: KieliStore.i18n,
    propsData,
    stubs: {
      'EditorView': true,
    },
  } as any);

  test('Initializes', () => {
    expect(wrapper.html()).toBeTruthy();
    expect((wrapper.vm as any).editor).toBeTruthy();
  });

  test('Value updates', () => {
    expect((wrapper.vm as any).localizedValue).toEqual('foo');
    wrapper.setProps({ value: 'bar' });
    expect((wrapper.vm as any).localizedValue).toEqual('bar');
  });

  test('Renders', async () => {
    wrapper.setProps({
      value: {
        fi: 'teksti1234',
        sv: 'sv',
      },
    });
    expect(wrapper.html()).toContain('teksti1234');
  });

  test('Language changing works', async () => {
    expect((wrapper.vm as any).lang).toEqual('fi');
    wrapper.setProps({ locale: 'sv' });
    expect((wrapper.vm as any).locale).toEqual('sv');
    expect((wrapper.vm as any).localizedValue).toEqual('sv');
    expect(wrapper.html()).not.toContain('teksti1234');
    expect(wrapper.html()).toContain('sv');
  });

  return wrapper;
});


describe('EpContentMenu component', () => {
  const localVue = createLocalVue();
  KieliStore.setup(localVue);

  it('Hide menu when read only', async () => {
    const wrapper = createWrapper(localVue, {
      isEditable: false,
    });
    expect(wrapper.html()).toBeFalsy();
  });

  it('Check that menu is rendered when edit is enabled', async () => {
    const wrapper = createWrapper(localVue, {
      isEditable: true,
    });

    expect(wrapper.find('button[title="Lihavoi"]').exists()).toBe(true);
    expect(wrapper.find('button[title="Kursivoi"]').exists()).toBe(true);
    expect(wrapper.find('button[title="Redo"]').exists()).toBe(true);
    expect(wrapper.find('button[title="Undo"]').exists()).toBe(true);
    expect(wrapper.find('button[title="Yliviivaus"]').exists()).toBe(true);
    expect(wrapper.find('button[title="Lisää taulukko"]').exists()).toBe(false);
    expect(wrapper.find('button[title="Lisää kuva"]').exists()).toBe(false);
  });

  it('Check minimal editor mode', async () => {
    const wrapper = createWrapper(localVue, {
      isEditable: true,
      layout: 'minimal',
    });
    expect(wrapper.find('button[title="Redo"]').exists()).toBe(true);
    expect(wrapper.find('button[title="Undo"]').exists()).toBe(true);
    expect(wrapper.find('button[title="Lihavoi"]').exists()).toBe(false);
    expect(wrapper.find('button[title="Kursivoi"]').exists()).toBe(false);
    expect(wrapper.find('button[title="Yliviivaus"]').exists()).toBe(false);
    expect(wrapper.find('button[title="Lisää taulukko"]').exists()).toBe(false);
  });

  it('Check normal editor mode', async () => {
    const wrapper = createWrapper(localVue, {
      isEditable: true,
      layout: 'normal',
    });
    expect(wrapper.find('button[title="Lihavoi"]').exists()).toBe(true);
    expect(wrapper.find('button[class="question"]').exists()).toBe(false);
    expect(wrapper.find('button[title="Kursivoi"]').exists()).toBe(true);
    expect(wrapper.find('button[title="Redo"]').exists()).toBe(true);
    expect(wrapper.find('button[title="Undo"]').exists()).toBe(true);
    expect(wrapper.find('button[title="Yliviivaus"]').exists()).toBe(true);
    expect(wrapper.find('button[title="Lisää taulukko"]').exists()).toBe(true);
  });

});
