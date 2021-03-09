import Vue from 'vue';
import _ from 'lodash';
import { computed } from '@vue/composition-api';
import { Oikeus } from '../tyypit';
import { Computed } from '../utils/interfaces';

const DisableTags = ['input', 'button'];

export interface IOikeusProvider {
  hasOikeus: (oikeus: Oikeus, kohde: any) => boolean;
  isAdmin?: Computed<boolean>;
  hasOphCrud?: Computed<boolean>;
}

export interface OikeustarkasteluConfig {
  oikeusProvider: IOikeusProvider;
}

declare module 'vue/types/vue' {
  interface Vue {
    $hasOikeus: (oikeus: Oikeus, kohde: any) => boolean;
    $isAdmin: Computed<boolean>;
    $hasOphCrud: Computed<boolean>;
  }
}

export class Oikeustarkastelu {
  public static install(vue: typeof Vue, config: OikeustarkasteluConfig) {
    vue.prototype.$isAdmin = config.oikeusProvider.isAdmin || false;
    vue.prototype.$hasOphCrud = config.oikeusProvider.hasOphCrud || false;

    vue.prototype.$hasOikeus = function(oikeus: Oikeus, kohde: any) {
      return config.oikeusProvider.hasOikeus(oikeus, kohde);
    };

    // Sisällön kääntäminen
    vue.directive('oikeustarkastelu', {
      async bind(el, binding) {
        // Hide the element before rights have been resolved
        const old = el.style.display;
        el.style.display = 'none';
        let value = binding.value || 'luku';
        let kohde: any;
        if (_.isObject(value)) {
          kohde = (value as any).kohde;
          value = (value as any).oikeus;
        }

        if (config.oikeusProvider.hasOikeus(value, kohde)) {
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
