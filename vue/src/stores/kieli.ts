import Aikaleima from '../plugins/aikaleima';
import Kaannos from '../plugins/kaannos';
import { createLogger } from '../utils/logger';
import { Kieli } from '../tyypit';
import _ from 'lodash';
import { VueConstructor } from 'vue';
import VueI18n from 'vue-i18n';
import moment from 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/fi';
import 'moment/locale/ru';
import 'moment/locale/se';
import 'moment/locale/sv';
import { Getter, Mutation, State, Store } from './store';


export const UiKielet = Object.freeze(_.values(Kieli as object));
const logger = createLogger('Kieli');


@Store
export class KieliStore {
  private static vi18n: VueI18n;

  static get i18n() {
    return KieliStore.vi18n;
  }

  /**
   * Add language support to root vue instance.
   *
   */
  public static setup(v: VueConstructor,
    config: Partial<VueI18n.I18nOptions> = {}) {
    v.use(VueI18n);
    v.use(Aikaleima);
    v.use(Kaannos);
    moment.locale(Kieli.fi);
    KieliStore.vi18n = new VueI18n({
      fallbackLocale: Kieli.fi,
      locale: Kieli.fi,
      ...config,
    });
  }

  /**
   * Load translation from other source
   *
   */
  public static async load(loader: () => Promise<Kaannokset>) {
    logger.info('Initing locales');
    const results = await this.fetchLocaleMap(loader);
    _.forEach(results, (locales, lang) => {
      KieliStore.i18n.mergeLocaleMessage(lang, locales);
    });
  }

  @State()
  private sisaltoKieli: Kieli = Kieli.fi;

  @Getter(() => KieliStore.i18n.locale)
  public readonly getUiKieli!: string;

  @Getter((state) => {
    const kieli = state.sisaltoKieli;
    return {
      days: _.map(moment.weekdays(), (day: string) => _.toUpper(_.first(day))),
      months: moment.monthsShort(),
      placeholder: {
        date: KieliStore.i18n.t('valitse-pvm'),
        dateRange: KieliStore.i18n.t('valitse-pvm-jana'),
      },
    };
  })
  public readonly getAikakaannokset!: any;

  @Getter((state) => {
    return state.sisaltoKieli;
  })
  public readonly getSisaltoKieli!: Kieli;

  @Mutation()
  public setUiKieli(kieli: Kieli) {
    if (KieliStore.i18n.locale !== kieli && _.includes(UiKielet, kieli)) {
      // this.logger.debug('Ui kieli ->', kieli);
      moment.locale(kieli);
      KieliStore.i18n.locale = kieli;
    }
  }

  @Mutation()
  public setSisaltoKieli(kieli: Kieli) {
    if (this.sisaltoKieli !== kieli && _.includes(UiKielet, kieli)) {
      this.sisaltoKieli = kieli;
    }
  }

  public haeLokalisoituOlio(avain: string) {
    const result = {
      fi: KieliStore.vi18n.t(avain, 'fi'),
      sv: KieliStore.vi18n.t(avain, 'sv'),
      en: KieliStore.vi18n.t(avain, 'en'),
    };
    return result;
  }

  /**
   * Check if text query matches object
   *
   */
  public search(query: string, text: any, config = {}): boolean {
    if (text && query) {
      const target = _.isString(text) ? text : text[this.sisaltoKieli];
      return _.includes(_.toLower(target), _.toLower(query));
    }
    else {
      return true;
    }
  }

  public searchFn(query: string) {
    return (text: any) => this.search(query, text);
  }

  /**
   * i18n locale convert
   *
   */
  public t(value: string): string {
    if (KieliStore.vi18n) {
      return KieliStore.vi18n.t(value) as string || '<' + value + '>';
    }
    else {
      return value;
    }
  };

  /**
   * Convert field into sortable value
   *
   * @returns {string}
   */
  public sortValue(value: any): string {
    if (!value) {
      return '';
    }
    else if (_.isObject(value)) {
      const locale = Kielet.getSisaltoKieli;
      return (value as any)[locale];
    }
    else {
      return value;
    }
  };

  /**
   * Translate content localisation objects to strings.
   *
   */
  public kaanna(value: object): string {
    if (!value) {
      return '';
    }
    else if (_.isObject(value)) {
      const locale = Kielet.getSisaltoKieli;
      return (value as any)[locale];
    }
    else {
      logger.warn('"$kaanna" on tekstiolioiden kääntämiseen. Käytä vue-i18n vastaavaa funktiota. Esimerkiksi "$t()".', 'Käännös:', '"' + value + '"');
      return value;
    }
  };

  private static async fetchLocaleMap(fn: () => Promise<Kaannokset>) {
    try {
      const result: any = {};
      const localeObj = await fn();
      _.forEach(localeObj, (locales, lang) => {
        result[lang] = {};
        for (const locale of locales) {
          if (locale.key && locale.value) {
            result[lang][locale.key] = locale.value;
          }
        }
      });
      return result;
    }
    catch (err) {
      logger.error('Käännösten haku epäonnistui', err.message);
      return {};
    }
  }
}

export const Kielet = new KieliStore();


export interface Kaannos {
  key: string;
  value: string;
};

export interface Kaannokset {
  [locale: string]: Kaannos[];
};
