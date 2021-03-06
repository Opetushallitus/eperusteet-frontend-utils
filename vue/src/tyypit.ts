import { Computed } from './utils/interfaces';
import { tutkintoonvalmentava } from './utils/perusteet';

export enum Kieli {
  fi = 'fi',
  sv = 'sv',
  se = 'se',
  ru = 'ru',
  en = 'en',
}

export interface SovellusVirhe {
  path?: string;
  err?: string;
  state?: object;
  info?: string;
}

export enum Koulutustyyppi {
  perustutkinto = 'koulutustyyppi_1',
  lukiokoulutus = 'koulutustyyppi_2',
  telma = 'koulutustyyppi_5',
  lisaopetus = 'koulutustyyppi_6',
  ammattitutkinto = 'koulutustyyppi_11',
  erikoisammattitutkinto = 'koulutustyyppi_12',
  aikuistenlukiokoulutus = 'koulutustyyppi_14',
  esiopetus = 'koulutustyyppi_15',
  perusopetus = 'koulutustyyppi_16',
  aikuistenperusopetus = 'koulutustyyppi_17',
  valma = 'koulutustyyppi_18',
  varhaiskasvatus = 'koulutustyyppi_20',
  perusopetusvalmistava = 'koulutustyyppi_22',
  lukiovalmistavakoulutus = 'koulutustyyppi_23',
  tpo = 'koulutustyyppi_999907',
  vapaasivistystyo = 'koulutustyyppi_10',
  maahanmuuttajienkotoutumiskoulutus = 'koulutustyyppi_30',
  vapaasivistystyolukutaito = 'koulutustyyppi_35',
  tutkintoonvalmentava = 'koulutustyyppi_40',
}

const ammatilliset = [Koulutustyyppi.ammattitutkinto, Koulutustyyppi.erikoisammattitutkinto, Koulutustyyppi.perustutkinto];
export const SallitutKoulutustyyppisiirtymat = Object.freeze({
  [Koulutustyyppi.ammattitutkinto]: ammatilliset,
  [Koulutustyyppi.perustutkinto]: ammatilliset,
  [Koulutustyyppi.erikoisammattitutkinto]: ammatilliset,
});

export enum KoulutustyyppiToteutus {
  yksinkertainen = 'yksinkertainen',
  perusopetus = 'perusopetus',
  lops = 'lops',
  lops2019 = 'lops2019',
  tpo = 'taiteenperusopetus',
  vst = 'vapaasivistystyo',
}

export type EditorLayout = 'minimal' | 'simplified' | 'normal';

export interface LokalisoituTekstiDto {
  [key: string]: string;
}

export interface IKayttaja {
  numero: number;
  pvm: Date;
  oidHenkilo: string;
  kutsumanimi?: string;
  sukunimi?: string;
  kommentti?: string;
}

export interface Revision {
  numero: number;
  pvm: Date;
  muokkaajaOid: string;
  nimi?: string;
  kutsumanimi?: string;
  sukunimi?: string;
  kommentti?: string;
  nykyinen?: boolean;
  kayttajanTieto?: any;
}

export type LiiteDtoWrapper = {
  id: string,
  kuva: any,
  src: string,
}

export type ServiceType = 'eperusteet-service' | 'eperusteet-ylops-service' | 'eperusteet-amosaa-service';

export interface Page<T> {
  data: T[];
  sivu: number;
  sivuja: number;
  sivukoko: number;
  kokonaismäärä: number;
}

export type Oikeus = 'luku' | 'kommentointi' | 'muokkaus' | 'luonti' | 'poisto' | 'tilanvaihto' | 'hallinta';
export type OikeusKohde = 'opetussuunnitelma' | 'pohja';

export type NavigationNodeType =
  | 'root'
  | 'tiedot'
  | 'kvliite'
  | 'viite' | 'taiteenala' | 'tekstikappale'
  | 'liitteet' | 'liite'
  | 'laajaalaiset' | 'laajaalainen'
  | 'oppiaineet' | 'oppimaarat' | 'oppiaine'
  | 'moduulit' | 'moduuli'
  | 'muodostuminen' | 'tutkinnonosat' | 'tutkinnonosa' | 'tutkinnonosaviite' | 'osaalue'
  | 'opintokokonaisuus' | 'tavoitesisaltoalue'
  | 'koulutuksenosa' | 'laajaalainenosaaminen' | 'koulutuksenosat'
  | 'koto_kielitaitotaso' | 'koto_opinto';

export interface NavigationNodeDto {
  id?: number;
  label?: LokalisoituTekstiDto;
  type?: NavigationNodeType;
  meta?: { [key: string]: object; };
  children?: NavigationNodeDto[];
}

export interface ILukko {
  haltijaOid?: string;
  haltijaNimi?: string;
  luotu?: Date;
  vanhentuu?: Date;
  oma?: boolean;
  revisio?: number;
}

export enum OrganisaatioTyyppi {
  Muu = 'Muu organisaatio',
  Varhaiskasvatus = 'Varhaiskasvatuksen jarjestaja',
  Oppilaitos = 'Oppilaitos',
  Toimija = 'Koulutustoimija',
}

export type DiagrammiVarit = 'vaalea_sininen' | 'vihrea_sininen';

export interface OrganisaatioDto {
  oid: string;
}

export interface SideMenuEntry {
  item: SideMenuItem,
  route?: SideMenuRoute,
  flatten?: boolean,
  children?: Array<SideMenuEntry>,
  parent?: SideMenuEntry,
  allowEmpty?: boolean,
}

export interface SideMenuItem {
  type: string,
  i18key?: string | string[],
  objref?: object,
  prefix?: string,
  hideChevron?: boolean,
  order?: string,
}

export interface SideMenuRoute {
  name: string,
  params: object,
  query?: object,
}

export interface RecursiveTreeItem {
  id: number;
}

export interface OpintojaksoModuuliSource {
  id: number;
  koodi: string;
  moduulit?: any[];
}

export interface TiedoteDto {
    id?: number;
    perusteprojekti?: object;
    peruste?: any[];
    julkinen?: boolean;
    yleinen?: boolean;
    otsikko?: LokalisoituTekstiDto;
    sisalto?: LokalisoituTekstiDto;
    julkaisupaikat?: string[];
    koulutustyypit?: string[];
    perusteet?: any[];
    luotu?: Date;
    luoja?: string;
    nimi?: string;
    muokattu?: Date;
    muokkaaja?: string;
}

export interface IDokumenttiStore {
  dokumentti: Computed<any>,
  dokumenttiHref: Computed<string>,
  polling: Computed<any>,
  luoPdf: () => void,
}

export enum EperusteetPalautekanava {
  opintopolku = 'eperusteet-opintopolku',
  eperusteet = 'eperusteet-laadinta',
  amosaa = 'eperusteet-amosaa',
  vst = 'eperusteet-vst',
  ylops = 'eperusteet-ylops',
  tuva = 'eperusteet-tuva',
}
