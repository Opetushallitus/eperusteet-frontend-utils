<template>
  <div class="ep-content">
    <ep-editor-menu-bar
      :is-editable="isEditable"
      :editor="editor"
    />

    <editor-content
      :editor="editor"
      :class="{ 'is-editable': isEditable }"
    />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { onBeforeUnmount } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';
import { inject } from 'vue';
import { provide } from 'vue';
import { $kaannaPlaceholder } from '@shared/utils/globals';
import _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';
import EpEditorMenuBar from './EpEditorMenuBar.vue';
import { TableKit } from '@tiptap/extension-table';
import { watch } from 'vue';
import { createImageExtension3 } from './ImageExtension3';

const props = defineProps({
  modelValue: {
    type: Object || null,
    required: true,
  },
  isEditable: {
    type: Boolean,
    default: false,
  },
  isPlainString: {
    type: Boolean,
    default: false,
  },
});

const focused = ref(false);
const emit = defineEmits(['update:modelValue']);
const injectedKuvaHandler = inject('kuvaHandler');

// Computed properties for handlers
const annettuKuvaHandler = computed(() => {
  return props.kuvaHandler || injectedKuvaHandler;
});

// Provide kuvaHandler for child components (if needed)
provide('kuvaHandler', annettuKuvaHandler);

const localizedValue = computed(() => {
  if (!props.modelValue) {
    return null;
  }
  else if (props.isPlainString) {
    return props.modelValue || '';
  }
  else if (_.isObject(props.modelValue)) {
    return placeholder.value || (props.modelValue)[Kielet.getSisaltoKieli.value] || '';
  }
  else {
    return props.modelValue;
  }
});

const model = computed(() => {
  return props.modelValue;
});

const placeholder = computed(() => {
  if (!focused.value) {
    return $kaannaPlaceholder(props.modelValue, !props.isEditable);
  }
  return undefined;
});

watch(model, async (val) => {
  if (!props.isEditable) {
    editor.value.commands.setContent(localizedValue.value);
  }
}, { deep: true });

const editor = useEditor({
  content: localizedValue.value,
  extensions: [
    StarterKit,
    TableKit,
    ...(annettuKuvaHandler.value ? [createImageExtension3(annettuKuvaHandler.value)] : []),
  ],
  editable: props.isEditable.value,
  editorProps: {
    attributes: {
      role: '',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', {
      ...props.modelValue,
      [Kielet.getSisaltoKieli.value]: editor.getHTML(),
    });
  },
});

onBeforeUnmount(() => {
  editor.value.destroy();
});
</script>
<style scoped lang="scss">
@import "../../styles/_variables.scss";

.ep-content {
  padding: 0;
  word-break: break-word;

  .is-editable {
    border: 1px solid $black;
    padding: 10px;
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

}
</style>
