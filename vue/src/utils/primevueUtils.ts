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
    $t('sunnuntai.lyhenne'),
    $t('maanantai.lyhenne'),
    $t('tiistai.lyhenne'),
    $t('keskiviikko.lyhenne'),
    $t('torstai.lyhenne'),
    $t('perjantai.lyhenne'),
    $t('lauantai.lyhenne'),
  ],
  dayNamesMin: [
    $t('sunnuntai.lyhenne'),
    $t('maanantai.lyhenne'),
    $t('tiistai.lyhenne'),
    $t('keskiviikko.lyhenne'),
    $t('torstai.lyhenne'),
    $t('perjantai.lyhenne'),
    $t('lauantai.lyhenne'),
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
