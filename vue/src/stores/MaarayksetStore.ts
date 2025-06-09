import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
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

export const useMaarayksetStore = defineStore('maaraykset', () => {
  // State
  const maaraykset = ref<Page<MaaraysDto> | null>(null);
  const koulutustyypit = ref<string[] | null>(null);

  // Create a debounced fetch function
  const debouncedFetch = _.debounce(async (query: MaaraysQueryDto) => {
    maaraykset.value = null;
    maaraykset.value = (await Maaraykset.getMaaraykset(
      query.nimi,
      query.kieli,
      query.tyyppi,
      query.koulutustyypit,
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
  }, DEBOUNCE_WAIT_TIME);

  // Actions
  async function init() {
    koulutustyypit.value = (await Maaraykset.getMaarayksienKoulutustyypit()).data;
  }

  // Public method that calls the debounced fetch
  async function fetch(query: MaaraysQueryDto) {
    debouncedFetch(query);
  }

  return {
    // State
    maaraykset,
    koulutustyypit,

    // Actions
    init,
    fetch,
  };
});
