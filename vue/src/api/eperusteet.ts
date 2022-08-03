import { axiosHandler, successfulResponseHandler } from './common';
import { Configuration,
  DokumentitApiAxiosParamCreator,
  LiitetiedostotApiAxiosParamCreator,
} from '../generated/eperusteet';
import axios, { AxiosInstance } from 'axios';
import _ from 'lodash';

import * as EperusteetApi from '../generated/eperusteet';
import Qs from 'qs';
import { createLogger } from '../utils/logger';

export import PerusteprojektiLuontiDtoTyyppiEnum = EperusteetApi.PerusteprojektiLuontiDtoTyyppiEnum;
export import NavigationNodeDtoTypeEnum = EperusteetApi.NavigationNodeDtoTypeEnum;
export import PerusteDtoTyyppiEnum = EperusteetApi.PerusteDtoTyyppiEnum;
export import DokumenttiDtoTilaEnum = EperusteetApi.DokumenttiDtoTilaEnum;
export import PerusteDtoTilaEnum = EperusteetApi.PerusteDtoTilaEnum;
export import PerusteprojektiLuontiKuvausEnum = EperusteetApi.PerusteprojektiLuontiDtoProjektiKuvausEnum;
export import PerusteDtoToteutusEnum = EperusteetApi.PerusteDtoToteutusEnum;
export import KoulutuksenOsaDtoKoulutusOsanKoulutustyyppiEnum = EperusteetApi.KoulutuksenOsaDtoKoulutusOsanKoulutustyyppiEnum;
export import StatusValidointiStatusTypeEnum = EperusteetApi.StatusValidointiStatusTypeEnum;
export import StatusValidointiKategoriaEnum = EperusteetApi.StatusValidointiKategoriaEnum;
export import PerusteAikatauluDtoTapahtumaEnum = EperusteetApi.PerusteAikatauluDtoTapahtumaEnum;
export import PalauteDtoStatusEnum = EperusteetApi.PalauteDtoStatusEnum;
export import PerusteprojektiKevytDtoTyyppiEnum = EperusteetApi.PerusteprojektiKevytDtoTyyppiEnum;
export import PerusteprojektiDtoTilaEnum = EperusteetApi.PerusteprojektiDtoTilaEnum;
export import KoulutuksenOsaDtoKoulutusOsanTyyppiEnum = EperusteetApi.KoulutuksenOsaDtoKoulutusOsanTyyppiEnum;
export import PoistettuSisaltoDtoTyyppiEnum = EperusteetApi.PoistettuSisaltoDtoTyyppiEnum;

const logger = createLogger('EperusteetAxios');
const basePath = '';
export const baseURL = '/eperusteet-service/api';

const ax = axios.create({
  baseURL,
  paramsSerializer: (params: any) => Qs.stringify(params, { arrayFormat: 'repeat' }),
});

ax.interceptors.request.use(_.identity, axiosHandler('Request error'));
ax.interceptors.response.use(successfulResponseHandler(), axiosHandler('Response error'));

// https://github.com/Microsoft/TypeScript/issues/20719
type BaseAPIConstructor<T> = new(configuration?: Configuration, basePath?: string, axios?: AxiosInstance) => T;

const configuration: Configuration = { basePath };

function initApi<T>(X: BaseAPIConstructor<T>): T {
  return new X(configuration, basePath, ax);
}

export const Api = ax;

export const Aikataulut = initApi(EperusteetApi.AikataulutApi);
export const Aipeopetuksensisalto = initApi(EperusteetApi.AipeopetuksensisaltoApi);
export const Ammattitaitovaatimukset = initApi(EperusteetApi.AmmattitaitovaatimuksetApi);
export const Arviointiasteikot = initApi(EperusteetApi.ArviointiasteikotApi);
export const Dokumentit = initApi(EperusteetApi.DokumentitApi);
export const DokumentitParams = DokumentitApiAxiosParamCreator(configuration);
export const GeneerinenArviointiasteikko = initApi(EperusteetApi.GeneerinenArviointiasteikkoApi);
export const Julkaisut = initApi(EperusteetApi.JulkaisutApi);
export const Kayttajat = initApi(EperusteetApi.KayttajatApi);
export const Koodisto = initApi(EperusteetApi.KoodistoApi);
export const Liitetiedostot = initApi(EperusteetApi.LiitetiedostotApi);
export const Lokalisointi = initApi(EperusteetApi.LokalisointiApi);
export const Lops2019 = initApi(EperusteetApi.Lops2019Api);
export const Maintenance = initApi(EperusteetApi.MaintenanceApi);
export const Muokkaustiedot = initApi(EperusteetApi.MuokkaustietoApi);
export const Oppaat = initApi(EperusteetApi.OppaatApi);
export const OsaAlueet = initApi(EperusteetApi.OsaAlueetApi);
export const PerusopetuksenPerusteenSisalto = initApi(EperusteetApi.PerusopetuksenPerusteenSisaltoApi);
export const PerusteenOsatApi = initApi(EperusteetApi.PerusteenosatApi);
export const Perusteenosat = initApi(EperusteetApi.PerusteenosatApi);
export const Perusteet = initApi(EperusteetApi.PerusteetApi);
export const Perusteprojektit = initApi(EperusteetApi.PerusteprojektitApi);
export const Sisallot = initApi(EperusteetApi.SisallotApi);
export const Termit = initApi(EperusteetApi.TermitApi);
export const Tiedotteet = initApi(EperusteetApi.TiedotteetApi);
export const TutkinnonRakenne = initApi(EperusteetApi.TutkinnonRakenneApi);
export const Tutkinnonosat = initApi(EperusteetApi.TutkinnonosatApi);
export const TutkinnonosatPrivate = initApi(EperusteetApi.TutkinnonosatPrivateApi);
export const Ulkopuoliset = initApi(EperusteetApi.UlkopuolisetApi);
export const Tilastot = initApi(EperusteetApi.TilastotApi);
export const Palautteet = initApi(EperusteetApi.PalautteetApi);
export const LukioperusteenJulkisetTiedot = initApi(EperusteetApi.LukioperusteenJulkisetTiedotApi);
export const Maaraykset = initApi(EperusteetApi.MaarayksetApi);
export const PoistettuSisalto = initApi(EperusteetApi.PoistettuSisaltoApi);

export type Ammattitaitovaatimukset2019Dto = EperusteetApi.Ammattitaitovaatimukset2019Dto;
export type ArviointiAsteikkoDto = EperusteetApi.ArviointiAsteikkoDto;
export type GeneerinenArviointiasteikkoDto = EperusteetApi.GeneerinenArviointiasteikkoDto;
export type KayttajanTietoDto = EperusteetApi.KayttajanTietoDto;
export type KoodistoKoodiDto = EperusteetApi.KoodistoKoodiDto;
export type Laaja = EperusteetApi.Laaja;
export type LiiteDto = EperusteetApi.LiiteDto;
export type Lops2019LaajaAlainenOsaaminenKokonaisuusDto = EperusteetApi.Lops2019LaajaAlainenOsaaminenKokonaisuusDto;
export type Lops2019ModuuliDto = EperusteetApi.Lops2019ModuuliDto;
export type Lops2019OppiaineDto = EperusteetApi.Lops2019OppiaineDto;
export type Lops2019OppiaineKaikkiDto = EperusteetApi.Lops2019OppiaineKaikkiDto;
export type Lops2019SisaltoDto = EperusteetApi.Lops2019SisaltoDto;
export type Matala = EperusteetApi.Matala;
export type MuokkaustietoKayttajallaDto = EperusteetApi.MuokkaustietoKayttajallaDto;
export type NavigationNodeDto = EperusteetApi.NavigationNodeDto;
export type PageTiedoteDto = EperusteetApi.PageTiedoteDto;
export type PerusteDto = EperusteetApi.PerusteDto;
export type PerusteHakuDto = EperusteetApi.PerusteHakuDto;
export type PerusteHakuInternalDto = EperusteetApi.PerusteHakuInternalDto;
export type PerusteKevytDto = EperusteetApi.PerusteKevytDto;
export type PerusteInfoDto = EperusteetApi.PerusteInfoDto;
export type PerusteKoosteDto = EperusteetApi.PerusteKoosteDto;
export type PerusteBaseDto = EperusteetApi.PerusteBaseDto;
export type PerusteprojektiDto = EperusteetApi.PerusteprojektiDto;
export type PerusteprojektiKevytDto = EperusteetApi.PerusteprojektiKevytDto;
export type PerusteprojektiListausDto = EperusteetApi.PerusteprojektiListausDto;
export type PerusteprojektiLuontiDto = EperusteetApi.PerusteprojektiLuontiDto;
export type RakenneModuuliDto = EperusteetApi.RakenneModuuliDto;
export type RevisionDto = EperusteetApi.Revision;
export type TermiDto = EperusteetApi.TermiDto;
export type TiedoteDto = EperusteetApi.TiedoteDto;
export type TilaUpdateStatus = EperusteetApi.TilaUpdateStatus;
export type TutkinnonOsaViiteDto = EperusteetApi.TutkinnonOsaViiteDto;
export type TutkinnonOsaViiteUpdateDto = EperusteetApi.TutkinnonOsaViiteUpdateDto;
export type TyoryhmaHenkiloDto = EperusteetApi.TyoryhmaHenkiloDto;
export type UpdateDtoRakenneModuuliDto = EperusteetApi.UpdateDtoRakenneModuuliDto;
export type OpasLuontiDto = EperusteetApi.OpasLuontiDto;
export type DokumenttiDto = EperusteetApi.DokumenttiDto;
export type TekstiKappaleDto = EperusteetApi.TekstiKappaleDto;
export type ArvioinninKohdealueDto = EperusteetApi.ArvioinninKohdealueDto;
export type VuosiluokkaKokonaisuusDto = EperusteetApi.VuosiluokkaKokonaisuusDto;
export type OppiaineDto = EperusteetApi.OppiaineDto;
export type AIPEVaiheDto = EperusteetApi.AIPEVaiheDto;
export type AIPEOppiaineDto = EperusteetApi.AIPEOppiaineDto;
export type AIPEOppiaineSuppeaDto = EperusteetApi.AIPEOppiaineSuppeaDto;
export type AIPEKurssiDto = EperusteetApi.AIPEKurssiDto;
export type LaajaalainenOsaaminenDto = EperusteetApi.LaajaalainenOsaaminenDto;
export type KoulutuksenOsaDto = EperusteetApi.KoulutuksenOsaDto;
export type TutkinnonOsaDto = EperusteetApi.TutkinnonOsaDto;
export type TutkinnonOsaViiteKontekstiDto = EperusteetApi.TutkinnonOsaViiteKontekstiDto;
export type TutkinnonOsaViiteLuontiDto = EperusteetApi.TutkinnonOsaViiteLuontiDto;
export type OsaamistasoDto = EperusteetApi.OsaamistasoDto;
export type PalauteDto = EperusteetApi.PalauteDto;
export type Status = EperusteetApi.Status;
export type KoodiDto = EperusteetApi.KoodiDto;
export type TuvaLaajaalainenOsaaminenDto = EperusteetApi.TuvaLaajaAlainenOsaaminenDto;
export type LukioOppiaineOppimaaraNodeDto = EperusteetApi.LukioOppiaineOppimaaraNodeDto;
export type MaaraysDto = EperusteetApi.MaaraysDto;
export type PerusteKaikkiDto = EperusteetApi.PerusteKaikkiDto;
export type PerusteenJulkaisuData = EperusteetApi.PerusteenJulkaisuData;
export type KoulutustyyppiLukumaara = EperusteetApi.KoulutustyyppiLukumaara;
export type PoistettuSisaltoDto = EperusteetApi.PoistettuSisaltoDto;

export const DokumentitParam = DokumentitApiAxiosParamCreator(configuration);
export const LiitetiedostotParam = LiitetiedostotApiAxiosParamCreator(configuration);

export interface PerusteprojektiQuery {
  diaarinumero?: string;
  nimi?: string;
  tila?: string[];
  koulutustyyppi?: string[];
  tyyppi?: string;
  jarjestysTapa?: string;
  jarjestysOrder?: boolean;
};

export async function getPerusteprojektit(query: PerusteprojektiQuery) {
  return Perusteprojektit.getAllPerusteprojektitKevyt({ params: query });
}

export interface PerusteQuery {
  diaarinumero?: string;
  kieli?: string[];
  koulutusala?: string[];
  koulutuskoodi?: string;
  koulutustyyppi?: string[];
  koulutusvienti?: boolean;
  muokattu?: number;
  nimi?: string;
  opintoala?: string[];
  osaamisalat?: boolean;
  poistunut?: boolean;
  siirtyma?: boolean;
  sivu?: number;
  sivukoko?: number;
  suoritustapa?: string;
  tila?: string[];
  tuleva?: boolean
  tutkinnonosat?: boolean;
  tutkintonimikkeet?: boolean;
  voimassaolo?: boolean;
  perusteTyyppi?: string;
  perusteet?: number[];
  jarjestysOrder?: boolean,
  jarjestysTapa?: string,
  julkaistu?: boolean,
  tutkinnonosaKoodit?: Array<string>,
  osaamisalaKoodit?: Array<string>,
};

export async function getAllPerusteet(query: PerusteQuery) {
  return Perusteet.getAllPerusteet(
    query.sivu,
    query.sivukoko,
    query.tuleva,
    query.siirtyma,
    query.voimassaolo,
    query.poistunut,
    query.nimi,
    query.koulutusala,
    query.koulutustyyppi,
    query.kieli,
    query.opintoala,
    query.suoritustapa,
    query.koulutuskoodi,
    query.diaarinumero,
    query.muokattu,
    query.tutkintonimikkeet,
    query.tutkinnonosat,
    query.osaamisalat,
    query.koulutusvienti,
    query.perusteTyyppi,
    query.julkaistu,
    query.tutkinnonosaKoodit,
    query.osaamisalaKoodit,
  );
}

export interface ViiteLaaja extends EperusteetApi.PerusteenOsaViiteDto {
  lapset?: Array<object>;
}

export async function getAllPerusteetInternal(query: PerusteQuery) {
  return Perusteet.getAllPerusteetInternal(
    query.sivu,
    query.sivukoko,
    query.tuleva,
    query.siirtyma,
    query.voimassaolo,
    query.poistunut,
    query.nimi,
    query.koulutusala,
    query.koulutustyyppi,
    query.kieli,
    query.opintoala,
    query.suoritustapa,
    query.koulutuskoodi,
    query.diaarinumero,
    query.muokattu,
    query.tutkintonimikkeet,
    query.tutkinnonosat,
    query.osaamisalat,
    query.koulutusvienti,
    query.tila,
    query.perusteTyyppi,
    query.julkaistu,
  );
}

export async function getKaannokset(palvelu) {
  try {
    const kaannokset = await Promise.all(_.map(['fi', 'sv', 'en'], lang => Lokalisointi.getPalveluKaannokset(palvelu, lang)));
    const [fi, sv, en] = _.map(kaannokset, 'data');
    return { fi, sv, en } as any;
  }
  catch (e) {
    return {};
  }
}

export interface TiedotteetQuery {
  sivu?: number;
  sivukoko?: number;
  kieli?: Array<string>;
  nimi?: string;
  perusteId?: number;
  perusteeton?: boolean;
  ulkinen?: boolean;
  yleinen?: boolean;
  tiedoteJulkaisuPaikka?: Array<string>;
  perusteIds?: Array<number>,
  koulutusTyyppi?: Array<string>;
  jarjestys?: string;
  jarjestysNouseva?: boolean;
  koulutustyypiton?: boolean;
};

export async function findTiedotteetBy(query: TiedotteetQuery) {
  return Tiedotteet.findTiedotteetBy(
    query.sivu,
    query.sivukoko,
    query.kieli,
    query.nimi,
    query.perusteId,
    query.perusteeton,
    query.ulkinen,
    query.yleinen,
    query.tiedoteJulkaisuPaikka,
    query.perusteIds,
    query.koulutusTyyppi,
    query.jarjestys,
    query.jarjestysNouseva,
    query.koulutustyypiton,
  );
}

export interface OppaatQuery {
  sivu?: number;
  sivukoko?: number;
  nimi?: string;
  kieli?: string;
  muokattu?: number;
  koulutustyyppi?: Array<string>;
  tuleva?: boolean;
  voimassaolo?: boolean;
}

export async function findAllOppaat(query: OppaatQuery) {
  return Oppaat.getAllOppaat(
    query.sivu,
    query.sivukoko,
    query.nimi,
    query.kieli,
    query.muokattu,
    query.koulutustyyppi,
    query.tuleva,
    query.voimassaolo,
  );
}
