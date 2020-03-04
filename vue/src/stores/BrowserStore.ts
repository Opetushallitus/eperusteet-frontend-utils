import Vue from 'vue';
import VueCompositionApi, { reactive, computed } from '@vue/composition-api';
import { NavigationNodeDto, PerusteprojektiDto, PerusteDto, Ulkopuoliset, Perusteprojektit, Perusteet } from '@shared/api/eperusteet';
import _ from 'lodash';

Vue.use(VueCompositionApi);


export class BrowserStore {

  private static state = reactive({
    scrollY: 0,
  });

  public readonly scrollY = computed(() => BrowserStore.state.scrollY);

  public static install() {
    document.addEventListener('scroll', (ev) => {
      BrowserStore.state.scrollY = window.pageYOffset;
    });
  }

}
