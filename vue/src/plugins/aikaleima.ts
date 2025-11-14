import { App } from 'vue';
import moment from 'moment';
import 'moment/locale/fi';
import 'moment/locale/ru';
import 'moment/locale/se';
import 'moment/locale/sv';
import 'moment/locale/en-gb';
import { createLogger } from '../utils/logger';
import { Kielet } from '../stores/kieli';

const logger = createLogger('Aikaleima');

// Define types for global properties with proper typing
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $d: (date: Date | number | string, format?: string) => string;
    $n: (num: number, format?: string) => string;
    $date: (value: number) => string;
    $ago: (value: number) => string;
    $ldt: (value: number) => string;
    $ld: (value: number) => string;
    $lt: (value: number) => string;
    $sdt: (value: number) => string;
    $sd: (value: number) => string;
    $st: (value: number) => string;
    $sdm: (value: number) => string;
    $cdt: (value: number, format: string) => string;
  }
}

export class Aikaleima {
  public install(app: App): void {
    function aikaleimaFnFactory(format: string) {
      return function(value: number): string {
        if (!Kielet.i18n.global.locale) {
          throw new Error('vue-i18n is required');
        }

        if (!value) {
          logger.warn('Virheellinen aikaformaatti:', value);
          return value as unknown as string;
        }
        return moment(value).format(format);
      };
    }

    // Long datetime
    app.config.globalProperties.$ldt = aikaleimaFnFactory('LLL');

    // Long date
    app.config.globalProperties.$ld = aikaleimaFnFactory('LL');

    // Long time
    app.config.globalProperties.$lt = aikaleimaFnFactory('H:mm:ss');

    // Short datetime
    app.config.globalProperties.$sdt = aikaleimaFnFactory('D.M.YYYY H:mm');

    // Short date
    app.config.globalProperties.$sd = aikaleimaFnFactory('D.M.YYYY');

    // Short time
    app.config.globalProperties.$st = aikaleimaFnFactory('H:mm');

    // Short date month
    app.config.globalProperties.$sdm = aikaleimaFnFactory('D MMM');

    app.config.globalProperties.$cdt = aikaleimaFnFactory('LLLL');

    // Time until or ago an event counting from now
    app.config.globalProperties.$ago = function(value: number): string {
      if (!Kielet.i18n.global.locale) {
        throw new Error('vue-i18n is required');
      }
      const result = moment(value).fromNow();
      return result;
    };

    app.config.globalProperties.$date = function(value: number): string {
      if (!Kielet.i18n.global.locale) {
        throw new Error('vue-i18n is required');
      }

      // TODO: Check date and use other types depending on the actual date
      return moment(value).fromNow();
    };

    // Custom datetime
    app.config.globalProperties.$cdt = function(value: number, format: string): string {
      if (!Kielet.i18n.global.locale) {
        throw new Error('vue-i18n is required');
      }

      return moment(value).format(format);
    };
  }
}

const aikaleima = new Aikaleima();
export default aikaleima;

export function updateRelativeTime() {
  return {
    relativeTime: {
      future: '%s ' + Kielet.t('paasta'),
      past: '%s ' + Kielet.t('sitten'),
      s: Kielet.t('muutama-sekunti'),
      ss: '%d ' + Kielet.t('aikalyhenne-sekuntia'),
      m: Kielet.t('aikalyhenne-minuutti'),
      mm: '%d ' + Kielet.t('aikalyhenne-minuutti'),
      h: Kielet.t('aikalyhenne-tunti'),
      hh: '%d ' + Kielet.t('aikalyhenne-tunti'),
      d: Kielet.t('aikalyhenne-paiva'),
      dd: '%d ' + Kielet.t('aikalyhenne-paiva'),
      M: Kielet.t('aikalyhenne-kuukausi'),
      MM: '%d ' + Kielet.t('aikalyhenne-kuukausi'),
      y: Kielet.t('aikalyhenne-vuosi'),
      yy: '%d ' + Kielet.t('aikalyhenne-vuosi'),
    },
  };
}
