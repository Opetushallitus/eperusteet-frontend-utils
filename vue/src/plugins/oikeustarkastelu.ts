import Vue from 'vue';
import * as _ from 'lodash';
import { createLogger } from '../utils/logger';
import { Kielet } from '@shared/stores/kieli';
import { Oikeus, OikeusKohde } from '@shared/tyypit';

const logger = createLogger('Oikeustarkastelu');
const DisableTags = ['input', 'button'];


export interface IOikeusProvider {
  hasOikeus: (oikeus: Oikeus, kohde: OikeusKohde) => Promise<boolean>;
}

export interface OikeustarkasteluConfig {
  oikeusProvider: IOikeusProvider;
}

export class Oikeustarkastelu {
  public static install(vue: typeof Vue, config: OikeustarkasteluConfig) {
    vue.prototype.$hasOikeus = async function(oikeus: Oikeus, kohde: OikeusKohde) {
      return await config.oikeusProvider.hasOikeus(oikeus, kohde);
    }

    // Sisällön kääntäminen
    vue.directive('oikeustarkastelu', {
      async bind(el, binding) {
        // Hide the element before rights have been resolved
        const old = el.style.display;
        el.style.display = 'none';
        let value = binding.value || 'luku';
        let kohde;
        if (_.isObject(value)) {
          kohde = (value as any).kohde;
          value = (value as any).oikeus;
        }

        if (await config.oikeusProvider.hasOikeus(value, kohde)) {
          el.style.display = old;
        }
        else {
          const { tagName } = el;
          if (_.includes(DisableTags, _.toLower(tagName))) {
            (el as HTMLInputElement).disabled = true;
            el.style.display = old;
          }
        }
      },
    } as Vue.DirectiveOptions);

  }
}
