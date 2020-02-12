import * as EperusteetApi from '../generated/eperusteet/api';
import * as YlopsApi from '../generated/ylops/api';

export interface LokalisoituTekstiDto {
  // id?: number;
  // tunniste?: string;
  [key: string]: string;
}

export type LiiteDtoWrapper = {
  id: string,
  kuva: LiiteDto,
  src: string,
}

export type ServiceType =
    'eperusteet-service' | 'eperusteet-ylops-service' | 'eperusteet-amosaa-service';

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

export type OpetussuunnitelmaDto = YlopsApi.OpetussuunnitelmaDto
export type OpetussuunnitelmaInfoDto = YlopsApi.OpetussuunnitelmaInfoDto;
export type OpetussuunnitelmaJulkinenDto = YlopsApi.OpetussuunnitelmaJulkinenDto;
export type OpetussuunnitelmaKevytDto = YlopsApi.OpetussuunnitelmaKevytDto;
export type Lops2019OpintojaksoDto = YlopsApi.Lops2019OpintojaksoDto;
export type TekstiKappaleViiteKevytDto = YlopsApi.TekstiKappaleViiteKevytDto;
export type TekstiKappaleKevytDto = YlopsApi.TekstiKappaleKevytDto;
export type TekstiKappaleDto = YlopsApi.TekstiKappaleDto;
export type Puu = YlopsApi.Puu;
export type PerusteTekstiKappaleViiteDto = YlopsApi.PerusteTekstiKappaleViiteDto;
export type PerusteTekstiKappaleViiteMatalaDto = YlopsApi.PerusteTekstiKappaleViiteMatalaDto;
export type Lops2019OpintojaksonModuuliDto = YlopsApi.Lops2019OpintojaksonModuuliDto;
export type Lops2019PaikallinenOppiaineDto = YlopsApi.Lops2019PaikallinenOppiaineDto;
export type KoodistoKoodiDto = YlopsApi.KoodistoKoodiDto;
export type RevisionDto = YlopsApi.RevisionDto;
