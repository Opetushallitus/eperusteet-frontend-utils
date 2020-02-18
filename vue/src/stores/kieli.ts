import { createLogger } from '../utils/logger';
import { Kieli } from '../tyypit';
import _ from 'lodash';
import VueI18n from 'vue-i18n';
import Vue, { VueConstructor } from 'vue';
import moment from 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/fi';
import 'moment/locale/ru';
import 'moment/locale/se';
import 'moment/locale/sv';
import VueCompositionApi, {computed, reactive} from '@vue/composition-api';

Vue.use(VueCompositionApi);


export const UiKielet = Object.freeze(['fi', 'sv', 'en']);
const logger = createLogger('Kieli');

function getMessages() {
  const result: any = {};
  try {
    result.fi = require('@/translations/locale-fi.json');
  }
  catch (e) {}

  try {
    result.sv = require('@/translations/locale-sv.json');
  }
  catch (e) {}
  return result;
}


export class KieliStore {
  private vi18n!: VueI18n;

  public get i18n() {
    return this.vi18n;
  }

  /**
   * Add language support to root vue instance.
   *
   */
  public install(v: VueConstructor,
    config: Partial<VueI18n.I18nOptions> = {}) {
    moment.locale(Kieli.fi);
    this.vi18n = new VueI18n(_.merge({
      fallbackLocale: Kieli.fi,
      locale: Kieli.fi,
      messages: getMessages(),
    }, _.cloneDeep(config)));
  }

  /**
   * Load translation from other source
   *
   */
  public async load(kaannokset: Kaannokset) {
    logger.info('Initing locales');
    const results = await this.fetchLocaleMap(kaannokset);
    _.forEach(results, (locales, lang) => {
      this.i18n!.mergeLocaleMessage(lang, locales);
    });
  }

  private readonly state = reactive({
    sisaltoKieli: Kieli.fi,
  });

  public readonly getUiKieli = computed(() => this.i18n!.locale);
  public readonly getSisaltoKieli = computed(() => this.state.sisaltoKieli);

  public readonly getAikakaannokset = computed(() => {
    const kieli = this.state.sisaltoKieli;
    return {
      days: _.map(moment.weekdays(), (day: string) => _.toUpper(_.first(day))),
      months: moment.monthsShort(),
      placeholder: {
        date: this.i18n!.t('valitse-pvm'),
        dateRange: this.i18n!.t('valitse-pvm-jana'),
      },
    };
  })

  public setUiKieli(kieli: Kieli) {
    if (this.i18n!.locale !== kieli && _.includes(UiKielet, kieli)) {
      // this.logger.debug('Ui kieli ->', kieli);
      moment.locale(kieli);
      this.i18n!.locale = kieli;
    }
  }

  public setSisaltoKieli(kieli: Kieli) {
    if (this.state.sisaltoKieli !== kieli && _.includes(UiKielet, kieli)) {
      this.state.sisaltoKieli = kieli;
    }
  }

  public haeLokalisoituOlio(avain: string) {
    const result = {
      fi: this.i18n!.t(avain, 'fi'),
      sv: this.i18n!.t(avain, 'sv'),
      en: this.i18n!.t(avain, 'en'),
    };
    return result;
  }

  /**
   * Check if text query matches object
   *
   */
  public search(query: string, text: any, config = {}): boolean {
    if (text && query) {
      const target = _.isString(text) ? text : text[this.getSisaltoKieli.value];
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
    if (this.vi18n) {
      return this.vi18n.t(value) as string || '<' + value + '>';
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
      const locale = this.getSisaltoKieli.value;
      return (value as any)[locale];
    }
    else {
      return value;
    }
  };

  public kaanna(value: LokalisoituTeksti | string): string {
    if (!value) {
      return '';
    }
    else if (_.isObject(value)) {
      const locale = this.getSisaltoKieli.value;
      const kielet = [locale, ..._.pull(['fi', 'sv', 'en', 'se', 'ru'], locale)];
      let teksti = '';

      _.forEach(kielet, kieli => {
        if (!_.isEmpty(value[kieli])) {
          teksti = value[kieli] as string;
          return false;
        }
      });

      return teksti;
    }
    else {
      logger.warn('"$kaanna" on tekstiolioiden kääntämiseen. Käytä vue-i18n vastaavaa funktiota. Esimerkiksi "$t()".', 'Käännös:', '"' + value + '"');
      return value;
    }
  };

  public kaannaOlioTaiTeksti(value: LokalisoituTeksti | string): string {
    if (_.isObject(value)) {
      return this.kaanna(value);
    }
    else if (_.isString(value)) {
      return this.t(value);
    }
    else {
      return value;
    }
  }

  private async fetchLocaleMap(kaannokset: Kaannokset) {
    try {
      const result: any = {};
      const localeObj = kaannokset;
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
}

export interface Kaannokset {
  [locale: string]: Kaannos[];
}

export interface LokalisoituTeksti {
  [locale: string]: string | null | undefined | number;
  _id?: number;
  _tunniste?: string;
}
