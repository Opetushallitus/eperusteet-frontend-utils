import Vue from 'vue';
import { createLogger } from '../utils/logger';
import { Kielet } from '../stores/kieli';

const logger = createLogger('Kaannos');

declare module 'vue/types/vue' {
  interface Vue {
    $kaanna: <T extends object>(value: T) => string;
    $kaannaOlioTaiTeksti: <T extends object>(value: T | string) => string;
  }
}

export class Kaannos {
  public install(vue: typeof Vue) {
    // Sisällön kääntäminen
    vue.prototype.$kaanna = (value: any) => {
      return Kielet.kaanna(value);
    };

    vue.prototype.$kaannaOlioTaiTeksti = (value: any) => {
      return Kielet.kaannaOlioTaiTeksti(value);
    };
  }
}

export default new Kaannos();
