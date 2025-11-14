import Vue from 'vue';
import { Julkinen, TietoaPalvelustaDto } from '@shared/api/eperusteet';
import _ from 'lodash';
import { reactive } from 'vue';
import { computed } from 'vue';

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
