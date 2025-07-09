import { Mark, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { ILinkkiHandler } from './LinkkiHandler';

export interface LinkOptions {
  HTMLAttributes: Record<string, any>;
  openOnClick: boolean;
  linkOnPaste: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customLink: {
      /**
       * Set a link mark
       */
      setLink: (attributes: { href: string; target?: string }) => ReturnType;
      /**
       * Toggle a link mark
       */
      toggleLink: (attributes: { href: string; target?: string }) => ReturnType;
      /**
       * Unset a link mark
       */
      unsetLink: () => ReturnType;
    };
  }
}

export const CustomLinkVue3 = (handler?: ILinkkiHandler) => {
  return Mark.create<LinkOptions>({
    name: 'link',

    priority: 1000,

    inclusive: false,

    addOptions() {
      return {
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer nofollow',
        },
        openOnClick: true,
        linkOnPaste: true,
      };
    },

    addAttributes() {
      return {
        href: {
          default: null,
        },
        target: {
          default: this.options.HTMLAttributes.target,
        },
        rel: {
          default: this.options.HTMLAttributes.rel,
        },
      };
    },

    parseHTML() {
      return [
        { tag: 'a[href]:not([href *= "javascript:" i])' },
      ];
    },

    renderHTML({ HTMLAttributes }) {
      return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },

    addCommands() {
      return {
        setLink: attributes => ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
        toggleLink: attributes => ({ commands }) => {
          return commands.toggleMark(this.name, attributes, { extendEmptyMarkRange: true });
        },
        unsetLink: () => ({ commands }) => {
          return commands.unsetMark(this.name, { extendEmptyMarkRange: true });
        },
      };
    },

    addProseMirrorPlugins() {
      if (!this.options.openOnClick) {
        return [];
      }

      return [
        new Plugin({
          key: new PluginKey('handleClickLink'),
          props: {
            handleClick: (view, pos, event) => {
              // Handle clicks on links
              const dom = event.target as HTMLElement;
              const linkElement = dom.closest('a');

              if (linkElement && view.editable) {
                // If we're in edit mode, we might want to edit the link rather than follow it
                // For now, we just prevent the default behavior
                event.preventDefault();
                return true;
              }

              return false;
            },
          },
        }),
      ];
    },
  });
};
