import Vue from 'vue';
import { createLogger } from '../utils/logger';
import { Kielet } from '../stores/kieli';
import * as _ from 'lodash';

const logger = createLogger('Kaannos');

declare module 'vue/types/vue' {
  interface Vue {
    $suodatin: (query: string) => <T extends object>(value: T) => string;
    $filterBy: (field: string, query: string) => <T extends object>(value: T) => boolean;
    $kaanna: <T extends object>(value: T) => string;
    $kaannaOlioTaiTeksti: <T extends object>(value: T | string) => string;
  }
}

export class Kaannos {
  public install(vue: typeof Vue, options) {
    // Sisällön kääntäminen
    vue.prototype.$suodatin = (str: string) => Kielet.searchFn(str);

    vue.prototype.$filterBy = function(field: string, query: string) {
      return Kielet.filterBy(field, query);
    };

    vue.prototype.$kaanna = (value: any, emptyWhenNotFound = false, squareBrackets = true) => {
      return Kielet.kaanna(value, emptyWhenNotFound, _.has(options, 'squareBrackets') ? options.squareBrackets : squareBrackets);
    };

    vue.prototype.$kaannaOlioTaiTeksti = (value: any, emptyWhenNotFound = false, squareBrackets = true) => {
      return Kielet.kaannaOlioTaiTeksti(
        value,
        _.has(options, 'emptyWhenNotFound') ? options.emptyWhenNotFound : emptyWhenNotFound,
        _.has(options, 'squareBrackets') ? options.squareBrackets : squareBrackets);
    };
  }
}

export default new Kaannos();
