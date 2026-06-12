import { $fail, $info, $t } from '@shared/utils/globals';
import { Extension } from '@tiptap/core';
import type { Editor } from '@tiptap/core';
import { DOMSerializer } from '@tiptap/pm/model';
import { TextSelection } from '@tiptap/pm/state';

export interface ExtractedContent {
  textContent: string;
  htmlContent?: string;
}

function getCopyRange(editor: Editor): { from: number; to: number } {
  const { state } = editor;
  const { selection } = state;

  // Copy partial content only when the user has explicitly selected text.
  // NodeSelection (e.g. image) or an empty cursor should copy the full document.
  if (selection instanceof TextSelection && !selection.empty) {
    return { from: selection.from, to: selection.to };
  }

  return { from: 0, to: state.doc.content.size };
}

export function extractContent(editor: Editor, copyWithFormatting = true): ExtractedContent {
  const { from, to } = getCopyRange(editor);
  const textContent = editor.state.doc.textBetween(from, to, '\n\n');

  if (!copyWithFormatting) {
    return { textContent };
  }

  const slice = editor.state.doc.slice(from, to);
  const serializer = DOMSerializer.fromSchema(editor.state.schema);
  const fragment = serializer.serializeFragment(slice.content);
  const container = document.createElement('div');
  container.appendChild(fragment);

  return {
    textContent,
    htmlContent: container.innerHTML,
  };
}

export function canCopyToClipboard(editor: Editor | null | undefined): boolean {
  return !!editor?.isEditable;
}

export async function writeToClipboard(textContent: string, htmlContent?: string): Promise<boolean> {
  try {
    if (htmlContent && typeof ClipboardItem !== 'undefined') {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([htmlContent], { type: 'text/html' }),
          'text/plain': new Blob([textContent], { type: 'text/plain' }),
        }),
      ]);
    }
    else {
      await navigator.clipboard.writeText(textContent);
    }
  }
  catch {
    $fail($t('sisalto-kopioitu-leikepöydälle-epaonnistui'));
    return false;
  }

  $info($t('sisalto-kopioitu-leikepöydälle'));
  return true;
}

export async function copyToClipboard(editor: Editor, copyWithFormatting = true): Promise<boolean> {
  const { textContent, htmlContent } = extractContent(editor, copyWithFormatting);

  if (!textContent && !htmlContent) {
    return false;
  }

  return writeToClipboard(textContent, copyWithFormatting ? htmlContent : undefined);
}

export const CopyToClipboardExtension = Extension.create({
  name: 'copyToClipboard',

  addKeyboardShortcuts() {
    return {
      'Mod-c': ({ editor }) => {
        if (!canCopyToClipboard(editor)) {
          return false;
        }

        void copyToClipboard(editor, true);
        return true;
      },
    };
  },
});
