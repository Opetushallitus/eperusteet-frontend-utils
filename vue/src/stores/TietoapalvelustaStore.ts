import Vue from 'vue';
import VueCompositionApi, { reactive, computed } from '@vue/composition-api';
import { Julkinen, TietoaPalvelustaDto } from '@shared/api/eperusteet';
import _ from 'lodash';

Vue.use(VueCompositionApi);

export class TietoapalvelustaStore {
  public state = reactive({
    tietoapalvelusta: null as TietoaPalvelustaDto | null,
  });

  public readonly tietoapalvelusta = computed(() => this.state.tietoapalvelusta);

  public async fetch() {
    try {
      this.state.tietoapalvelusta = (await Julkinen.getTietoaPalvelusta()).data;
    }
    catch (e) {
      this.state.tietoapalvelusta = null;
    }
  }
}
