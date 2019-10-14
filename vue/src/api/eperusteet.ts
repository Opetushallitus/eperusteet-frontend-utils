import { Configuration } from '../generated/eperusteet';
import axios, { AxiosInstance } from 'axios';
import _ from 'lodash';
import {
  PerusteetApi,
  TiedotteetApi,
  LiitetiedostotApi,
  LiitetiedostotApiAxiosParamCreator,
  DokumentitApi,
  DokumentitApiAxiosParamCreator,
} from '../generated/eperusteet';

const basePath = '';
export const baseURL = '/eperusteet-service/api';

const ax = axios.create({
  baseURL,
});

function axiosHandler(msg: string) {
  return async (err: any) => {
    console.error(msg as any, err);
    throw err;
  };
}

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

