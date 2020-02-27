import Vue from 'vue';
import VueI18n from 'vue-i18n';
import moment from 'moment';
import { createLogger } from '../utils/logger';
import { Kielet } from '../stores/kieli';

const logger = createLogger('Aikaleima');

declare module 'vue/types/vue' {
  interface Vue {
    $d: typeof VueI18n.prototype.d;
    $n: typeof VueI18n.prototype.n;
    $date: typeof VueI18n.prototype.d;
    $ago: typeof VueI18n.prototype.d;
    $ldt: typeof VueI18n.prototype.d;
    $ld: typeof VueI18n.prototype.d;
    $lt: typeof VueI18n.prototype.d;
    $sdt: typeof VueI18n.prototype.d;
    $sd: typeof VueI18n.prototype.d;
    $st: typeof VueI18n.prototype.d;
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
      const self: any = this;
      return function(this: void, value: number) {
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
      if (!this.$i18n) {
        throw new Error('vue-i18n is required');
      }
      return moment(value).fromNow();
    };

    vue.prototype.$date = function(value: number) {
      if (!this.$i18n) {
        throw new Error('vue-i18n is required');
      }

      // TODO: Check date and use other types depending on the actual date
      return moment(value).fromNow();
    };

    // Custom datetime
    vue.prototype.$cdt = function(value: number, format: string) {
      if (!this.$i18n) {
        throw new Error('vue-i18n is required');
      }
      return moment(value).format(format);
    };
  }
}

const aikaleima = new Aikaleima();
export default aikaleima;
