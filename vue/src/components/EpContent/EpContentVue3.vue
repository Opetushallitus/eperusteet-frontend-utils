<template>
  <div class="ep-content">
    <ep-editor-menu-bar-vue3
      v-sticky="isSticky"
      :layout="layout"
      :is-editable="isEditable"
      :editor="editor"
      :help="toolbarHelp"
      sticky-offset="{ top: 114 }"
      sticky-z-index="500"
    />
    <editor-content
      ref="content"
      v-observe-visibility="visibilityChanged"
      :editor="editor"
      :class="{ 'content-invalid': validation && validationError, 'content-valid': validation && !validationError, 'placeholder': placeholder }"
    />
    <div
      v-if="!validationError && validMessage && isEditable"
      class="valid-feedback"
    >
      {{ $t(validMessage) }}
    </div>
    <div
      v-else-if="validationError && invalidMessage && isEditable"
      class="invalid-feedback"
    >
      {{ $t(invalidMessage) }}
    </div>
    <div
      v-else-if="validationError && !invalidMessage && isEditable"
      class="invalid-feedback"
    >
      {{ $t('validation-error-' + validationError, validation.$params[validationError]) }}
    </div>
    <small
      v-if="help && isEditable"
      class="form-text text-muted"
    >{{ $t(help) }}</small>
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, getCurrentInstance, useTemplateRef } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import { delay } from '@shared/utils/delay';
import { Kielet } from '@shared/stores/kieli';
import { EditorLayout } from '@shared/tyypit';
import { useVuelidate } from '@vuelidate/core';
import { IKasiteHandler } from './KasiteHandler';
import { IKuvaHandler } from './KuvaHandler';
import { ILinkkiHandler } from './LinkkiHandler';
import { fixTipTapContent } from '@shared/utils/helpers';
import { unescapeStringHtml } from '@shared/utils/inputs';
import { $t, $kaanna, $kaannaPlaceholder } from '@shared/utils/globals';
import EpEditorMenuBarVue3 from './EpEditorMenuBarVue3.vue';
import { ObserveVisibility } from 'vue-observe-visibility';
import { inject } from 'vue';

// Import TipTap extensions
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
// import Table from '@tiptap/extension-table';
// import TableRow from '@tiptap/extension-table-row';
// import TableCell from '@tiptap/extension-table-cell';
// import TableHeader from '@tiptap/extension-table-header';

// Import custom extensions
import { TermiExtensionVue3 } from './TermiExtensionVue3';
import { ImageExtensionVue3 } from './ImageExtensionVue3';
import { CustomLinkVue3 } from './CustomLinkVue3';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';


// Create span element for stripping tags
const striptag = document.createElement('span');

// Define props
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  isEditable: {
    type: Boolean,
    default: false,
  },
  locale: {
    type: String,
    required: false,
  },
  layout: {
    type: String as () => EditorLayout,
    required: true,
  },
  isPlainString: {
    type: Boolean,
    default: false,
  },
  toolbarHelp: {
    type: String,
    default: '',
  },
  help: {
    type: String,
    default: '',
  },
  sticky: {
    type: Boolean,
    default: true,
  },
  kasiteHandler: {
    type: Object as () => IKasiteHandler,
    required: false,
  },
  kuvaHandler: {
    type: Object as () => IKuvaHandler,
    required: false,
  },
  validMessage: {
    type: String,
    default: '',
  },
  invalidMessage: {
    type: String,
    default: '',
  },
});

// Get validation from useVuelidate
const v$ = useVuelidate();
const validation = computed(() => v$.value);

// Define emits
const emit = defineEmits(['update:modelValue']);

// Get instance for accessing template refs
const instance = getCurrentInstance();
const content = useTemplateRef('content');

// State
const focused = ref(false);
const isVisible = ref(true);

// Inject dependencies
const linkkiHandler = inject<ILinkkiHandler>('linkkiHandler');
const injectedKuvaHandler = inject<IKuvaHandler>('kuvaHandler');
const injectedKasiteHandler = inject<IKasiteHandler>('kasiteHandler');

// Computed properties
const annettuKuvaHandler = computed(() => {
  return props.kuvaHandler || injectedKuvaHandler;
});

const annettuKasiteHandler = computed(() => {
  return props.kasiteHandler || injectedKasiteHandler;
});

const lang = computed(() => {
  return props.locale || Kielet.getSisaltoKieli.value || 'fi';
});

const localizedValue = computed(() => {
  if (!props.modelValue) {
    return null;
  }
  else if (props.isPlainString) {
    return props.modelValue || '';
  }
  else if (_.isObject(props.modelValue)) {
    return placeholder.value || (props.modelValue as any)[lang.value] || '';
  }
  else {
    return props.modelValue;
  }
});

const placeholder = computed(() => {
  if (!focused.value) {
    return $kaannaPlaceholder?.(props.modelValue, !props.isEditable);
  }
  return undefined;
});

const validationError = computed(() => {
  if (validation.value?.$error) {
    return Object.keys(validation.value?.$errors[0].$validator ?? {})[0] || null;
  }
  return null;
});

const isSticky = computed(() => {
  return props.sticky && isVisible.value;
});

// Set up the editor
const editor = useEditor({
  content: fixTipTapContent(localizedValue.value),
  editable: props.isEditable,
  extensions: [StarterKit],
  // extensions: [
    // Text,
    // StarterKit.configure({
      // Disable the built-in link extension since we're using our custom one
      // link: false,
    // }),
    // Underline,
    // Table.configure({
    //   resizable: true,
    // }),
    // TableHeader,
    // TableCell,
    // TableRow,
    // Add custom extensions conditionally
    // CustomLinkVue3(linkkiHandler),
    // ...(annettuKasiteHandler.value ? [TermiExtensionVue3(annettuKasiteHandler.value)] : []),
    // ...(annettuKuvaHandler.value ? [ImageExtensionVue3(annettuKuvaHandler.value)] : []),
  // ],
  onUpdate: ({ editor }) => {
    const data = editor.getHTML();
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
          [Kielet.getSisaltoKieli.value]: stripped,
        });
      }
    }
  },
  onFocus: () => {
    if (props.isEditable) {
      focused.value = true;
      if (!localizedValue.value && editor.value) {
        editor.value.commands.setContent(fixTipTapContent(localizedValue.value));
      }
    }
  },
  onBlur: () => {
    focused.value = false;
  },
});

// Methods
function visibilityChanged(isVisible) {
  isVisible.value = isVisible;
}

async function setClass(c: string) {
  // await delay();
  // HACK: give prose mirror 10 vue ticks.
  // for (let count = 0; count < 10; ++count) {
  if (content.value) {
    const el = content.value.$el || content.value;
    const pm = el?.firstChild;
    if (pm) {
      el.firstChild.className = 'ProseMirror ' + c;
      // break;
    }
  }
  // await nextTick();
  // }
}

// Watch for changes in isEditable
watch(() => props.isEditable, (val, oldVal) => {
  if (val === oldVal) {
    return;
  }

  nextTick(() => {
    if (!editor.value) {
      return;
    }

    editor.value.setEditable(val);

    if (val) {
      setClass('form-control');
    }
    else {
      setClass('');
    }
  });
}, { immediate: true });

// Watch for changes in localizedValue
watch(localizedValue, (val) => {
  if (editor.value && !focused.value) {
    editor.value.commands.setContent(localizedValue.value);
  }
}, { immediate: true });

// Watch for changes in lang
watch(lang, () => {
  if (editor.value) {
    editor.value.commands.setContent(localizedValue.value);
  }
});

// Lifecycle hooks
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
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

  :deep(abbr) {
    text-decoration: none !important;
    border-bottom: 1px dotted #999;
    cursor: help;
  }

  :deep(.form-control) {
    height: auto !important;
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

  :deep(abbr.virheellinen) {
    color: $invalid;
  }

  :deep(.form-control.ProseMirror) {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }

  :deep([contenteditable]:focus) {
    outline: none !important;
    box-shadow: none !important;
  }

  :deep(.tableWrapper .selectedCell) {
    background-color: $gray-lighten-5;
  }

  .content-invalid :deep(.form-control) {
    border-color: $invalid;
  }

  .content-valid :deep(.form-control) {
    border-color: $valid;
  }

  // Alleviivataan editorissa oleva virheellinen linkki, jolla ei ole hreffiä.
  :deep(a:not([href]):not([class])) {
    text-decoration: underline;
    text-decoration-style: dotted;
    text-decoration-color: red;
  }
}

// Piilotettu Bootstrapissa oletuksena
:deep(.invalid-feedback),
:deep(.valid-feedback) {
  display: block;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-empty-text);
  // float: left;
  color: #adb5bd;
  pointer-events: none;
  // height: 0;

  br {
    display: none;
  }
}
</style>
