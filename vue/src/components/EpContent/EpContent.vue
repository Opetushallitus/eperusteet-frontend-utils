<template>
  <div class="ep-content">
    <ep-editor-menu-bar
      v-if="editor && layout !== 'none'"
      :is-editable="isEditable"
      :editor="editor || {}"
      :layout="layout"
    />

    <editor-content
      :editor="editor"
      :class="{ 'is-editable': isEditable, 'placeholder': placeholder }"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { onBeforeUnmount } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';
import { inject } from 'vue';
import { $kaannaPlaceholder } from '@shared/utils/globals';
import _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';
import EpEditorMenuBar from './EpEditorMenuBar.vue';
import { TableKit } from '@tiptap/extension-table';
import { Placeholder } from '@tiptap/extensions'
import { watch } from 'vue';
import { createImageExtension3 } from './ImageExtension';
import { createTermiExtension3 } from './TermiExtension';
import { createCustomLinkExtension } from './CustomLinkExtension';
import { EditorLayout } from '@shared/tyypit';
import { IKasiteHandler } from './KasiteHandler';
import { ILinkkiHandler } from './LinkkiHandler';
import { IKuvaHandler } from './KuvaHandler';
import { nextTick } from 'vue';
import { onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object || null,
    required: true,
  },
  isEditable: {
    type: Boolean,
    default: false,
  },
  layout: {
    type: String as () => EditorLayout,
    required: false,
    default: 'normal',
  },
  isPlainString: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
});

const striptag = document.createElement('span');
const focused = ref(false);
const emit = defineEmits(['update:modelValue']);
const injectedKuvaHandler = inject<IKuvaHandler>('kuvaHandler');
const injectedKasiteHandler = inject<IKasiteHandler>('kasiteHandler');
const injectedNavigation = inject<any>('navigation');
const injectedLinkkiHandler = inject<ILinkkiHandler>('linkkiHandler');

const lang = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const localizedValue = computed(() => {
  if (!props.modelValue) {
    return null;
  }
  else if (props.isPlainString) {
    return props.modelValue || '';
  }
  else if (_.isObject(props.modelValue)) {
    return (props.modelValue)[lang.value] || placeholder.value || '';
  }
  else {
    return props.modelValue;
  }
});

const model = computed(() => {
  return props.modelValue;
});

const placeholder = computed(() => {
if (!focused.value && !localizedValue.value) {
    if ($kaannaPlaceholder(props.modelValue, !props.isEditable)) {
      return $kaannaPlaceholder(props.modelValue, !props.isEditable);
    }

    return props.placeholder;
  }

  return undefined;
});

watch(localizedValue, async (val) => {
  if (editor.value && !focused.value) {
    await nextTick();
    await nextTick();
    // FIXME: RangeError: Applying a mismatched transaction
    editor.value.commands.setContent(localizedValue.value);
  }
});

watch(lang, async () => {
  if (editor.value) {
    await nextTick();
    editor.value.commands.setContent(localizedValue.value);
  }
});

function setUpEditorEvents() {
  if (editor.value) {
    const data = editor.value.getHTML();
    striptag.innerHTML = data;
    const isValid = !_.isEmpty(striptag.innerText || striptag.textContent) || striptag.getElementsByTagName('img').length > 0;
    const stripped = isValid ? data : null;

    if (!placeholder.value) {
      if (props.isPlainString) {
        emit('update:modelValue', stripped);
      }
      else {
        emit('update:modelValue', {
          ...props.modelValue,
          [Kielet.getSisaltoKieli.value as unknown as string]: stripped,
        });
      }
    }
  }
}

const editor = useEditor({
  content: localizedValue.value,
  extensions: [
    StarterKit.configure({
      link: false,
    }),
    TableKit,
    createCustomLinkExtension(injectedNavigation, injectedLinkkiHandler!),
    createImageExtension3(injectedKuvaHandler!),
    createTermiExtension3(injectedKasiteHandler!),
  ],
  editable: props.isEditable,
  editorProps: {
    attributes: {
      role: '',
    },
  },
  onUpdate: ({ editor }) => {
    // emit('update:modelValue', {
    //   ...props.modelValue,
    //   [Kielet.getSisaltoKieli.value]: editor.getHTML(),
    // });
    setUpEditorEvents();
  },
  onFocus: () => {
    if (props.isEditable) {
      focused.value = true;
      if (!localizedValue.value) {
        editor.value?.commands.setContent(localizedValue.value);
      }
    }
  },
  onBlur: () => {
    focused.value = false;
  },
});

const isEditable = computed(() => {
  return props.isEditable;
});

watch(isEditable, async (val) => {
  if (editor.value) {
    editor.value.setEditable(val);
    const { tr } = editor.value.state;
    const newTr = tr.setMeta('forceUpdate', true);
    editor.value.view.dispatch(newTr);
  }
});

onMounted(async () => {
  await nextTick();
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>
<style scoped lang="scss">
@import "../../styles/_variables.scss";

.ep-content {
  padding: 0;
  word-break: break-word;

  .placeholder {
    opacity: 0.5;
  }

  .is-editable {
    border: 1px solid $black;
    :deep(.ProseMirror) {
      padding: 10px;
    }
  }

  // Remove focus outline from the editor
  :deep(.ProseMirror) {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }

  // Remove focus outline from any contenteditable elements
  :deep([contenteditable]:focus) {
    outline: none !important;
    box-shadow: none !important;
  }

  // Style for the editor content wrapper
  :deep(.ProseMirror-focused) {
    outline: none !important;
  }

  :deep(table) {
    border-collapse: collapse;
    border-color: #999;
    border-spacing: 1px;
    display: table;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;

    td, th {
      vertical-align: top;
      border: 1px solid #ddd;
      padding: 4px;
    }
  }

  // Term styles
  :deep(abbr[data-viite]) {
    text-decoration: none !important;
    border-bottom: 1px dotted #999;
    cursor: help;
    background-color: rgba(0, 123, 255, 0.1);
    padding: 1px 2px;
    border-radius: 2px;
  }

  :deep(abbr.virheellinen) {
    color: $invalid;
    background-color: rgba(220, 53, 69, 0.1);
  }

  // Style terms that don't have a viite (empty or invalid)
  :deep(abbr[data-viite=""]) {
    background-color: rgba(220, 53, 69, 0.1);
    border-bottom-color: #dc3545;
  }

}
</style>
