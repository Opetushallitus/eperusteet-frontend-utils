import Vue from 'vue';
import { createLogger } from '../utils/logger';
import { Kielet } from '../stores/kieli';

const logger = createLogger('Kaannos');

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
