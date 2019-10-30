import * as EperusteetApi from '../generated/eperusteet/api';
import * as YlopsApi from '../generated/ylops/api';


export interface LokalisoituTekstiDto {
  // id?: number;
  // tunniste?: string;
  [key: string]: string;
}

export interface ViiteLaaja extends EperusteetApi.PerusteenOsaViiteDto {
  lapset?: Array<object>;
}


export type PerusteDto = EperusteetApi.PerusteDto;
export type PerusteHakuDto = EperusteetApi.PerusteHakuDto;
export type TiedoteDto = EperusteetApi.TiedoteDto;
export type PageTiedoteDto = EperusteetApi.PageTiedoteDto;
export type PerusteKoosteDto = EperusteetApi.PerusteKoosteDto;
export type Lops2019SisaltoDto = EperusteetApi.Lops2019SisaltoDto;
export type PerusteenOsaViiteDtoObject = EperusteetApi.PerusteenOsaViiteDtoObject;
export type Matala = EperusteetApi.Matala;
export type Laaja = EperusteetApi.Laaja;
export type Lops2019OppiaineDto = EperusteetApi.Lops2019OppiaineDto;
export type Lops2019OppiaineKaikkiDto = EperusteetApi.Lops2019OppiaineKaikkiDto;
export type Lops2019ModuuliDto = EperusteetApi.Lops2019ModuuliDto;
export type Lops2019LaajaAlainenOsaaminenKokonaisuusDto = EperusteetApi.Lops2019LaajaAlainenOsaaminenKokonaisuusDto;
export type NavigationNodeDto = EperusteetApi.NavigationNodeDto;

export type OpetussuunnitelmaDto = YlopsApi.OpetussuunnitelmaDto
export type OpetussuunnitelmaInfoDto = YlopsApi.OpetussuunnitelmaInfoDto;
export type OpetussuunnitelmaJulkinenDto = YlopsApi.OpetussuunnitelmaJulkinenDto;
export type OpetussuunnitelmaKevytDto = YlopsApi.OpetussuunnitelmaKevytDto;
