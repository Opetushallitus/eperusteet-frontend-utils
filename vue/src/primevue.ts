import { definePreset } from '@primevue/themes';
import Aura from '@primeuix/themes/aura';
import { App } from 'vue';
import PrimeVue from 'primevue/config';

export const setPrimeVue = (app: App) => {
  app.use(PrimeVue, {
    theme: {
      preset: definePreset(Aura),
      options: {
        darkModeSelector: 'none',
      },
    },
    pt: {
      button: {
        root: ({ props }: any) => {
          if (props.link) {
            return {
              class: 'p-0 m-0',
              style: { color: 'var(--link)' },
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
          style: {
            backgroundColor: context.checked ? 'var(--green2)' : 'var(--grey200)',
          },
        }),
      },
      checkbox: {
        box: ({ context }: any) => ({
          style: {
            backgroundColor: context.checked ? 'var(--green2)' : 'var(--grey200)',
          },
        }),
      },
    },
  });
};
