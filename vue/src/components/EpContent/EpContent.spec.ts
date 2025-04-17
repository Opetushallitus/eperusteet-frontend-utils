import { mount, shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import EpEditorMenuBar from './EpEditorMenuBar.vue';
import EpContent from './EpContent.vue';
import { Kielet } from '../../stores/kieli';
import { Editor } from 'tiptap';
import { vi } from 'vitest';
import { nextTick } from 'vue';

import {
  Blockquote,
  Bold,
  Underline,
  Strike,
  Italic,
  HardBreak,
  History,
  BulletList,
  ListItem,
  OrderedList,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Link,
} from 'tiptap-extensions';
import ImageExtension from './ImageExtension';
import { Kieli } from '@shared/tyypit';

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
      new Link(),
      // new Image(),
      new Table({ resizable: true }),
      new TableHeader(),
      new TableCell(),
      new TableRow(),
      ...(config.extensions ? config.extensions : []),
    ],
  });
}

function createWrapper(config: any = {}) {
  const i18n = createI18n({
    legacy: false,
    locale: 'fi',
    messages: {
      fi: {},
    },
  });

  const wrapper = mount(EpEditorMenuBar, {
    global: {
      plugins: [i18n],
      provide: {
        i18n: i18n.global,
      },
    },
    props: {
      help: '',
      layout: 'simplified',
      sticky: false,
      isEditable: false,
      editor: createEditor(config),
      ...config,
    },
    // Removed attachTo: document.body to prevent DOM manipulation issues
  });
  return wrapper;
}

describe.skip('EpContent component', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as any).mockRestore();
  });

  const i18n = createI18n({
    legacy: false,
    locale: 'fi',
    messages: {
      fi: {},
    },
  });

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

  // Using shallowMount instead of mount to prevent DOM manipulation issues
  const wrapper = shallowMount(EpContent, {
    global: {
      plugins: [i18n],
      provide: {
        i18n: i18n.global,
      },
    },
    props: propsData,
    // Removed attachTo: document.body
  });

  test('Initializes', () => {
    expect(wrapper.html()).toBeTruthy();
    expect((wrapper.vm as any).editor).toBeTruthy();
  });

  test('Value updates', async () => {
    expect((wrapper.vm as any).localizedValue).toEqual('foo');
    await wrapper.setProps({ modelValue: 'bar' });
    expect((wrapper.vm as any).localizedValue).toEqual('bar');
  });

  test('Renders', async () => {
    await wrapper.setProps({
      modelValue: {
        fi: 'teksti1234',
        sv: 'sv',
      },
    });
    expect(wrapper.html()).toContain('teksti1234');
  });

  test('Language changing works', async () => {
    expect((wrapper.vm as any).lang).toEqual('fi');
    await wrapper.setProps({ locale: 'sv' });
    expect((wrapper.vm as any).locale).toEqual('sv');
    expect((wrapper.vm as any).localizedValue).toEqual('sv');
    expect(wrapper.html()).not.toContain('teksti1234');
    expect(wrapper.html()).toContain('sv');
  });

  test('Renders with language placeholder', async () => {
    await wrapper.setProps({
      modelValue: {
        fi: 'teksti1234',
      },
      locale: null,
    });

    Kielet.setSisaltoKieli(Kieli.fi);
    await nextTick();
    expect(wrapper.html()).toContain('teksti1234');

    Kielet.setSisaltoKieli(Kieli.sv);
    await nextTick();
    expect(wrapper.html()).toContain('[teksti1234]');

    await wrapper.setProps({ isEditable: true });
    await nextTick();
    expect(wrapper.html()).toContain('teksti1234');
    expect(wrapper.html()).not.toContain('[teksti1234]');
    expect(wrapper.html()).toContain('placeholder');

    await wrapper.setProps({ modelValue: {
      fi: 'teksti1234',
      sv: 'testi',
    } });

    await nextTick();
    expect(wrapper.html()).not.toContain('placeholder');

    await wrapper.setProps({ modelValue: {
      fi: '<p>teksti1234</p>',
    },
    isEditable: false,
    });

    await nextTick();
    expect(wrapper.html()).toContain('<p>[</p>\n      <p>teksti1234</p>\n      <p>]</p>');
  });
});

describe.skip('EpContentMenu component', () => {
  it('Hide menu when read only', async () => {
    const wrapper = createWrapper({
      isEditable: false,
    });
    expect(wrapper.html()).toBeFalsy();
  });

  it('Check that menu is rendered when edit is enabled', async () => {
    const wrapper = createWrapper({
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
    const wrapper = createWrapper({
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
    const wrapper = createWrapper({
      isEditable: true,
      layout: 'normal',
      extensions: [new ImageExtension({} as any)],
    });

    expect(wrapper.find('button[title="Lihavoi"]').exists()).toBe(true);
    expect(wrapper.find('button[class="question"]').exists()).toBe(false);
    expect(wrapper.find('button[title="Kursivoi"]').exists()).toBe(true);
    expect(wrapper.find('button[title="Redo"]').exists()).toBe(true);
    expect(wrapper.find('button[title="Undo"]').exists()).toBe(true);
    expect(wrapper.find('button[title="Yliviivaus"]').exists()).toBe(true);
    expect(wrapper.find('button[title="Lisää taulukko"]').exists()).toBe(true);
    expect(wrapper.find('button[title="Lisää kuva"]').exists()).toBe(true);
  });
});
