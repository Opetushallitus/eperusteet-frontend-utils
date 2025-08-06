import { Node, mergeAttributes } from '@tiptap/core';
import { IKuvaHandler } from './KuvaHandler';
import { createApp, getCurrentInstance } from 'vue';
import ImageModal from './ImageModal.vue';
import { useGlobalProperties } from '@shared/utils/globals';

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
  let savedUid = currentUid;
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
      } catch (error) {
        console.warn('Error unmounting modal app:', error);
      }

      try {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      } catch (error) {
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
      modelValue: { value: currentUid },
      loader: handler,
      kuvatekstiProp:null,
      vaihtoehtotekstiProp: null,
      'onUpdate:modelValue': (value: any) => {
        savedUid = value.value || '';
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
          tr.setNodeMarkup(pos, undefined, {
            ...(node as any).attrs,
            'data-uid': savedUid,
            alt: savedAlt,
            figcaption: savedFigcaption,
          });
          editor.view.dispatch(tr);

          // If no image was selected and this is a new node, remove it
          if (!savedUid && !currentUid) {
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

    // Copy the application context from the current app to the modal
    // This is essential for getting all the global properties and plugins
    try {
      // Method 1: Try to get from the editor context (most reliable)
      const rootApp = editor.view.dom.closest('[data-app]')?.__vueParentComponent?.appContext.app;

      if (rootApp) {
        // Copy global properties and plugins
        modalApp.config.globalProperties = { ...rootApp.config.globalProperties };
        modalApp._context.provides = { ...rootApp._context.provides };
        modalApp._context.components = { ...rootApp._context.components };
        modalApp._context.directives = { ...rootApp._context.directives };
        modalApp._context.mixins = [...(rootApp._context.mixins || [])];
        modalApp._context.plugins = [...(rootApp._context.plugins || [])];
      } else {
        // Method 2: Fallback to finding Vue app through DOM
        const vueApp = document.querySelector('#app')?.__vueParentComponent?.appContext.app;
        if (vueApp) {
          modalApp.config.globalProperties = { ...vueApp.config.globalProperties };
          modalApp._context.provides = { ...vueApp._context.provides };
          modalApp._context.components = { ...vueApp._context.components };
          modalApp._context.directives = { ...vueApp._context.directives };
        } else {
          // Method 3: Try the globals.ts pattern
          const globalApp = (window as any).__VUE_APP_INSTANCE__;
          if (globalApp) {
            modalApp.config.globalProperties = { ...globalApp.config.globalProperties };
            modalApp._context.provides = { ...globalApp._context.provides };
          } else {
            // Method 4: Fallback - manually copy global properties from globals.ts
            const globalProps = useGlobalProperties();
            if (globalProps && Object.keys(globalProps).length > 0) {
              modalApp.config.globalProperties = { ...globalProps };
            }
          }
        }
      }
    } catch (contextError) {
      console.warn('Could not copy Vue app context:', contextError);
    }

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
            if (!attributes['data-uid']) {
              return {};
            }
            return { 'data-uid': attributes['data-uid'] };
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
            if (!attributes.src) {
              return {};
            }
            return { src: attributes.src };
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
      return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    },

    addCommands() {
      return {
        insertImage: (options) => ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
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

          // Check if editor is editable (different ways in Tiptap 3)
          const isEditable = editor.isEditable !== undefined ? editor.isEditable :
                            editor.options?.editable !== undefined ? editor.options.editable :
                            editor.view?.editable !== undefined ? editor.view.editable : false;

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
                  style="max-width: 100%; height: auto; cursor: ${editor.isEditable ? 'pointer' : 'default'};"
                >
                ${caption ? `<figcaption style="font-style: italic; color: #666; margin-top: 0.5rem;">${caption}</figcaption>` : ''}
              </figure>
            `;

            // Add click handler for editing
            if (isEditable) {
              const img = dom.querySelector('img');
              if (img) {
                img.addEventListener('click', () => {
                  openImageModal(node, getPos, editor, handler);
                });
              }
            }
          }
          else if (isEditable) {
            // Render placeholder button
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
              button.addEventListener('click', () => {
                openImageModal(node, getPos, editor, handler);
              });
            }
          } else {
            // Editor not editable, show nothing for empty images
            dom.innerHTML = '';
          }
        };

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
          destroy: () => {
            // Cleanup if needed
          },
        };
      };
    },
  });
}

// Export the extension creator for easier usage
export { createImageExtension3 };
