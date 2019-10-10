import * as EperusteetApi from '../generated/eperusteet/api';
import * as YlopsApi from '../generated/ylops/api';


export interface LokalisoituTekstiDto {
  // id?: number;
  // tunniste?: string;
  [key: string]: string;
}


export type PerusteDto = EperusteetApi.PerusteDto;
export type PerusteHakuDto = EperusteetApi.PerusteHakuDto;
export type TiedoteDto = EperusteetApi.TiedoteDto;
export type PageTiedoteDto = EperusteetApi.PageTiedoteDto;
export type PerusteKoosteDto = EperusteetApi.PerusteKoosteDto;

export type OpetussuunnitelmaDto = YlopsApi.OpetussuunnitelmaDto
export type OpetussuunnitelmaInfoDto = YlopsApi.OpetussuunnitelmaInfoDto;
export type OpetussuunnitelmaJulkinenDto = YlopsApi.OpetussuunnitelmaJulkinenDto;
