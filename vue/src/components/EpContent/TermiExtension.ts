import { Mark, mergeAttributes } from '@tiptap/core';
import { IKasiteHandler, ITermi } from './KasiteHandler';
import { createApp } from 'vue';
import TermiModal from './TermiModal.vue';
import { $kaanna, useGlobalProperties } from '@shared/utils/globals';
import { ref } from 'vue';
import _ from 'lodash';
import { Plugin, PluginKey } from 'prosemirror-state';

export interface TermiExtension3Options {
  HTMLAttributes: Record<string, any>;
  handler: IKasiteHandler;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    termiExtension3: {
      /**
       * Set a term mark
       */
      setTerm: (attributes: { 'data-viite': string }) => ReturnType;
      /**
       * Toggle a term mark
       */
      toggleTerm: (attributes?: { 'data-viite'?: string }) => ReturnType;
      /**
       * Unset a term mark
       */
      unsetTerm: () => ReturnType;
      /**
       * Open term modal for selection
       */
      openTermModal: () => ReturnType;
    };
  }
}

// Helper function to open term modal
function openTermModal(editor: any, handler: IKasiteHandler, selection: { from: number; to: number }) {
  // Prevent opening modal if editor is not editable
  if (!editor.isEditable) {
    return;
  }

  const currentViite = '';

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
  `;

  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);

  // State for the modal
  let modalApp: any;
  let isClosed = false;
  const savedViite = ref(currentViite);

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
    // Create Vue app with the TermiModal component
    modalApp = createApp(TermiModal, {
      modelValue: savedViite,
      handler,
      'onUpdate:modelValue': (value: string) => {
        savedViite.value = value || '';
      },
      onOk: (viite: string) => {
        if (viite) {
          const { from, to } = selection;
          editor
            .chain()
            .focus()
            .setTextSelection({ from, to })
            .setTerm({ 'data-viite': viite })
            .run();
        }
        closeModal();
      },
      onCancel: () => {
        closeModal();
      },
    });

    const globalProps = useGlobalProperties();
    modalApp.config.globalProperties = { ...globalProps };

    modalApp.mount(modalContent);
  }
  catch (error) {
    console.error('Error mounting term modal:', error);
    closeModal();
  }
}

export function createTermiExtension3(handler: IKasiteHandler) {
  return Mark.create<TermiExtension3Options>({
    name: 'termiExtension3',

    addOptions() {
      return {
        HTMLAttributes: {},
        handler,
      };
    },

    addAttributes() {
      return {
        'data-viite': {
          default: '',
          parseHTML: element => element.getAttribute('data-viite'),
          renderHTML: attributes => {
            if (!attributes['data-viite']) {
              return {};
            }
            return {
              'data-viite': attributes['data-viite'],
            };
          },
        },
        'title': {
          default: '',
          parseHTML: element => element.getAttribute('title'),
          renderHTML: attributes => {
            // Don't render title in the serialized output (modelValue)
            return {};
          },
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: 'abbr',
          getAttrs: (element) => {
            if (typeof element === 'string') {
              return false;
            }
            return {
              'data-viite': element.getAttribute('data-viite') || '',
              title: element.getAttribute('title') || '',
            };
          },
        },
      ];
    },

    renderHTML({ HTMLAttributes }) {
      // Only include data-viite in the serialized HTML (modelValue)
      const attrs: Record<string, any> = {};

      if (HTMLAttributes['data-viite']) {
        attrs['data-viite'] = HTMLAttributes['data-viite'];
      }

      return ['abbr', attrs];
    },

    addCommands() {
      return {
        setTerm: (attributes) => ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
        toggleTerm: (attributes) => ({ commands }) => {
          return commands.toggleMark(this.name, attributes);
        },
        unsetTerm: () => ({ commands }) => {
          return commands.unsetMark(this.name);
        },
        openTermModal: () => ({ editor, view, state }) => {
          // Get current selection
          const { from, to } = state.selection;

          // Check if text is selected
          if (from === to) {
            return false;
          }

          // Get handler from options
          const extensionHandler = this.options.handler;
          if (!extensionHandler) {
            console.warn('No kasiteHandler available for term modal');
            return false;
          }

          // Open modal directly
          openTermModal(editor, extensionHandler, { from, to });
          return true;
        },
      };
    },



    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey('termiExtensionTitleHandler'),
          props: {
            decorations: (state) => {
              // This plugin will handle adding title attributes to DOM elements
              // but only during editing view, not in serialization
              return null;
            },
            nodeViews: {},
            handleDOMEvents: {
              // We'll update DOM elements after they're rendered
            },
          },
          view: (editorView) => {
            const updateTermiTitles = () => {
              // Find all abbr elements with data-viite and add title attributes
              const abbrElements = editorView.dom.querySelectorAll('abbr[data-viite]');
              abbrElements.forEach((abbr: Element) => {
                const dataViite = abbr.getAttribute('data-viite');
                if (dataViite && !abbr.getAttribute('title')) {
                  const termi = handler.getOne(dataViite);
                  if (termi && termi.selitys) {
                    const data = document.createElement('div');
                    data.innerHTML = $kaanna(termi.selitys);
                    const titleText = _.trim(data.textContent || data.innerText || '');
                    if (titleText) {
                      abbr.setAttribute('title', titleText);
                    }
                  }
                }
              });
            };

            // Update titles after initial render
            setTimeout(updateTermiTitles, 0);

            return {
              update: (view, prevState) => {
                // Update titles when document changes
                setTimeout(updateTermiTitles, 0);
              },
              destroy: () => {
                // Cleanup if needed
              },
            };
          },
        }),
      ];
    },

    onSelectionUpdate() {
      // Handle selection updates if needed
    },

    addKeyboardShortcuts() {
      return {};
    },
  });
}
