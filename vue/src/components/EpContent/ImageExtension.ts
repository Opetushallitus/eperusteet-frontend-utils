import { Node, mergeAttributes } from '@tiptap/core';
import { IKuvaHandler } from './KuvaHandler';
import { createApp, getCurrentInstance, reactive } from 'vue';
import ImageModal from './ImageModal.vue';
import { useGlobalProperties } from '@shared/utils/globals';
import { ref } from 'vue';

export interface ImageExtension3Options {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageExtension3: {
      /**
       * Insert an image
       */
      insertImage: (options: { 'data-uid'?: string; alt?: string; figcaption?: string }) => ReturnType;
    };
  }
}

// Helper function to open image modal
function openImageModal(node: any, getPos: any, editor: any, handler: IKuvaHandler) {
  // Prevent opening modal if editor is not editable
  if (!editor.isEditable) {
    return;
  }

  const currentUid = (node as any).attrs['data-uid'];
  const currentAlt = (node as any).attrs.alt || '';
  const currentFigcaption = (node as any).attrs.figcaption || '';

  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    border-radius: 8px;
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
    padding: 2rem;
  `;

  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);

  // State for the modal
  let modalApp: any;
  const savedUid = ref(currentUid);
  let savedAlt = currentAlt;
  let savedFigcaption = currentFigcaption;
  let isClosed = false;

  // Close modal function
  const closeModal = () => {
    if (isClosed) return;
    isClosed = true;

    // Use setTimeout to delay cleanup slightly for Vue 3 compat mode
    setTimeout(() => {
      try {
        if (modalApp) {
          modalApp.unmount();
          modalApp = null;
        }
      }
      catch (error) {
        console.warn('Error unmounting modal app:', error);
      }

      try {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }
      catch (error) {
        console.warn('Error removing overlay:', error);
      }
    }, 10);
  };

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  try {
    // Create Vue app with the ImageModal component
    modalApp = createApp(ImageModal, {
      modelValue: savedUid,
      loader: handler,
      kuvatekstiProp: currentFigcaption,
      vaihtoehtotekstiProp: currentAlt,
      'onUpdate:modelValue': (value: any) => {
        savedUid.value = value || '';
      },
      onOnKuvatekstiChange: (value: string) => {
        savedFigcaption = value || '';
      },
      onOnVaihtoehtoinentekstiChange: (value: string) => {
        savedAlt = value || '';
      },
      onOnClose: (save: boolean) => {
        if (save) {
          const pos = getPos();

          // Update node attributes
          const tr = editor.state.tr;
          const newAttrs = {
            ...(node as any).attrs,
            'data-uid': savedUid.value,
            alt: savedAlt,
            figcaption: savedFigcaption,
          };
          tr.setNodeMarkup(pos, undefined, newAttrs);
          editor.view.dispatch(tr);

          // Manually trigger the onUpdate callback to update modelValue
          setTimeout(() => {
            // Manually call the onUpdate handler with the editor
            if (editor.options?.onUpdate) {
              editor.options.onUpdate({ editor });
            }

            const currentContent = editor.getHTML();
          }, 10);

          // If no image was selected and this is a new node, remove it
          if (!savedUid.value && !currentUid) {
            const tr2 = editor.state.tr;
            tr2.delete(pos, pos + (node as any).nodeSize);
            editor.view.dispatch(tr2);
          }
        }
        else {
          // If cancelled and this is a new node without data-uid, remove it
          if (!currentUid) {
            const pos = getPos();
            const tr = editor.state.tr;
            tr.delete(pos, pos + (node as any).nodeSize);
            editor.view.dispatch(tr);
          }
        }

        closeModal();
      },
    });

    const globalProps = useGlobalProperties();
    modalApp.config.globalProperties = { ...globalProps };

    modalApp.mount(modalContent);
  }
  catch (error) {
    console.error('Error mounting image modal:', error);
    closeModal();
  }
}

export default function createImageExtension3(handler: IKuvaHandler) {
  return Node.create<ImageExtension3Options>({
    name: 'imageExtension3',

    addOptions() {
      return {
        HTMLAttributes: {},
      };
    },

    group: 'block',

    draggable: true,

    addAttributes() {
      return {
        'data-uid': {
          default: '',
          parseHTML: element => element.getAttribute('data-uid'),
          renderHTML: attributes => {
            const value = attributes['data-uid'];
            if (value) {
              return { 'data-uid': value };
            }
            return {};
          },
        },
        alt: {
          default: '',
          parseHTML: element => element.getAttribute('alt'),
          renderHTML: attributes => {
            if (!attributes.alt) {
              return {};
            }
            return { alt: attributes.alt };
          },
        },
        figcaption: {
          default: '',
          parseHTML: element => element.getAttribute('figcaption'),
          renderHTML: attributes => {
            if (!attributes.figcaption) {
              return {};
            }
            return { figcaption: attributes.figcaption };
          },
        },
        src: {
          default: null,
          parseHTML: element => element.getAttribute('src'),
          renderHTML: attributes => {
            // Don't render src directly here - it will be calculated in the main renderHTML
            return {};
          },
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: 'img',
          getAttrs: (element) => {
            if (typeof element === 'string') {
              return false;
            }
            return {
              'data-uid': element.getAttribute('data-uid') || '',
              alt: element.getAttribute('alt') || '',
              figcaption: element.getAttribute('figcaption') || '',
              src: element.getAttribute('src') || '',
            };
          },
        },
      ];
    },

    renderHTML({ HTMLAttributes }) {

      // Include data-uid, alt, and figcaption in the serialized HTML
      const attrs: Record<string, any> = {};

      if (HTMLAttributes['data-uid']) {
        attrs['data-uid'] = HTMLAttributes['data-uid'];
      }

      if (HTMLAttributes['alt']) {
        attrs['alt'] = HTMLAttributes['alt'];
      }

      if (HTMLAttributes['figcaption']) {
        attrs['figcaption'] = HTMLAttributes['figcaption'];
      }

      return ['img', attrs];
    },

    addCommands() {
      return {
        insertImage: (options) => ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
        openImageModal: () => ({ editor, commands }) => {
          // Insert a new image node first
          const result = commands.insertContent({
            type: this.name,
            attrs: { 'data-uid': '', alt: '', figcaption: '' },
          });

          if (result) {
            // Get the position of the newly inserted node and open modal immediately
            setTimeout(() => {
              const { from } = editor.state.selection;
              const node = editor.state.doc.nodeAt(from - 1);

              if (node && node.type.name === this.name) {
                const getPos = () => from - 1;
                openImageModal(node, getPos, editor, handler);
              }
            }, 10);
          }

          return result;
        },
      };
    },

    addNodeView() {
      return ({ node, HTMLAttributes, getPos, editor }: any) => {
        const dom = document.createElement('div');
        dom.className = 'image-node-view';

        const updateContent = () => {
          const nodeAttrs = (node as any).attrs;
          const dataUid = nodeAttrs['data-uid'];
          const alt = nodeAttrs.alt || '';
          const figcaption = nodeAttrs.figcaption || '';
          const isEditable = editor.isEditable;

          if (dataUid && handler) {
            // Render image with figure
            const imageUrl = handler.url(dataUid);
            const title = alt || figcaption || '';
            const caption = figcaption && figcaption !== 'undefined' ? figcaption
              : (alt && alt !== 'undefined' ? alt : '');

            dom.innerHTML = `
              <figure class="text-center">
                <img
                  class="content-image"
                  data-uid="${dataUid}"
                  src="${imageUrl}"
                  title="${title}"
                  alt="${caption || 'Kuvituskuva'}"
                  style="max-width: 100%; height: auto; cursor: ${isEditable ? 'pointer' : 'default'};"
                >
                ${caption ? `<figcaption style="font-style: italic; color: #666; margin-top: 0.5rem;">${caption}</figcaption>` : ''}
              </figure>
            `;

            // Add click handler for editing only if editable
            if (isEditable) {
              const img = dom.querySelector('img');
              if (img) {
                const clickHandler = () => {
                  // Double-check editability at click time
                  if (editor.isEditable) {
                    openImageModal(node, getPos, editor, handler);
                  }
                };
                img.addEventListener('click', clickHandler);
              }
            }
          }
          else if (isEditable) {
            // Render placeholder button only if editable
            dom.innerHTML = `
              <button
                type="button"
                class="btn btn-outline-primary"
                style="padding: 0.5rem 1rem; border: 1px solid #007bff; background: transparent; color: #007bff; cursor: pointer;"
              >
                <span class="material-icons" style="vertical-align: middle; margin-right: 0.5rem;">add_photo_alternate</span>
                Lisää kuva
              </button>
            `;

            const button = dom.querySelector('button');
            if (button) {
              const clickHandler = () => {
                // Double-check editability at click time
                if (editor.isEditable) {
                  openImageModal(node, getPos, editor, handler);
                }
              };
              button.addEventListener('click', clickHandler);
            }
          }
          else {
            dom.innerHTML = '';
          }
        };

        const onTransaction = (props: any) => {
          // Check for force update meta or if editability might have changed
          if (props.transaction?.getMeta('forceUpdate')
              || props.transaction?.docChanged
              || props.oldState?.doc !== props.newState?.doc) {
            updateContent();
          }
        };

        editor.on('transaction', onTransaction);

        updateContent();

        return {
          dom,
          update: (updatedNode: any) => {
            if (updatedNode.type !== (node as any).type) {
              return false;
            }
            // Update the node reference and re-render
            (node as any).attrs = (updatedNode as any).attrs;
            updateContent();
            return true;
          },
        };
      };
    },
  });
}

// Export the extension creator for easier usage
export { createImageExtension3 };
