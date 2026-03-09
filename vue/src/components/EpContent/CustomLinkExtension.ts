import { Mark, mergeAttributes } from '@tiptap/core';
import { createApp } from 'vue';
import LinkModal from './LinkModal.vue';
import { useGlobalProperties, $confirmModal, $t } from '@shared/utils/globals';
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



  const mountContainer = document.createElement('div');
  document.body.appendChild(mountContainer);

  let modalApp: any;
  let isClosed = false;

  const closeModal = () => {
    if (isClosed) return;
    isClosed = true;

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
        if (mountContainer.parentNode) {
          mountContainer.parentNode.removeChild(mountContainer);
        }
      }
      catch (error) {
        console.warn('Error removing mount container:', error);
      }
    }, 10);
  };

  try {
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

    modalApp.mount(mountContainer);
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

      const linkkiHandler = this.options.linkkiHandler || null;

      return [
        new Plugin({
          key: new PluginKey('handleClickLink'),
          view(editorView) {
            const handleLinkEvent = (event: MouseEvent) => {
              if (!editorView.dom.contains(event.target as Node)) return;

              const linkElement = (event.target as HTMLElement).closest('a');
              if (!linkElement) return;

              event.preventDefault();
              event.stopPropagation();
              event.stopImmediatePropagation();

              if (editorView.editable) {
                return;
              }

              const routeNodeAttr = linkElement.getAttribute('routenode');
              const href = linkElement.getAttribute('href') || '';
              const isExternalLink = !routeNodeAttr && href && href !== '#';

              if (isExternalLink) {
                $confirmModal?.msgBoxConfirm(
                  $t('vahvista-toiminto') as any,
                  {
                    message: $t('ulkoinen-linkki-vahvistus-viesti', { url: href }) as any,
                    okTitle: $t('siirry') as any,
                    cancelTitle: $t('peruuta') as any,
                  },
                ).then((confirmed: boolean) => {
                  if (confirmed) {
                    window.open(href, '_blank');
                  }
                });
              }
              else if (routeNodeAttr && linkkiHandler) {
                try {
                  const routeNode = JSON.parse(routeNodeAttr);
                  const routeLocation = linkkiHandler.nodeToRoute(routeNode);
                  if (routeLocation) {
                    const { $router } = useGlobalProperties() as any;
                    if ($router) {
                      $router.push(routeLocation);
                    }
                  }
                }
                catch {
                  // Fall through
                }
              }
            };

            const mousedownHandler = (event: MouseEvent) => {
              if (!editorView.dom.contains(event.target as Node)) return;
              const linkElement = (event.target as HTMLElement).closest('a');
              if (linkElement) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
              }
            };

            document.addEventListener('mousedown', mousedownHandler, true);
            document.addEventListener('click', handleLinkEvent, true);

            return {
              destroy() {
                document.removeEventListener('mousedown', mousedownHandler, true);
                document.removeEventListener('click', handleLinkEvent, true);
              },
            };
          },
        }),
      ];
    },
  });
}
