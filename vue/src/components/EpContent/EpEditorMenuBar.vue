<template>
  <div
    v-if="isEditable && editor"
    class="ep-editor-menu-bar"
  >
    <div class="menu-buttons">
      <!-- History buttons -->
      <button
        v-if="layoutCommands.includes('undo')"
        type="button"
        class="menu-button"
        :disabled="!editor.can().undo()"
        :title="$t('kumoa')"
        :aria-label="$t('kumoa')"
        @click="editor.chain().focus().undo().run()"
      >
        <EpMaterialIcon>undo</EpMaterialIcon>
      </button>

      <button
        v-if="layoutCommands.includes('redo')"
        type="button"
        class="menu-button"
        :disabled="!editor.can().redo()"
        :title="$t('tee-uudelleen')"
        :aria-label="$t('tee-uudelleen')"
        @click="editor.chain().focus().redo().run()"
      >
        <EpMaterialIcon>redo</EpMaterialIcon>
      </button>

      <button
        v-if="layoutCommands.includes('copy')"
        type="button"
        class="menu-button"
        :title="$t('kopioi-sisalto-leikepöydälle')"
        :aria-label="$t('kopioi-sisalto-leikepöydälle')"
        @click="copyToClipboardHandler"
      >
        <EpMaterialIcon>content_copy</EpMaterialIcon>
      </button>

      <button
        v-if="layoutCommands.includes('paste')"
        type="button"
        class="menu-button"
        :title="$t('liita')"
        :aria-label="$t('liita')"
        @click="pasteFromClipboardHandler"
      >
        <EpMaterialIcon>content_paste</EpMaterialIcon>
      </button>

      <div
        v-if="layoutCommands.includes('bold')"
        class="menu-divider"
      />

      <!-- Text formatting buttons -->
      <button
        v-if="layoutCommands.includes('bold')"
        type="button"
        class="menu-button"
        :class="{ 'is-active': editor.isActive('bold') }"
        :title="$t('lihavointi')"
        :aria-label="$t('lihavointi')"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <EpMaterialIcon>format_bold</EpMaterialIcon>
      </button>

      <button
        v-if="layoutCommands.includes('italic')"
        type="button"
        class="menu-button"
        :class="{ 'is-active': editor.isActive('italic') }"
        :title="$t('kursivointi')"
        :aria-label="$t('kursivointi')"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <EpMaterialIcon>format_italic</EpMaterialIcon>
      </button>

      <button
        v-if="layoutCommands.includes('strike')"
        type="button"
        class="menu-button"
        :class="{ 'is-active': editor.isActive('strike') }"
        :title="$t('yliviivaus')"
        :aria-label="$t('yliviivaus')"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <EpMaterialIcon>strikethrough_s</EpMaterialIcon>
      </button>

      <!-- Link button -->
      <button
        v-if="layoutCommands.includes('link')"
        type="button"
        class="menu-button"
        :class="{ 'is-active': editor.isActive('link') }"
        :disabled="!canToggleLink"
        :title="$t('linkki')"
        :aria-label="$t('linkki')"
        @click="toggleLink"
      >
        <EpMaterialIcon>add_link</EpMaterialIcon>
      </button>

      <!-- Term button - disabled when handler cannot add/update termis -->
      <button
        v-if="layoutCommands.includes('term')"
        type="button"
        class="menu-button"
        :class="{ 'is-active': editor.isActive('termiExtension3') }"
        :disabled="!canToggleTerm || !injectedKasiteHandler?.addOrUpdate"
        :title="$t('käsite')"
        :aria-label="$t('käsite')"
        @click="toggleTerm"
      >
        <EpMaterialIcon>book</EpMaterialIcon>
      </button>

      <div
        v-if="layoutCommands.includes('bullet_list')"
        class="menu-divider"
      />

      <!-- List buttons -->
      <button
        v-if="layoutCommands.includes('bullet_list')"
        type="button"
        class="menu-button"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        :title="$t('luettelomerkit')"
        :aria-label="$t('luettelomerkit')"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <EpMaterialIcon>list</EpMaterialIcon>
      </button>

      <button
        v-if="layoutCommands.includes('ordered_list')"
        type="button"
        class="menu-button"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        :title="$t('numeroitu-luettelo')"
        :aria-label="$t('numeroitu-luettelo')"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <EpMaterialIcon>format_list_numbered_rtl</EpMaterialIcon>
      </button>

      <div
        v-if="layoutCommands.includes('image') || layoutCommands.includes('table')"
        class="menu-divider"
      />

      <!-- Image button -->
      <button
        v-if="layoutCommands.includes('image')"
        type="button"
        class="menu-button"
        :disabled="!canInsertImage"
        :title="$t('lisaa-kuva')"
        :aria-label="$t('lisaa-kuva')"
        @click="insertImage"
      >
        <EpMaterialIcon>add_photo_alternate</EpMaterialIcon>
      </button>

      <!-- Table button -->
      <button
        v-if="layoutCommands.includes('table')"
        type="button"
        class="menu-button"
        :disabled="!canInsertTable"
        :title="$t('lisaa-taulukko')"
        :aria-label="$t('lisaa-taulukko')"
        @click="insertTable"
      >
        <EpMaterialIcon>grid_on</EpMaterialIcon>
      </button>

      <div
        v-if="isInTable && layoutCommands.includes('table')"
        class="table-toolbar"
      >
        <div class="table-buttons">
          <!-- Column operations -->
          <div class="button-group">
            <button
              type="button"
              class="table-button add-button"
              :title="$t('lisaa-sarake-ennen')"
              :aria-label="$t('lisaa-sarake-ennen')"
              @click="addColumnBefore"
            >
              <EpMaterialIcon>add</EpMaterialIcon>
              <EpMaterialIcon>view_column</EpMaterialIcon>
            </button>

            <button
              type="button"
              class="table-button add-button"
              :title="$t('lisaa-sarake-jälkeen')"
              :aria-label="$t('lisaa-sarake-jälkeen')"
              @click="addColumnAfter"
            >
              <EpMaterialIcon>view_column</EpMaterialIcon>
              <EpMaterialIcon>add</EpMaterialIcon>
            </button>

            <button
              type="button"
              class="table-button remove-button"
              :title="$t('poista-sarake')"
              :aria-label="$t('poista-sarake')"
              @click="deleteColumn"
            >
              <EpMaterialIcon>delete</EpMaterialIcon>
              <EpMaterialIcon>view_column</EpMaterialIcon>
            </button>
          </div>

          <div class="button-divider" />

          <!-- Row operations -->
          <div class="button-group">
            <button
              type="button"
              class="table-button add-button"
              :title="$t('lisaa-rivi-ennen')"
              :aria-label="$t('lisaa-rivi-ennen')"
              @click="addRowBefore"
            >
              <EpMaterialIcon>add</EpMaterialIcon>
              <EpMaterialIcon>table_rows</EpMaterialIcon>
            </button>

            <button
              type="button"
              class="table-button add-button"
              :title="$t('lisaa-rivi-jälkeen')"
              :aria-label="$t('lisaa-rivi-jälkeen')"
              @click="addRowAfter"
            >
              <EpMaterialIcon>table_rows</EpMaterialIcon>
              <EpMaterialIcon>add</EpMaterialIcon>
            </button>

            <button
              type="button"
              class="table-button remove-button"
              :title="$t('poista-rivi')"
              :aria-label="$t('poista-rivi')"
              @click="deleteRow"
            >
              <EpMaterialIcon>delete</EpMaterialIcon>
              <EpMaterialIcon>table_rows</EpMaterialIcon>
            </button>
          </div>

          <div class="button-divider" />

          <!-- Table operations -->
          <div class="button-group">
            <button
              type="button"
              class="table-button remove-button"
              :title="$t('poista-taulukko')"
              :aria-label="$t('poista-taulukko')"
              @click="deleteTable"
            >
              <EpMaterialIcon>delete</EpMaterialIcon>
              <EpMaterialIcon>grid_on</EpMaterialIcon>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isInvalidHtml"
      class="flex items-center"
    >
      <EpInfoPopover
        class="invalid-html-info-popover mr-2"
      >
        {{ $t('tekstin-sisalto-virheellinen-html') }}
      </EpInfoPopover>
      <ep-button
        variant="link"
        class="p-0"
        no-padding
        @click="emit('fixInvalidHtml')"
      >
        {{ $t('korjaa-sisalto') }}
      </ep-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { Editor } from '@tiptap/core';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpInfoPopover from '@shared/components/EpInfoPopover/EpInfoPopover.vue';
import { copyToClipboard } from './copyToClipboard';
import { pasteFromClipboard } from './pasteFromClipboard';
import { EditorLayout } from '@shared/tyypit';
import { IKasiteHandler } from './KasiteHandler';

const injectedKasiteHandler = inject<IKasiteHandler | undefined>('kasiteHandler');

const emit = defineEmits(['fixInvalidHtml']);

const props = defineProps({
  editor: {
    type: Object as () => Editor,
    required: true,
  },
  isEditable: {
    type: Boolean,
    default: true,
  },
  isInvalidHtml: {
    type: Boolean,
    default: false,
  },
  layout: {
    type: String as () => EditorLayout,
    required: true,
  },
});

// Check if image extension is available (openImageModal inserts node and opens modal)
const canInsertImage = computed(() => {
  return props.editor && props.editor.commands && props.editor.commands.openImageModal;
});

// Check if link extension is available and can be toggled
const canToggleLink = computed(() => {
  return props.editor && props.editor.commands && props.editor.commands.openLinkModal
         && props.editor.state.selection.from !== props.editor.state.selection.to;
});

// Check if term extension is available and can be toggled
const canToggleTerm = computed(() => {
  return props.editor && props.editor.commands && props.editor.commands.openTermModal
         && props.editor.state.selection.from !== props.editor.state.selection.to;
});

// Check if table extension is available
const canInsertTable = computed(() => {
  return props.editor && props.editor.can && props.editor.can().insertTable;
});

// Check if cursor is currently in a table
const isInTable = computed(() => {
  return props.editor && props.editor.isActive && props.editor.isActive('table');
});

const copyToClipboardHandler = async () => {
  if (props.editor) {
    await copyToClipboard(props.editor);
  }
};

const pasteFromClipboardHandler = async () => {
  if (props.editor) {
    await pasteFromClipboard(props.editor);
  }
};

// Link manipulation methods
const toggleLink = () => {
  if (props.editor && canToggleLink.value) {
    props.editor.commands.openLinkModal();
  }
};

// Term manipulation methods
const toggleTerm = () => {
  if (props.editor && canToggleTerm.value) {
    // Call the openTermModal command which will emit an event
    props.editor.commands.openTermModal();
  }
};

// Image manipulation methods
const insertImage = () => {
  if (props.editor && canInsertImage.value) {
    props.editor.chain()
      .focus()
      .openImageModal()
      .run();
  }
};

// Table manipulation methods
const insertTable = () => {
  if (props.editor && canInsertTable.value) {
    props.editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }
};

const addColumnBefore = () => {
  if (props.editor && props.editor.can().addColumnBefore()) {
    props.editor
      .chain()
      .focus()
      .addColumnBefore()
      .run();
  }
};

const addColumnAfter = () => {
  if (props.editor && props.editor.can().addColumnAfter()) {
    props.editor
      .chain()
      .focus()
      .addColumnAfter()
      .run();
  }
};

const deleteColumn = () => {
  if (props.editor && props.editor.can().deleteColumn()) {
    props.editor
      .chain()
      .focus()
      .deleteColumn()
      .run();
  }
};

const addRowBefore = () => {
  if (props.editor && props.editor.can().addRowBefore()) {
    props.editor
      .chain()
      .focus()
      .addRowBefore()
      .run();
  }
};

const addRowAfter = () => {
  if (props.editor && props.editor.can().addRowAfter()) {
    props.editor
      .chain()
      .focus()
      .addRowAfter()
      .run();
  }
};

const deleteRow = () => {
  if (props.editor && props.editor.can().deleteRow()) {
    props.editor
      .chain()
      .focus()
      .deleteRow()
      .run();
  }
};

const deleteTable = () => {
  if (props.editor && props.editor.can().deleteTable()) {
    props.editor
      .chain()
      .focus()
      .deleteTable()
      .run();
  }
};

const layoutCommands = computed(() => {
  let commands = [
    'undo', 'redo', 'copy', 'paste',
  ];

  if (props.layout === 'simplified'
    || props.layout === 'simplified_w_links'
    || props.layout === 'normal') {
    commands.push('bold', 'italic', 'strike', 'bullet_list', 'ordered_list');
  }

  if (props.layout === 'simplified_w_links' || props.layout === 'normal') {
    commands.push('link');
  }

  if (props.layout === 'normal') {
    commands.push('term','image', 'table');
  }

  return commands;
});
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

.ep-editor-menu-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #e0e0e0;
  border-bottom: none;
  background-color: #f8f9fa;
  padding: 8px;
  border-radius: 4px 4px 0 0;

  .menu-buttons {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    min-width: 0;
  }

  .menu-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid transparent;
    background-color: transparent;
    border-radius: 4px;
    cursor: pointer;
    color: #374151;
    transition: all 0.2s ease;

    &:hover {
      background-color: #e5e7eb;
      border-color: #d1d5db;
    }

    &:active {
      background-color: #d1d5db;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;

      &:hover {
        background-color: transparent;
        border-color: transparent;
      }
    }

    &.is-active {
      background-color: #3b82f6;
      color: white;

      &:hover {
        background-color: #2563eb;
      }
    }

    i {
      font-size: 14px;
    }
  }

  .menu-divider {
    width: 1px;
    height: 24px;
    background-color: #d1d5db;
    margin: 0 4px;
  }

  .invalid-html-info-popover :deep(span) {
    color: $invalid !important;
  }

  .invalid-html-fix-button {
    color: $invalid;
    white-space: nowrap;
  }
}

.table-toolbar {

  .table-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .button-group {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .table-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 32px;
    border: 1px solid transparent;
    background-color: transparent;
    border-radius: 4px;
    cursor: pointer;
    color: #374151;
    transition: all 0.2s ease;
    padding: 4px 8px;

    &:hover {
      background-color: #e5e7eb;
      border-color: #d1d5db;
    }

    &:active {
      background-color: #d1d5db;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;

      &:hover {
        background-color: transparent;
        border-color: transparent;
      }
    }

    // Style for add buttons (green theme)


    // Icon alignment for multiple icons
    .material-icons {
      font-size: 16px;

      &:not(:last-child) {
        margin-right: 2px;
      }
    }
  }

  .button-divider {
    width: 1px;
    height: 24px;
    background-color: #d1d5db;
    margin: 0 4px;
  }
}
</style>
