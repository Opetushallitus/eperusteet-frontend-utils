import { axiosHandler, successfulResponseHandler } from './common';
import { Configuration, JulkinenApiAxiosParamCreator, LiitetiedostotApiAxiosParamCreator } from '../generated/amosaa';
import axios, { AxiosInstance } from 'axios';
import _ from 'lodash';

import * as AmosaaApi from '../generated/amosaa';
import Qs from 'qs';
import { createLogger } from '../utils/logger';
import { DokumentitApiAxiosParamCreator } from '@shared/generated/ylops';

const logger = createLogger('AmosaaAxios');
const basePath = '';
export const baseURL = '/eperusteet-amosaa-service/api';

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

export const JulkinenApi = initApi(AmosaaApi.JulkinenApi);
export const JulkinenApiParams = JulkinenApiAxiosParamCreator(configuration);
export const Ohjeet = initApi(AmosaaApi.OhjeetApi);
export const Opetussuunnitelmat = initApi(AmosaaApi.OpetussuunnitelmatApi);
export const Aikataulut = initApi(AmosaaApi.AikataulutApi);
export const Sisaltoviitteet = initApi(AmosaaApi.SisaltoviitteetApi);
export const Muokkaustiedot = initApi(AmosaaApi.MuokkaustietoApi);
export const KayttajaApi = initApi(AmosaaApi.KayttajaApi);
export const Perusteet = initApi(AmosaaApi.PerusteetApi);
export const Koulutustoimijat = initApi(AmosaaApi.KoulutustoimijatApi);
export const Ulkopuoliset = initApi(AmosaaApi.UlkopuolisetApi);
export const Koodistot = initApi(AmosaaApi.KoodistotApi);
export const Arviointiasteikot = initApi(AmosaaApi.ArviointiasteikotApi);
export const SisaltoviiteLukko = initApi(AmosaaApi.SisaltoviiteLukkoApi);
export const Liitetiedostot = initApi(AmosaaApi.LiitetiedostotApi);
export const LiitetiedostotParam = LiitetiedostotApiAxiosParamCreator(configuration);

export type KoulutustoimijaJulkinenDto = AmosaaApi.KoulutustoimijaJulkinenDto;
export type OhjeDto = AmosaaApi.OhjeDto;
export type OpetussuunnitelmaDto = AmosaaApi.OpetussuunnitelmaDto;
export type OpetussuunnitelmaBaseDto = AmosaaApi.OpetussuunnitelmaBaseDto;
export type PageOpetussuunnitelmaDto = AmosaaApi.PageOpetussuunnitelmaDto;
export type PageOpetussuunnitelmaBaseDto = AmosaaApi.PageOpetussuunnitelmaBaseDto;
export type OpetussuunnitelmaAikatauluDto = AmosaaApi.OpetussuunnitelmaAikatauluDto;
export type SisaltoViiteKevytDto = AmosaaApi.SisaltoViiteKevytDto;
export type OpetussuunnitelmaMuokkaustietoDto = AmosaaApi.OpetussuunnitelmaMuokkaustietoDto;
export type EtusivuDto = AmosaaApi.EtusivuDto;
export type NavigationNodeDto = AmosaaApi.NavigationNodeDto;
export type KoulutustoimijaBaseDto = AmosaaApi.KoulutustoimijaBaseDto;
export type PerusteDto = AmosaaApi.PerusteDto;
export type TiedoteDto = AmosaaApi.TiedoteDto;
export type OpetussuunnitelmaLuontiDto = AmosaaApi.OpetussuunnitelmaLuontiDto;
export type VapaaTekstiDto = AmosaaApi.VapaaTekstiDto;
export type TutkinnonosaToteutusDto = AmosaaApi.TutkinnonosaToteutusDto;
export type TutkinnonosaDto = AmosaaApi.TutkinnonosaDto;
export type SisaltoviiteMatalaDto = AmosaaApi.Matala;
export type DokumenttiDto = AmosaaApi.DokumenttiDto;
export type Matala = AmosaaApi.Matala;
export type ArviointiasteikkoDto = AmosaaApi.ArviointiasteikkoDto;
export type OpetussuunnitelmaTilastoDto = AmosaaApi.OpetussuunnitelmaTilastoDto;

export import SisaltoViiteKevytDtoTyyppiEnum = AmosaaApi.SisaltoViiteKevytDtoTyyppiEnum;
export import TutkinnonOsaKevytDtoTyyppiEnum = AmosaaApi.TutkinnonOsaKevytDtoTyyppiEnum;
export import OpetussuunnitelmaMuokkaustietoDtoTapahtumaEnum = AmosaaApi.OpetussuunnitelmaMuokkaustietoDtoTapahtumaEnum;
export import OpetussuunnitelmaMuokkaustietoDtoKohdeEnum = AmosaaApi.OpetussuunnitelmaMuokkaustietoDtoKohdeEnum;
export import PerusteDtoKoulutustyyppiEnum = AmosaaApi.PerusteDtoKoulutustyyppiEnum;
export import MatalaTyyppiEnum = AmosaaApi.MatalaTyyppiEnum;
export import DokumenttiDtoTilaEnum = AmosaaApi.DokumenttiDtoTilaEnum;
export import TutkinnonosaDtoTyyppiEnum = AmosaaApi.TutkinnonosaDtoTyyppiEnum;
export import OpetussuunnitelmaTilastoDtoTilaEnum = AmosaaApi.OpetussuunnitelmaTilastoDtoTilaEnum;

export interface OpetussuunnitelmaQuery {
  perusteenDiaarinumero?: string;
  perusteId?: number;
  organisaatio?: string;
  tyyppi?: Array<string>;
  sivu?: number;
  sivukoko?: number;
  nimi?: string;
  kieli?: string;
};

export async function getJulkisetOpetussuunnitelmat(query: OpetussuunnitelmaQuery) {
  return JulkinenApi.findOpetussuunnitelmat(
    query.perusteenDiaarinumero,
    query.perusteId,
    query.organisaatio,
    query.tyyppi,
    query.sivu,
    query.sivukoko,
    query.nimi,
    query.kieli
  );
}
