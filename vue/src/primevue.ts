import { definePreset } from '@primevue/themes';
import Aura from '@primeuix/themes/aura';
import { App } from 'vue';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import { getPrimeVueLocale } from './utils/primevueUtils';

export const setPrimeVue = (app: App) => {
  app.use(ConfirmationService);
  app.use(PrimeVue, {
    locale: getPrimeVueLocale(),
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
    },
  });
};
