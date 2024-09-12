import { axiosHandler, successfulResponseHandler } from './common';
import { Configuration } from '../generated/ai';
import axios, { AxiosInstance } from 'axios';
import _ from 'lodash';

import * as AiApi from '../generated/ai';
import Qs from 'qs';
import { createLogger } from '../utils/logger';

const logger = createLogger('AIAxios');
const basePath = '';
export const baseURL = '/eperusteet-ai-service';

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

export import FeedbackDtoResultEnum = AiApi.FeedbackDtoResultEnum;

export const Api = ax;

export const AssistantApi = initApi(AiApi.AssistantApi);
export const ChatApi = initApi(AiApi.ChatApi);
export const FileApi = initApi(AiApi.FileApi);
export const ModelApi = initApi(AiApi.ModelApi);
export const MessageApi = initApi(AiApi.MessageApi);

export type Thread = AiApi.Thread;
export type Assistant = AiApi.Assistant;
export type OpenaiMessage = AiApi.OpenaiMessage;
export type Run = AiApi.Run;
export type Model = AiApi.Model;
export type MessageDto = AiApi.MessageDto;
export type FeedbackDto = AiApi.FeedbackDto;
