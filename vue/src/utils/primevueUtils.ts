import { type PrimeVueConfiguration } from 'primevue/config';
import { $t } from './globals';

export const getPrimeVueLocale = () => ({
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
});

export const updatePrimeVueLocale = (primevue: { config: PrimeVueConfiguration }) => {
  if (primevue.config.locale) {
    Object.assign(primevue.config.locale, getPrimeVueLocale());
  }
};
