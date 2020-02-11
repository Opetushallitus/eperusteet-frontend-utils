import Vue from 'vue';
import VueI18n from 'vue-i18n';
import moment from 'moment';
import { createLogger } from '../utils/logger';
import { Kielet } from '../stores/kieli';

const logger = createLogger('Aikaleima');

declare module 'vue/types/vue' {
  interface Vue {
    $t: typeof VueI18n.prototype.t;
    $tc: typeof VueI18n.prototype.tc;
    $te: typeof VueI18n.prototype.te;
    $d: typeof VueI18n.prototype.d;
    $n: typeof VueI18n.prototype.n;
  }
}

export class Aikaleima {

  public install(vue: typeof Vue) {

    function updateRelativeTime() {
      return {
        relativeTime : {
          future: 'in %s',
          past:   '%s ' + Kielet.t('sitten'),
          s  : Kielet.t('muutama-sekunti'),
          ss : '%d ' + Kielet.t('aikalyhenne-sekuntia'),
          m:  Kielet.t('aikalyhenne-minuutti'),
          mm: '%d ' + Kielet.t('aikalyhenne-minuutti'),
          h:  Kielet.t('aikalyhenne-tunti'),
          hh: '%d ' + Kielet.t('aikalyhenne-tunti'),
          d:  Kielet.t('aikalyhenne-paiva'),
          dd: '%d ' + Kielet.t('aikalyhenne-paiva'),
          M:  Kielet.t('aikalyhenne-kuukausi'),
          MM: '%d ' + Kielet.t('aikalyhenne-kuukausi'),
          y:  Kielet.t('aikalyhenne-vuosi'),
          yy: '%d ' + Kielet.t('aikalyhenne-vuosi')
        }
      };
    }

    function aikaleimaFnFactory(this: void, format: string) {
      // eslint-disable-next-line only-arrow-functions
      return function(this: void, value: number) {
        (this as any).$i18n.locale; // eslint-disable-line
        if (!value) {
          logger.warn('Virheellinen aikaformaatti:', value);
          return value;
        }
        return moment(value).format(format);
      };
    }

    // Long datetime
    vue.prototype.$ldt = aikaleimaFnFactory('LLL');

    // Long date
    vue.prototype.$ld = aikaleimaFnFactory('LL');

    // Long time
    vue.prototype.$lt = aikaleimaFnFactory('H:mm:ss');

    // Short datetime
    vue.prototype.$sdt = aikaleimaFnFactory('D.M.YYYY H:mm');

    // Short date
    vue.prototype.$sd = aikaleimaFnFactory('D.M.YYYY');

    // Short time
    vue.prototype.$st = aikaleimaFnFactory('H:mm');

    // Time until or ago an event counting from now
    vue.prototype.$ago = function(value: number) {
      this.$i18n.locale; // eslint-disable-line
      moment.updateLocale(this.$i18n.locale, updateRelativeTime());
      return moment(value).fromNow();
    };

    // Custom datetime
    vue.prototype.$cdt = function(value: number, format: string) {
      // Pakko olla, jotta localen vaihtuessa komponentti päivittyy
      this.$i18n.locale; // eslint-disable-line
      return moment(value).format(format);
    };
  }
}

const aikaleima = new Aikaleima();
export default aikaleima;
