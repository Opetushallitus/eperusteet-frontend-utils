import { axiosHandler } from './common';
import { Configuration } from '../generated/eperusteet';
import axios, { AxiosInstance } from 'axios';
import _ from 'lodash';
import {
  DokumentitApiAxiosParamCreator,
  LiitetiedostotApiAxiosParamCreator,
} from '../generated/eperusteet';
import * as EperusteetApi from '../generated/eperusteet';
import Qs from 'qs';
import { createLogger } from '../utils/logger';

const logger = createLogger('EperusteetAxios');
const basePath = '';
export const baseURL = '/eperusteet-service/api';

const ax = axios.create({
  baseURL,
  paramsSerializer: (params: any) => Qs.stringify(params, {arrayFormat: 'repeat'})
});

function successfulResponseHandler() {
  return async (res: any) => {
    return res;
  };
}

ax.interceptors.request.use(_.identity, axiosHandler('Request error'));
ax.interceptors.response.use(successfulResponseHandler(), axiosHandler('Response error'));

// https://github.com/Microsoft/TypeScript/issues/20719
type BaseAPIConstructor<T> = new(configuration?: Configuration, basePath?: string, axios?: AxiosInstance) => T;

const configuration: Configuration = { basePath };

function initApi<T>(X: BaseAPIConstructor<T>): T {
  return new X(configuration, basePath, ax);
}

export const Api = ax;
export const Perusteet = initApi(EperusteetApi.PerusteetApi);
export const Tiedotteet = initApi(EperusteetApi.TiedotteetApi);
export const Liitetiedostot = initApi(EperusteetApi.LiitetiedostotApi);
export const Dokumentit = initApi(EperusteetApi.DokumentitApi);
export const Perusteenosat = initApi(EperusteetApi.PerusteenosatApi);
export const Kayttajat = initApi(EperusteetApi.KayttajatApi);

export type PerusteDto = EperusteetApi.PerusteDto;
export type PerusteHakuDto = EperusteetApi.PerusteHakuDto;
export type PerusteKevytDto = EperusteetApi.PerusteKevytDto;
export type TiedoteDto = EperusteetApi.TiedoteDto;
export type PageTiedoteDto = EperusteetApi.PageTiedoteDto;
export type PerusteKoosteDto = EperusteetApi.PerusteKoosteDto;
export type Lops2019SisaltoDto = EperusteetApi.Lops2019SisaltoDto;
export type Laaja = EperusteetApi.Laaja;
export type Lops2019OppiaineKaikkiDto = EperusteetApi.Lops2019OppiaineKaikkiDto;
export type Lops2019ModuuliDto = EperusteetApi.Lops2019ModuuliDto;
export type Lops2019LaajaAlainenOsaaminenKokonaisuusDto = EperusteetApi.Lops2019LaajaAlainenOsaaminenKokonaisuusDto;
export type LiiteDto = EperusteetApi.LiiteDto;
export type KayttajanTietoDto = EperusteetApi.KayttajanTietoDto;
export type RevisionDto = EperusteetApi.Revision;

export const LiitetiedostotParam = LiitetiedostotApiAxiosParamCreator(configuration);
export const DokumentitParam = DokumentitApiAxiosParamCreator(configuration);

export interface PerusteQuery {
  sivu?: number;
  sivukoko?: number;
  tuleva?: boolean;
  siirtyma?: boolean;
  voimassaolo?: boolean;
  poistunut?: boolean;
  nimi?: string;
  koulutusala?: Array<string>;
  koulutustyyppi?: Array<string>;
  kieli?: Array<string>;
  opintoala?: Array<string>;
  suoritustapa?: string;
  koulutuskoodi?: string;
  diaarinumero?: string;
  muokattu?: number;
  tutkintonimikkeet?: boolean;
  tutkinnonosat?: boolean;
  osaamisalat?: boolean;
  koulutusvienti?: boolean;
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
  );
}
