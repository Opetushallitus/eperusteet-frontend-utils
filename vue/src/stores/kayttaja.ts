import _ from 'lodash';
import Vue from 'vue';
import { Store, Getter, State } from '@shared/stores/store';
import { Kayttajat as KayttajatApi, KayttajanTietoDto } from '@shared/api/eperusteet';
import { createLogger } from '@shared/utils/logger';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';

Vue.use(VueCompositionApi);

// FIXME: tyypitä backendiin
export type Oikeus = 'luku' | 'kommentointi' | 'muokkaus' | 'luonti' | 'poisto' | 'tilanvaihto' | 'hallinta';
export type OikeusKohde = 'opetussuunnitelma' | 'pohja';
export interface Oikeudet { [kohde: string]: Oikeus[]; }

function getOikeusArvo(oikeus: Oikeus) {
  switch (oikeus) {
  case 'luku': return 1;
  case 'kommentointi': return 2;
  case 'muokkaus': return 3;
  case 'luonti': return 4;
  case 'poisto': return 5;
  case 'tilanvaihto': return 6;
  default: return 0;
  }
}

export function parsiEsitysnimi(tiedot: any): string {
  if (tiedot.kutsumanimi && tiedot.sukunimi) {
    return tiedot.kutsumanimi + ' ' + tiedot.sukunimi;
  }
  else {
    return tiedot.oidHenkilo as string;
  }
}

const logger = createLogger('Kayttaja');

export class KayttajaStore {
  public state = reactive({
    organisaatiot: [] as any[],
    tiedot: {} as KayttajanTietoDto,
    virkailijat: [] as any[],
    oikeudet: {
      opetussuunnitelma: [],
      pohja: [],
    } as Oikeudet,
  });

  public readonly organisaatiot = computed(() => this.state.organisaatiot);
  public readonly tiedot = computed(() => this.state.tiedot);
  public readonly virkailijat = computed(() => this.state.virkailijat);
  public readonly oikeudet = computed(() => this.state.oikeudet);
  public readonly nimi = computed(() => parsiEsitysnimi(this.state.tiedot));

  public async init() {
    try {
      logger.info('Haetaan käyttäjän tiedot');
      this.state.tiedot = (await KayttajatApi.getKirjautunutKayttajat()).data;
      logger.info('Käyttäjän tiedot', this.tiedot.value);
    }
    catch (err) {
      logger.error('Käyttäjän tietojen lataus epäonnistui', err.message);
    }
  }

  public async hasOikeus(oikeus: Oikeus, kohde: OikeusKohde = 'opetussuunnitelma') {
    if (!oikeus) {
      return false;
    }
    else if (oikeus === 'hallinta') {
      return this.hasHallintaoikeus(kohde);
    }
    else {
      return this.vertaa(oikeus, kohde);
    }
  }

  private vertaa(oikeus: Oikeus, kohde: OikeusKohde = 'opetussuunnitelma') {
    const haettu = getOikeusArvo(oikeus);
    if (haettu === 0) {
      return false;
    }
    else {
      const korkein = _.max(_.map(this.oikeudet.value[kohde], getOikeusArvo)) || 0;
      return korkein >= haettu;
    }
  }

  private hasHallintaoikeus(kohde) {
    return _.includes(this.oikeudet.value[kohde], 'luonti');
  }
}

export const Kayttajat = new KayttajaStore();
