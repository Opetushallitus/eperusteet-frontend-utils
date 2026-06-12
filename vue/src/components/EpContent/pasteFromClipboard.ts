import type { Editor } from '@tiptap/core';

export interface ClipboardContent {
  textContent: string;
  htmlContent?: string;
}

export function cleanPastedHTML(html: string): string {
  let cleaned = html.replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '');
  cleaned = cleaned.replace(/(&nbsp;|\u00A0)+/g, ' ');
  cleaned = cleaned.replace(/\s+(class|style|lang|xml:lang)="[^"]*"/g, '');
  return cleaned;
}

export function canPasteFromClipboard(editor: Editor | null | undefined): boolean {
  return !!editor?.isEditable;
}

export async function readFromClipboard(): Promise<ClipboardContent | null> {
  try {
    if (navigator.clipboard.read) {
      const items = await navigator.clipboard.read();
      let textContent = '';
      let htmlContent: string | undefined;

      for (const item of items) {
        if (!htmlContent && item.types.includes('text/html')) {
          htmlContent = await (await item.getType('text/html')).text();
        }
        if (!textContent && item.types.includes('text/plain')) {
          textContent = await (await item.getType('text/plain')).text();
        }
      }

      if (htmlContent || textContent) {
        return { textContent, htmlContent };
      }
    }
  }
  catch {
    // Fall back to readText below.
  }

  try {
    const textContent = await navigator.clipboard.readText();
    if (textContent) {
      return { textContent };
    }
  }
  catch {
    return null;
  }

  return null;
}

export async function pasteFromClipboard(editor: Editor): Promise<boolean> {
  const clipboardContent = await readFromClipboard();
  if (!clipboardContent) {
    return false;
  }

  const { textContent, htmlContent } = clipboardContent;

  if (htmlContent) {
    return editor.chain().focus()
      .insertContent(cleanPastedHTML(htmlContent))
      .run();
  }

  if (textContent) {
    return editor.chain().focus()
      .insertContent(textContent)
      .run();
  }

  return false;
}
