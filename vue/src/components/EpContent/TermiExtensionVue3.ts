import { Mark, markPasteRule } from '@tiptap/core';
import { IKasiteHandler, ITermi } from './KasiteHandler';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Kielet } from '@shared/stores/kieli';
import { $t } from '@shared/utils/globals';
import _ from 'lodash';

export interface TermiOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    termi: {
      /**
       * Set a termi mark
       */
      setTermi: (attributes: { 'data-viite': string }) => ReturnType;
      /**
       * Toggle a termi mark
       */
      toggleTermi: (attributes: { 'data-viite': string }) => ReturnType;
      /**
       * Unset a termi mark
       */
      unsetTermi: () => ReturnType;
    };
  }
}

export const TermiExtensionVue3 = (handler: IKasiteHandler) => {
  return Mark.create<TermiOptions>({
    name: 'termi',

    addOptions() {
      return {
        HTMLAttributes: {},
      };
    },

    addAttributes() {
      return {
        'data-viite': {
          default: '',
          parseHTML: element => element.getAttribute('data-viite') || '',
          renderHTML: attributes => {
            return {
              'data-viite': attributes['data-viite'],
            };
          },
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: 'abbr[data-viite]',
        },
      ];
    },

    renderHTML({ HTMLAttributes }) {
      return ['abbr', HTMLAttributes, 0];
    },

    addCommands() {
      return {
        setTermi:
          attributes => ({ commands }) => {
            return commands.setMark(this.name, attributes);
          },
        toggleTermi:
          attributes => ({ commands }) => {
            return commands.toggleMark(this.name, attributes);
          },
        unsetTermi:
          () => ({ commands }) => {
            return commands.unsetMark(this.name);
          },
      };
    },

    addProseMirrorPlugins() {
      const extensionThis = this;

      return [
        new Plugin({
          key: new PluginKey('termiHandler'),
          props: {
            handleClick(view, pos, event) {
              // Handle click on termi elements
              const dom = event.target as HTMLElement;

              if (dom.nodeName === 'ABBR' && dom.hasAttribute('data-viite')) {
                const dataViite = dom.getAttribute('data-viite');

                if (view.editable && dataViite) {
                  // Here you would open your termi selector
                  // This would need to be implemented differently in Vue 3
                  // as we can't directly use Vue 2's modal system

                  // For now, we just log the action
                  console.log('Termi clicked:', dataViite);

                  // Return true to indicate we've handled the click
                  return true;
                }
              }

              return false;
            },
            handleDOMEvents: {
              mouseover(view, event) {
                // Add title/tooltip on hover
                const dom = event.target as HTMLElement;

                if (dom.nodeName === 'ABBR' && dom.hasAttribute('data-viite')) {
                  const dataViite = dom.getAttribute('data-viite');

                  if (dataViite) {
                    // Fetch termi data and set title
                    handler.getOne(dataViite)
                      .then((termi: ITermi) => {
                        if (termi) {
                          const selitys = termi.selitys;
                          const data = document.createElement('div');

                          if (selitys) {
                            // Use the appropriate language
                            const lang = Kielet.getSisaltoKieli.value || 'fi';
                            data.innerHTML = selitys[lang] || '';
                            dom.title = _.trim(data.textContent || data.innerText || '');
                          }
                        }
                        else {
                          dom.title = $t('termia-ei-kuvattu');
                        }
                      })
                      .catch(() => {
                        dom.title = $t('termia-ei-kuvattu');
                      });
                  }
                }

                return false;
              },
            },
          },
        }),
      ];
    },
  });
};
