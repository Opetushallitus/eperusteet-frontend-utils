import Vue, { computed, ref } from 'vue';
import { MaaraysDto, Maaraykset, MaaraysDtoTyyppiEnum } from '@shared/api/eperusteet';
import _ from 'lodash';
import { Koulutustyyppi, Page } from '@shared/tyypit';

// Define the debounce wait time constant
const DEBOUNCE_WAIT_TIME = 300; // Same as DEFAULT_PUBLIC_WAIT_TIME_MS

export interface MaaraysQueryDto {
  nimi?: string;
  kieli: string;
  tyyppi?: MaaraysDtoTyyppiEnum;
  koulutustyypit?: Koulutustyyppi[];
  maaraysId?: number;
  tuleva?: boolean,
  voimassaolo?: boolean,
  poistunut?: boolean,
  luonnos?: boolean,
  julkaistu?: boolean,
  sivu?: number;
  sivukoko?: number;
  jarjestysTapa?: string;
  jarjestys: string;
}

export class MaarayksetStore {
  private state = ref({
    maaraykset: null as Page<MaaraysDto> | null,
    koulutustyypit: null as string[] | null,
  });

  public readonly maaraykset = computed(() => this.state.value.maaraykset);
  public readonly koulutustyypit = computed(() => this.state.value.koulutustyypit);

  public fetch = _.debounce(async (query: MaaraysQueryDto) => {
    this.state.value.maaraykset = null;
    this.state.value.maaraykset = (await Maaraykset.getMaaraykset(
      query.nimi,
      query.kieli,
      query.tyyppi,
      query.koulutustyypit,
      query.maaraysId,
      query.tuleva,
      query.voimassaolo,
      query.poistunut,
      query.luonnos,
      query.julkaistu,
      query.sivu,
      query.sivukoko,
      query.jarjestysTapa,
      query.jarjestys,
    )).data as any;
  });

  async init() {
    this.state.value.koulutustyypit = (await Maaraykset.getMaarayksienKoulutustyypit()).data;
  }
}
