import { axiosHandler } from './common';
import { Configuration } from '../generated/ylops';
import axios, { AxiosInstance } from 'axios';
import _ from 'lodash';
import {
  DokumentitApi,
  DokumentitApiAxiosParamCreator,
  KayttajatApi,
  KommentitApi,
  KysymyksetApi,
  LiitetiedostotApi,
  Lops2019Api,
  Lops2019OpintojaksotApi,
  Lops2019OppiaineetApi,
  Lops2019PerusteControllerApi,
  OhjeetApi,
  OpetussuunnitelmanSisaltoApi,
  OpetussuunnitelmatApi,
  OpetussuunnitelmatJulkisetApi,
  TermistoApi,
  UlkopuolisetApi,
} from '../generated/ylops';
import Qs from 'qs';
import { createLogger } from '../utils/logger';

const logger = createLogger('YlopsAxios');
const basePath = '';
export const baseURL = '/eperusteet-ylops-service/api';

const ax = axios.create({
  baseURL,
  paramsSerializer: params => Qs.stringify(params, {arrayFormat: 'repeat'})
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

const configuration = { basePath };

function initApi<T>(X: BaseAPIConstructor<T>): T {
  return new X(configuration, basePath, ax);
}

export const Api = ax;
export const Dokumentit = initApi(DokumentitApi);
export const DokumentitParam = DokumentitApiAxiosParamCreator(configuration);
export const Kayttajat = initApi(KayttajatApi);
export const Kommentit = initApi(KommentitApi);
export const Kysymykset = initApi(KysymyksetApi);
export const Liitetiedostot = initApi(LiitetiedostotApi);
export const Lops2019 = initApi(Lops2019Api);
export const Lops2019Perusteet = initApi(Lops2019PerusteControllerApi);
export const Ohjeet = initApi(OhjeetApi);
export const OpetussuunnitelmanSisalto = initApi(OpetussuunnitelmanSisaltoApi);
export const Opetussuunnitelmat = initApi(OpetussuunnitelmatApi);
export const OpetussuunnitelmatJulkiset = initApi(OpetussuunnitelmatJulkisetApi);
export const Opintojaksot = initApi(Lops2019OpintojaksotApi);
export const Oppiaineet = initApi(Lops2019OppiaineetApi);
export const Termisto = initApi(TermistoApi);
export const Ulkopuoliset = initApi(UlkopuolisetApi);

