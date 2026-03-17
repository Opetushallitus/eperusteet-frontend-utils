import { definePreset } from '@primevue/themes';
import Aura from '@primeuix/themes/aura';
import { App } from 'vue';
import PrimeVue from 'primevue/config';
import { $t } from './utils/globals';

export const setPrimeVue = (app: App) => {
  app.use(PrimeVue, {
    locale: {
      monthNames: [
        $t('tammikuu'),
        $t('helmikuu'),
        $t('maaliskuu'),
        $t('huhtikuu'),
        $t('toukokuu'),
        $t('kesäkuu'),
        $t('heinäkuu'),
        $t('elokuu'),
        $t('syyskuu'),
        $t('lokakuu'),
        $t('marraskuu'),
        $t('joulukuu'),
      ],
      monthNamesShort: [
        $t('tammikuu'),
        $t('helmikuu'),
        $t('maaliskuu'),
        $t('huhtikuu'),
        $t('toukokuu'),
        $t('kesäkuu'),
        $t('heinäkuu'),
        $t('elokuu'),
        $t('syyskuu'),
        $t('lokakuu'),
        $t('marraskuu'),
        $t('joulukuu'),
      ],
      dayNames: [
        $t('sunnuntai'),
        $t('maanantai'),
        $t('tiistai'),
        $t('keskiviikko'),
        $t('torstai'),
        $t('perjantai'),
        $t('lauantai'),
      ],
      dayNamesShort: [
        $t('su'),
        $t('ma'),
        $t('ti'),
        $t('ke'),
        $t('to'),
        $t('pe'),
        $t('la'),
      ],
      dayNamesMin: [
        $t('su'),
        $t('ma'),
        $t('ti'),
        $t('ke'),
        $t('to'),
        $t('pe'),
        $t('la'),
      ],
      clear: $t('tyhjenna'),
      today: $t('tanaan'),
      weekHeader: $t('viikko'),
      firstDayOfWeek: 1,

    },
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
