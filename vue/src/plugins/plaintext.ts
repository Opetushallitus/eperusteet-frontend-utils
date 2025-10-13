import Vue from 'vue';
import { App } from 'vue';

export class Plaintext {
  public install(app: App, options?: any) {
    app.config.globalProperties.$plaintext = (str: string) => str.replace(/<\/?[^>]+(>|$)/g, '');
  }
}

const plaintext = new Plaintext();
export default plaintext;
