<template>
  <div class="ep-content">
    <ep-editor-menu-bar
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
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, useAttrs, inject, getCurrentInstance, useTemplateRef } from 'vue';
import { Editor, EditorContent } from 'tiptap';
import { delay } from '@shared/utils/delay';
import { Kielet } from '@shared/stores/kieli';
import {
  Blockquote,
  Bold,
  Underline,
  Strike,
  Italic,
  HardBreak,
  History,
  BulletList,
  Link,
  ListItem,
  OrderedList,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Placeholder,
} from 'tiptap-extensions';

import EpEditorMenuBar from './EpEditorMenuBar.vue';
import Sticky from 'vue-sticky-directive';
import { EditorLayout } from '@shared/tyypit';
import { useVuelidate } from '@vuelidate/core';
import { IKasiteHandler } from './KasiteHandler';
import TermiExtension from './TermiExtension';
import ImageExtension from './ImageExtension';
import { IKuvaHandler } from './KuvaHandler';
import CustomLink from './CustomLink';
import { ObserveVisibility } from 'vue-observe-visibility';
import { ILinkkiHandler } from './LinkkiHandler';
import { fixTipTapContent } from '@shared/utils/helpers';
import { unescapeStringHtml } from '@shared/utils/inputs';

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

// Get instance for $t and other global properties
const instance = getCurrentInstance();
const $t = instance?.appContext.config.globalProperties.$t;
const $kaanna = instance?.appContext.config.globalProperties.$kaanna;
const $kaannaPlaceholder = instance?.appContext.config.globalProperties.$kaannaPlaceholder;

// Template refs
const content = useTemplateRef('content');

// State
const editor = ref(null);
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

// Watch for changes in isEditable
watch(() => props.isEditable, (val, oldVal) => {
  if (val === oldVal) {
    return;
  }

  nextTick(() => {
    if (!editor.value) {
      return;
    }

    editor.value.setOptions({
      editable: val,
    });

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
    editor.value.setContent(localizedValue.value);
  }
}, { immediate: true });

// Watch for changes in lang
watch(lang, () => {
  if (editor.value) {
    editor.value.setContent(localizedValue.value);
  }
});

// Methods
function visibilityChanged(isVisible) {
  isVisible.value = isVisible;
}

async function setClass(c: string) {
  await delay();
  // HACK: give prose mirror 10 vue ticks.
  for (let count = 0; count < 10; ++count) {
    if (content.value) {
      const pm = content.value.$el?.firstChild;
      if (pm) {
        content.value.$el.firstChild.className = 'ProseMirror ' + c;
        break;
      }
    }
    await nextTick();
  }
}

function setUpEditorEvents() {
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

// Lifecycle hooks
onMounted(() => {
  let linkImplementation: any = null;
  try {
    linkImplementation = new CustomLink(linkkiHandler);
  }
  catch (err) {
    linkImplementation = new Link();
  }

  const extensions = [
    new HardBreak(),
    new History(),
    new Blockquote(),
    new Bold(),
    new Italic(),
    new Strike(),
    linkImplementation,
    new BulletList(),
    new OrderedList(),
    new ListItem(),
    new Table({ resizable: true }),
    new TableHeader(),
    new TableCell(),
    new TableRow(),
  ];

  if (annettuKasiteHandler.value) {
    extensions.push(new TermiExtension(annettuKasiteHandler.value));
  }

  if (annettuKuvaHandler.value) {
    extensions.push(new ImageExtension(annettuKuvaHandler.value));
  }

  editor.value = new Editor({
    content: fixTipTapContent(localizedValue.value),
    editable: props.isEditable,
    onUpdate: () => {
      setUpEditorEvents();
    },
    onFocus: () => {
      if (props.isEditable) {
        focused.value = true;
        if (!localizedValue.value) {
          editor.value.setContent(fixTipTapContent(localizedValue.value));
        }
      }
    },
    onBlur: () => {
      focused.value = false;
    },
    extensions,
  });
});

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

  ::v-deep abbr {
    text-decoration: none !important;
    border-bottom: 1px dotted #999;
    cursor: help;
  }

  ::v-deep .form-control {
    height: auto !important;
  }

  ::v-deep table {
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

  ::v-deep abbr.virheellinen {
    color: $invalid;
  }

  ::v-deep .form-control.ProseMirror {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }

  ::v-deep [contenteditable]:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  ::v-deep .tableWrapper .selectedCell {
    background-color: $gray-lighten-5;
  }

  .content-invalid ::v-deep .form-control {
    border-color: $invalid;
  }

  .content-valid ::v-deep .form-control {
    border-color: $valid;
  }

  // Alleviivataan editorissa oleva virheellinen linkki, jolla ei ole hreffiä.
  ::v-deep a:not([href]):not([class]) {
    text-decoration: underline;
    text-decoration-style: dotted;
    text-decoration-color: red;
  }
}

// Piilotettu Bootstrapissa oletuksena
::v-deep .invalid-feedback,
::v-deep .valid-feedback {
  display: block;
}

::v-deep .ProseMirror p.is-editor-empty:first-child::before {
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
