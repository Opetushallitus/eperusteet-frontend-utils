import { Mark, mergeAttributes } from '@tiptap/core';
import { createApp } from 'vue';
import LinkModal from './LinkModal.vue';
import { useGlobalProperties } from '@shared/utils/globals';
import _ from 'lodash';
import { NavigationNodeDto } from '@shared/tyypit';
import { Plugin, PluginKey } from 'prosemirror-state';
import { ILinkkiHandler } from './LinkkiHandler';

export interface CustomLinkExtensionOptions {
  HTMLAttributes: Record<string, any>;
  openOnClick: boolean;
  linkOnPaste: boolean;
  navigation?: NavigationNodeDto | null;
  linkkiHandler?: ILinkkiHandler | null;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customLinkExtension: {
      /**
       * Set a link mark
       */
      setLink: (attributes: { href: string; target?: string; routenode?: string }) => ReturnType;
      /**
       * Toggle a link mark
       */
      toggleLink: (attributes?: { href?: string; target?: string; routenode?: string }) => ReturnType;
      /**
       * Unset a link mark
       */
      unsetLink: () => ReturnType;
      /**
       * Open link modal for editing
       */
      openLinkModal: () => ReturnType;
    };
  }
}



// Helper function to open link modal
function openLinkModal(editor: any, selection: { from: number; to: number }, navigation: NavigationNodeDto | null = null) {
  // Prevent opening modal if editor is not editable or no text is selected
  if (!editor.isEditable || selection.from === selection.to) {
    return;
  }

  // Get current link attributes if editing existing link
  const isActive = editor.isActive('link');
  let currentHref = '';
  let currentRoutenode = '';
  
  if (isActive) {
    const attrs = editor.getAttributes('link');
    currentHref = attrs.href || '';
    currentRoutenode = attrs.routenode || '';
  }



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
    // Create Vue app with the LinkModal component
    modalApp = createApp(LinkModal, {
      initialHref: currentHref,
      initialRoutenode: currentRoutenode,
      onOk: (linkData: any) => {
        if (linkData && !_.isEmpty(linkData)) {
          const { from, to } = selection;
          editor
            .chain()
            .focus()
            .setTextSelection({ from, to })
            .setLink(linkData)
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

    // Provide navigation for injection
    modalApp.provide('navigation', navigation);

    modalApp.mount(modalContent);
  }
  catch (error) {
    console.error('Error mounting link modal:', error);
    closeModal();
  }
}

export function createCustomLinkExtension(navigation: NavigationNodeDto | null = null, linkkiHandler: ILinkkiHandler | null = null) {
  return Mark.create<CustomLinkExtensionOptions>({
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
        navigation,
        linkkiHandler,
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
        routenode: {
          default: null,
          parseHTML: element => element.getAttribute('routenode'),
          renderHTML: attributes => {
            if (!attributes.routenode) {
              return {};
            }
            return { routenode: attributes.routenode };
          },
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
        openLinkModal: () => ({ editor, view, state }) => {
          // Get current selection
          const { from, to } = state.selection;

          // Check if text is selected
          if (from === to) {
            return false;
          }

          // Get navigation from extension options
          const navigation = this.options.navigation || null;

          // Open modal directly
          openLinkModal(editor, { from, to }, navigation);
          return true;
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

              if (linkElement) {
                // In edit mode, never follow links
                if (view.editable) {
                  event.preventDefault();
                  return true;
                }

                // If routenode is present, use router navigation like <router-link>
                const routeNodeAttr = linkElement.getAttribute('routenode');
                const handler = this.options.linkkiHandler || null;
                if (routeNodeAttr && handler) {
                  try {
                    const routeNode = JSON.parse(routeNodeAttr);
                    const routeLocation = handler.nodeToRoute(routeNode);
                    if (routeLocation) {
                      const { $router } = useGlobalProperties() as any;
                      if ($router) {
                        event.preventDefault();
                        event.stopPropagation();
                        $router.push(routeLocation);
                        return true;
                      }
                    }
                  }
                  catch (err) {
                    // If parsing fails or handler throws, fall through to default behavior
                  }
                }
              }

              return false;
            },
          },
        }),
      ];
    },
  });
}
