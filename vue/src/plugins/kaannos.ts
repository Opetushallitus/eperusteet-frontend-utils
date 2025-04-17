import { App } from 'vue';
import { createLogger } from '../utils/logger';
import { Kielet } from '../stores/kieli';
import * as _ from 'lodash';
import { unescapeStringHtml } from '@shared/utils/inputs';

const logger = createLogger('Kaannos');

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $suodatin: (query: string) => <T extends object>(value: T) => string;
    $filterBy: (field: string, query: string) => <T extends object>(value: T) => boolean;
    $kaanna: <T extends object>(value?: T, emptyWhenNotFound?: boolean, squareBrackets?: boolean, forcedLang?: string) => string;
    $kaannaOlioTaiTeksti: <T extends object>(value: T | string) => string;
    $kaannaPlaceholder: <T extends object>(value: T | string, squareBrackets?: boolean) => string;
  }
}

export class Kaannos {
  public install(app: App, options: any) {
    // Sisällön kääntäminen
    app.config.globalProperties.$suodatin = (str: string) => (value: any) => this.handleUnescaping(Kielet.searchFn(str)(value));

    app.config.globalProperties.$filterBy = function(field: string, query: string) {
      return Kielet.filterBy(field, query);
    };

    app.config.globalProperties.$kaanna = (value?: any, emptyWhenNotFound = false, squareBrackets = true, forcedLang = null) => {
      return this.handleUnescaping(Kielet.kaanna(value, emptyWhenNotFound, _.has(options, 'squareBrackets') ? options.squareBrackets : squareBrackets, forcedLang));
    };

    app.config.globalProperties.$kaannaOlioTaiTeksti = (value: any, emptyWhenNotFound = false, squareBrackets = true) => {
      return this.handleUnescaping(Kielet.kaannaOlioTaiTeksti(
        value,
        _.has(options, 'emptyWhenNotFound') ? options.emptyWhenNotFound : emptyWhenNotFound,
        _.has(options, 'squareBrackets') ? options.squareBrackets : squareBrackets));
    };

    app.config.globalProperties.$kaannaPlaceholder = (value?: any, squareBrackets = false) => {
      return this.handleUnescaping(Kielet.kaannaPlaceholder(value, squareBrackets));
    };
  }

  // Ei tehdä unescapetusta, jos sisällössä oleva sisäinen linkki sisältää routenode-attribuutin, koska rikkoo tämän json-rakenteen.
  private handleUnescaping(kaannos) {
    return _.includes(kaannos, 'routenode') ? kaannos : unescapeStringHtml(kaannos);
  }
}

export default new Kaannos();
