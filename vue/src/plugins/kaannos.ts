import Vue from 'vue';
import { createLogger } from '../utils/logger';
import { LokalisoituTeksti, Kielet } from '../stores/kieli';

const logger = createLogger('Kaannos');

export class Kaannos {
  public install(vue: typeof Vue) {
    // Sisällön kääntäminen
    vue.prototype.$kaanna = (value: LokalisoituTeksti) => {
      return Kielet.kaanna(value);
    };

    vue.prototype.$kaannaOlioTaiTeksti = (value: LokalisoituTeksti) => {
      return Kielet.kaannaOlioTaiTeksti(value);
    };
  }
}

export default new Kaannos();
