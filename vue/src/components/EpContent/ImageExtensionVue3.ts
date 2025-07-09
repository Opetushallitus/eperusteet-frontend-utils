import { Node, nodeInputRule } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { IKuvaHandler } from './KuvaHandler';
import { Kielet } from '@shared/stores/kieli';
import { $t } from '@shared/utils/globals';
import _ from 'lodash';

export interface ImageOptions {
  inline: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (options: { 'data-uid': string, alt?: string, figcaption?: string }) => ReturnType;
    };
  }
}

export const ImageExtensionVue3 = (handler: IKuvaHandler) => {
  return Node.create<ImageOptions>({
    name: 'image',

    addOptions() {
      return {
        inline: false,
        HTMLAttributes: {},
      };
    },

    inline() {
      return this.options.inline;
    },

    group() {
      return this.options.inline ? 'inline' : 'block';
    },

    draggable: true,

    addAttributes() {
      return {
        'data-uid': {
          default: '',
        },
        'alt': {
          default: '',
        },
        'figcaption': {
          default: '',
        },
        'src': {
          default: null,
          renderHTML: attributes => {
            // Generate the source URL from the data-uid
            if (attributes['data-uid']) {
              return {
                src: handler.url(attributes['data-uid']),
              };
            }
            return {};
          },
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: 'img[data-uid]',
        },
      ];
    },

    renderHTML({ HTMLAttributes }) {
      // Create the figure element with image and optional caption
      const figure = document.createElement('figure');
      figure.className = 'text-center';

      const img = document.createElement('img');
      img.className = 'content-image';
      img.setAttribute('data-uid', HTMLAttributes['data-uid'] || '');

      if (HTMLAttributes['data-uid']) {
        img.src = handler.url(HTMLAttributes['data-uid']);
      }

      if (HTMLAttributes.alt) {
        img.alt = HTMLAttributes.alt;
      } else {
        img.alt = $t('kuvituskuva');
      }

      figure.appendChild(img);

      // Add figcaption if provided
      if (HTMLAttributes.figcaption) {
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = HTMLAttributes.figcaption;
        figure.appendChild(figcaption);
      }

      return { dom: figure };
    },

    addCommands() {
      return {
        setImage:
          attributes => ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: attributes,
            });
          },
      };
    },

    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey('imageHandler'),
          props: {
            handleClick(view, pos, event) {
              // Handle click on image elements
              const dom = event.target as HTMLElement;

              if (dom.nodeName === 'IMG' && dom.hasAttribute('data-uid')) {
                const dataUid = dom.getAttribute('data-uid');

                if (view.editable && dataUid) {
                  // Here you would open your image selector/editor
                  // This would need to be implemented differently in Vue 3
                  // as we can't directly use Vue 2's modal system

                  // For now, we just log the action
                  console.log('Image clicked:', dataUid);

                  // Return true to indicate we've handled the click
                  return true;
                }
              }

              return false;
            },
          },
        }),
      ];
    },
  });
};
