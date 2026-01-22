import { definePreset } from '@primevue/themes';
import Aura from '@primeuix/themes/aura';
import { App } from 'vue';
import PrimeVue from 'primevue/config';

export const setPrimeVue = (app: App) => {
  app.use(PrimeVue, {
    theme: {
        preset: definePreset(Aura),
        options: {
          darkModeSelector: 'none'
        }
    },
    pt: {
      button: {
        root: ({ props }: any) => {
          if (props.link) {
            return {
              class: 'p-0 m-0 !text-lime-600',
            };
          }
          return {};
        },
      },
      drawer: {
        mask: {
          style: {
            top: '70px',
          },
        },
        root: {
          style: {
            width: '400px',
            border: '0',
          },
          class: 'p-0',
        },
        header: {
          class: '!hidden',
        },
        content: {
          class: 'p-0',
        },
      },
      toggleswitch: {
        slider: ({ context }: any) => ({
          class: [
            {
              '!bg-lime-600': context.checked,
              '!bg-surface-200': !context.checked
            }
          ]
        })
      },
      checkbox: {
        box: ({ context }: any) => ({
          class: [
            {
              '!bg-lime-600': context.checked,
              '!bg-surface-200': !context.checked
            }
          ]
        })
      }
    },
  });
}
