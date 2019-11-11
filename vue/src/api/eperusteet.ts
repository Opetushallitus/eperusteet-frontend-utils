import { axiosHandler } from './common';
import { Configuration } from '../generated/eperusteet';
import axios, { AxiosInstance } from 'axios';
import _ from 'lodash';
import {
  DokumentitApi,
  DokumentitApiAxiosParamCreator,
  LiitetiedostotApi,
  LiitetiedostotApiAxiosParamCreator,
  LokalisointiApi,
  Lops2019Api,
  PerusteenosatApi,
  PerusteetApi,
  SisallotApi,
  TermitApi,
  TiedotteetApi,
} from '../generated/eperusteet';
import Qs from 'qs';
import { createLogger } from '../utils/logger';

const logger = createLogger('EperusteetAxios');
const basePath = '';
export const baseURL = '/eperusteet-service/api';

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

const configuration: Configuration = { basePath };

function initApi<T>(X: BaseAPIConstructor<T>): T {
  return new X(configuration, basePath, ax);
}

export const Api = ax;
export const Perusteet = initApi(PerusteetApi);
export const Tiedotteet = initApi(TiedotteetApi);
export const Liitetiedostot = initApi(LiitetiedostotApi);
export const LiitetiedostotParam = LiitetiedostotApiAxiosParamCreator(configuration);
export const Dokumentit = initApi(DokumentitApi);
export const DokumentitParam = DokumentitApiAxiosParamCreator(configuration);
export const Sisallot = initApi(SisallotApi);
export const Perusteenosat = initApi(PerusteenosatApi);
export const Lops2019 = initApi(Lops2019Api);
export const Termit = initApi(TermitApi);
export const Lokalisointi = initApi(LokalisointiApi);
