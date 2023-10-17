import Vue from 'vue';
import VueCompositionApi, { reactive, computed } from '@vue/composition-api';
import { MaaraysDto, Maaraykset, MaaraysDtoTyyppiEnum } from '@shared/api/eperusteet';
import _ from 'lodash';
import { Koulutustyyppi, Page } from '@shared/tyypit';

Vue.use(VueCompositionApi);

export interface MaaraysQueryDto {
  nimi?: string;
  tyyppi?: MaaraysDtoTyyppiEnum;
  koulutustyyppi?: Koulutustyyppi;
  tuleva?: boolean,
  voimassaolo?: boolean,
  poistunut?: boolean,
  laadinta?: boolean,
  julkaistu?: boolean,
  sivu?: number;
  sivukoko?: number;
}

export class MaarayksetStore {
  private state = reactive({
    maaraykset: null as Page<MaaraysDto> | null,
  })

  public readonly maaraykset = computed(() => this.state.maaraykset);

  async fetch(query: MaaraysQueryDto) {
    this.state.maaraykset = null;
    this.state.maaraykset = (await Maaraykset.getMaaraykset(
      query.nimi,
      query.tyyppi,
      query.koulutustyyppi,
      query.tuleva,
      query.voimassaolo,
      query.poistunut,
      query.laadinta,
      query.julkaistu,
      query.sivu,
      query.sivukoko,
    )).data as any;
  }
}
