import { NavigationNodeDto, LokalisoituTekstiDto } from '../tyypit';
import _ from 'lodash';
import { Kielet } from '../stores/kieli';
import { Location } from 'vue-router';
import { PerusteBaseDtoOpasTyyppiEnum, PerusteKaikkiDtoTyyppiEnum } from '@shared/api/eperusteet';

export type NavigationType =
  'root' | 'linkki' | 'viite' | 'tiedot' | 'laajaalaiset' | 'muutoshistoria'
  | 'oppiaineet' | 'oppiaine' | 'oppimaarat' | 'poppiaine' | 'lukiooppiaine_2015' | 'lukiooppimaarat_2015' | 'lukiokurssit' | 'lukiokurssi'
  | 'moduulit' | 'moduuli'
  | 'suorituspolku' | 'osasuorituspolku'
  | 'opintojaksot' | 'opintojakso'
  | 'perusopetusoppiaineet' | 'perusopetusoppiaine' | 'valinnaisetoppiaineet' | 'vuosiluokkakokonaisuus';

export interface NavigationNode {
  key?: number; // Unique identifier
  label?: LokalisoituTekstiDto | string;
  type: NavigationType;
  children: Array<NavigationNode>;
  path: NavigationNode[]; // parent polku rootiin saakka, alkioiden määrä määrittää syvyyden. Sisältää myös nykyisen.
  meta?: { [key: string]: object; };
  location?: Location;
  isMatch?: boolean;
  isVisible?: boolean;
  id?: number;
}

export interface NavigationFilter {
  label: string;
  isEnabled: boolean;
}

export function buildNavigation(
  rawNavigation: NavigationNodeDto,
  tiedot: NavigationNode | NavigationNode[] | null,
  isOps = false,
  revision?: string,
) {
  const navigation = traverseNavigation(rawNavigation, isOps, revision);
  const rakenne = buildRoot(rawNavigation, [
    ...(_.isArray(tiedot) ? tiedot : _.isObject(tiedot) ? [tiedot] : []),
    ...navigation!.children,
  ]);
  setParents(rakenne, [rakenne]);
  return rakenne;
}

export function navigationNodeDtoToPerusteRoute(node: NavigationNodeDto) {
  switch (node.type as string) {
  case 'tutkinnonosaviite':
    return {
      name: 'tutkinnonosa',
      params: {
        tutkinnonOsaId: _.toString(node.id),
      },
    };
  case 'osaamiskokonaisuus':
    return {
      name: 'osaamiskokonaisuus',
      params: {
        osaamiskokonaisuusId: _.toString(node.id),
      },
    };
  case 'osaamiskokonaisuus_paa_alue':
    return {
      name: 'osaamiskokonaisuus_paa_alue',
      params: {
        osaamiskokonaisuusId: '840',
        osaamiskokonaisuusPaaAlueId: _.toString(node.id),
      },
    };
  }

  return {};
}

export function traverseNavigation(rawNode: NavigationNodeDto, isOps: boolean, revision?: string): NavigationNode {
  const node: NavigationNode = {
    label: rawNode.label as LokalisoituTekstiDto,
    type: rawNode.type as NavigationType,
    children: _.map(rawNode.children, child => traverseNavigation(child, isOps, revision)),
    path: [], // setParents asettaa polun
    meta: rawNode.meta,
    id: rawNode.id,
  };

  if (isOps) {
    setOpetussuunnitelmaData(node, rawNode);
  }
  else {
    setPerusteData(node, rawNode);
  }

  if (node.location) {
    node.location = {
      ...node.location,
      params: {
        ...(!!node.location?.params && node.location.params),
        ...(revision && { revision }),
      },
    };
  }

  return node;
}

interface OsanTyypillinen {
  id?: number | string;
  tutkinnonosaViiteId?: number;
  oppiaine?: { id: number};
  koodi?: { uri: string };
  perusteenOsa: {
    osanTyyppi?: string;
    id?: number | string;
    nimi?: LokalisoituTekstiDto;
  },
  vaihe?: { id: number };
  taiteenalaId?: number;
  taiteenOsa?: string;
}

export function osaToLocation(osa: OsanTyypillinen): Location {
  switch (osa.perusteenOsa.osanTyyppi) {
  case 'tekstikappale':
    return {
      name: 'perusteTekstikappale',
      params: {
        viiteId: String(osa.id),
      },
    };
  case 'opintokokonaisuus':
    return {
      name: 'perusteOpintokokonaisuus',
      params: {
        opintokokonaisuusId: String(osa.id),
      },
    };
  case 'laajaalainenosaaminen':
    return {
      name: 'perusteLaajaalainenOsaaminen',
      params: {
        laajaalainenosaaminenId: String(osa.id),
      },
    };
  case 'koto_kielitaitotaso':
    return {
      name: 'perusteKotoKielitaitotaso',
      params: {
        kotokielitaitotasoId: String(osa.id),
      },
    };
  case 'koulutuksenosa':
    return {
      name: 'perusteKoulutuksenOsa',
      params: {
        koulutuksenosaId: String(osa.id),
      },
    };
  case 'koto_opinto':
    return {
      name: 'perusteKotoOpinto',
      params: {
        kotoOpintoId: String(osa.id),
      },
    };
  case 'koto_laajaalainenosaaminen':
    return {
      name: 'perusteKotoLaajaalainenOsaaminen',
      params: {
        kotoLaajaalainenOsaaminenId: String(osa.id),
      },
    };
  case 'osaamiskokonaisuus':
    return {
      name: 'perusteOsaamiskokonaisuus',
      params: {
        osaamiskokonaisuusId: String(osa.id),
      },
    };
  case 'osaamiskokonaisuus_paa_alue':
    return {
      name: 'perusteOsaamiskokonaisuusPaaAlue',
      params: {
        osaamiskokonaisuusPaaAlueId: String(osa.id),
      },
    };
  case 'tavoitesisaltoalue':
    return {
      name: 'perusteTavoitesisaltoalue',
      params: {
        tavoitesisaltoalueId: String(osa.id),
      },
    };
  case 'taiteenala':
    return {
      name: 'perusteTekstikappale',
      params: {
        viiteId: String(osa.id),
      },
    };
  case 'taiteenala_taiteenosa':
    return {
      name: 'tekstikappaleOsa',
      params: {
        viiteId: String(osa.taiteenalaId),
        osa: String(osa.taiteenOsa),
      },
    };
  case 'tutkinnon_muodostuminen':
    return {
      name: 'perusteenRakenne',
    };
  case 'tutkinnonosa':
    return {
      name: 'tutkinnonosa',
      params: {
        tutkinnonOsaViiteId: String(osa.tutkinnonosaViiteId),
      },
    };
  case 'vuosiluokkakokonaisuus':
    return {
      name: 'vuosiluokkakokonaisuus',
      params: {
        vlkId: String(osa.id),
      },
    };
  case 'oppiaineen_vuosiluokkakokonaisuus':
    return {
      name: 'vuosiluokanoppiaine',
      params: {
        vlkId: String(osa.id),
        oppiaineId: String(osa.oppiaine?.id),
      },
    };
  case 'perusopetus_oppiaine':
    return {
      name: 'perusopetusoppiaine',
      params: {
        oppiaineId: String(osa?.id),
      },
    };
  case 'lukio_oppiaine':
    return {
      name: 'lops2019oppiaine',
      params: {
        oppiaineId: String(osa?.id),
      },
    };
  case 'lukio_moduuli':
    return {
      name: 'lops2019moduuli',
      params: {
        oppiaineId: String(_.get(osa, '_oppiaine')),
        moduuliId: String(osa?.id),
      },
    };
  case 'lukio_laajaalainen_osaaminen':
    return {
      name: 'lops2019laajaalaiset',
      hash: '#' + osa?.koodi?.uri,
    };
  case 'aipe_laajaalainen_osaaminen':
    return {
      name: 'aipeLaajaalainenOsaaminen',
    };
  case 'aipe_vaihe':
    return {
      name: 'aipevaihe',
      params: {
        vaiheId: String(osa?.id),
      },
    };
  case 'aipe_oppiaine':
    return {
      name: 'aipeoppiaine',
      params: {
        vaiheId: String(osa?.vaihe?.id),
        oppiaineId: String(osa?.id),
      },
    };
  case 'aipe_kurssi':
    return {
      name: 'aipekurssi',
      params: {
        vaiheId: String(osa?.vaihe?.id),
        oppiaineId: String(_.get(osa, '_oppiaine')),
        kurssiId: String(osa?.id),
      },
    };
  default:
    return {};
  }
}

export function setPerusteData(node: NavigationNode, rawNode: NavigationNodeDto) {
  switch (rawNode.type as string) {
  case 'viite':
  case 'taiteenala':
  case 'liite':
  case 'tekstikappale':
    // Route linkki
    node.location = {
      name: 'perusteTekstikappale',
      params: {
        viiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'laajaalaiset':
    node.label = 'laaja-alaisen-osaamisen-osa-alueet';
    node.location = {
      name: 'lops2019laajaalaiset',
    };
    break;
  case 'laajaalainen':
    if (rawNode.id) {
      node.location = {
        name: 'lops2019laajaalaiset',
        hash: '#' + getLaajaAlainenId(rawNode),
      };
    }
    break;
  case 'oppiaineet':
    node.label = 'oppiaineet';
    node.location = {
      name: 'lukioOppiaineet',
    };
    break;
  case 'lukiooppiaineet_2015':
    node.label = 'oppiaineet';
    node.location = {
      name: 'lukioOppiaineet',
    };
    break;
  case 'oppimaarat':
    node.label = 'oppimaarat';
    break;
  case 'kurssit':
    node.label = 'kurssit';
    break;
  case 'oppiaine':
  case 'oppimaara':
    node.location = {
      name: 'lops2019oppiaine',
      params: {
        oppiaineId: _.toString(rawNode.id),
      },
    };
    break;
  case 'lukiooppiaine_2015':
    node.location = {
      name: 'lukioOppiaine',
      params: {
        oppiaineId: _.toString(rawNode.id),
      },
    };
    break;
  case 'lukiooppimaarat_2015':
    node.label = 'oppimaarat';
    break;
  case 'lukiokurssit':
    node.label = 'kurssit';
    break;
  case 'lukiokurssi':
    node.location = {
      name: 'lukiokurssi',
      params: {
        kurssiId: _.toString(rawNode.id),
        oppiaineId: _.toString(rawNode.meta!.oppiaine),
      },
    };
    break;
  case 'moduulit':
    node.label = 'moduulit';
    break;
  case 'moduuli':
    node.location = {
      name: 'lops2019moduuli',
      params: {
        oppiaineId: _.toString(rawNode.meta!.oppiaine),
        moduuliId: _.toString(rawNode.id),
      },
    };
    break;
  case 'tutkinnonosat':
    node.label = 'tutkinnonosat';
    node.location = {
      name: 'tutkinnonosat',
    };
    break;
  case 'tutkinnonosat_pakolliset':
    node.label = 'tutkinnonosat-pakolliset';
    node.location = {
      name: 'tutkinnonosat',
    };
    break;
  case 'tutkinnonosat_paikalliset':
    node.label = 'tutkinnonosat-paikalliset';
    node.location = {
      name: 'tutkinnonosat',
    };
    break;
  case 'tutkinnonosat_tuodut':
    node.label = 'tutkinnonosat-tuodut';
    node.location = {
      name: 'tutkinnonosat',
    };
    break;
  case 'koulutuksenosat':
    node.label = 'koulutuksenosat';
    node.location = {
      name: 'koulutuksenosat',
    };
    break;
  case 'tutkinnonosa':
  case 'tutkinnonosaviite':
    node.location = {
      name: 'tutkinnonosa',
      params: {
        tutkinnonOsaViiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'muodostuminen':
    node.label = 'tutkinnon-muodostuminen';
    node.location = {
      name: 'perusteenRakenne',
    };
    break;
  case 'vuosiluokkakokonaisuus':
    node.location = {
      name: 'vuosiluokkakokonaisuus',
      params: {
        vlkId: _.toString(rawNode.id),
      },
    };
    break;
  case 'perusopetusoppiaine':
    node.location = {
      name: _.get(rawNode, 'meta.vlkId') ? 'vuosiluokanoppiaine' : 'perusopetusoppiaine',
      params: {
        oppiaineId: _.toString(rawNode.id),
        ...(_.get(rawNode, 'meta.vlkId') && { vlkId: rawNode.meta!.vlkId }) as any,
      },
    };
    break;
  case 'perusopetusoppiaineet':
    node.label = 'oppiaineet';
    node.location = {
      name: 'perusopetusoppiaineet',
    };
    break;
  case 'aipevaihe':
    node.location = {
      name: 'aipevaihe',
      params: {
        vaiheId: _.toString(rawNode.id),
      },
    };
    break;
  case 'aipeoppiaine':
    node.location = {
      name: 'aipeoppiaine',
      params: {
        oppiaineId: _.toString(rawNode.id),
        ...(_.get(rawNode, 'meta.vaiheId') && { vaiheId: rawNode.meta!.vaiheId }) as any,
      },
    };
    break;
  case 'aipekurssi':
    node.location = {
      name: 'aipekurssi',
      params: {
        kurssiId: _.toString(rawNode.id),
        ...(_.get(rawNode, 'meta.vaiheId') && { vaiheId: rawNode.meta!.vaiheId }) as any,
        ...(_.get(rawNode, 'meta.oppiaineId') && { oppiaineId: rawNode.meta!.oppiaineId }) as any,
      },
    };
    break;
  case 'aipe_laajaalaisetosaamiset':
    node.location = {
      name: 'aipeLaajaalainenOsaaminen',
    };
    break;
  case 'taiteenosa':
    if (!rawNode.label) {
      node.label = _.get(rawNode.meta, 'alaosa') as any;
    }
    if (_.get(rawNode.meta, 'vapaateksti_id')) {
      node.location = {
        name: 'tekstikappaleVapaaOsa',
        params: {
          vapaatekstiId: _.get(rawNode.meta, 'vapaateksti_id') as any,
          viiteId: _.get(rawNode.meta, 'viiteId') as any,
        },
      };
    }

    if (_.get(rawNode.meta, 'alaosa')) {
      node.location = {
        name: 'tekstikappaleOsa',
        params: {
          osa: _.get(rawNode.meta, 'alaosa') as any,
          viiteId: _.get(rawNode.meta, 'viiteId') as any,
        },
      };
    }
    break;
  case 'opintokokonaisuus':
    node.location = {
      name: 'perusteOpintokokonaisuus',
      params: {
        opintokokonaisuusId: _.toString(rawNode.id),
      },
    };
    break;
  case 'tavoitesisaltoalue':
    node.location = {
      name: 'perusteTavoitesisaltoalue',
      params: {
        tavoitesisaltoalueId: _.toString(rawNode.id),
      },
    };
    break;
  case 'koulutuksenosa':
    node.location = {
      name: 'perusteKoulutuksenOsa',
      params: {
        koulutuksenosaId: _.toString(rawNode.id),
      },
    };
    break;
  case 'laajaalainenosaaminen':
    node.location = {
      name: 'perusteLaajaalainenOsaaminen',
      params: {
        laajaalainenosaaminenId: _.toString(rawNode.id),
      },
    };
    break;
  case 'koto_kielitaitotaso':
    node.location = {
      name: 'perusteKotoKielitaitotaso',
      params: {
        kotokielitaitotasoId: _.toString(rawNode.id),
      },
    };
    break;
  case 'koto_opinto':
    node.location = {
      name: 'perusteKotoOpinto',
      params: {
        kotoOpintoId: _.toString(rawNode.id),
      },
    };
    break;
  case 'koto_laajaalainenosaaminen':
    node.location = {
      name: 'perusteKotoLaajaalainenOsaaminen',
      params: {
        kotoLaajaalainenOsaaminenId: _.toString(rawNode.id),
      },
    };
    break;
  case 'linkkisivu':
    node.location = {
      name: 'linkkisivu',
      params: {
        linkkisivuId: _.toString(rawNode.id),
      },
    };
    break;
  case 'opetuksenyleisettavoitteet':
    node.location = {
      name: 'perusteYleisettavoitteet',
      params: {
        yleistavoiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'aihekokonaisuudet':
    node.location = {
      name: 'perusteAihekokonaisuudet',
      params: {
        aihekokonaisuudetId: _.toString(rawNode.id),
      },
    };
    break;
  case 'osaamiskokonaisuus':
    node.location = {
      name: 'perusteOsaamiskokonaisuus',
      params: {
        osaamiskokonaisuusId: _.toString(rawNode.id),
      },
    };
    break;
  case 'osaamiskokonaisuus_paa_alue':
    node.location = {
      name: 'perusteOsaamiskokonaisuusPaaAlue',
      params: {
        osaamiskokonaisuusPaaAlueId: _.toString(rawNode.id),
      },
    };
    break;
  default:
    break;
  }
}

export function setOpetussuunnitelmaData(node: NavigationNode, rawNode: NavigationNodeDto) {
  switch (rawNode.type as string) {
  case 'tiedot':
    node.label = 'opetussuunnitelman-tiedot';
    node.location = {
      name: 'opetussuunnitelmaTiedot',
    };
    break;
  case 'viite':
  case 'liite':
    // Route linkki
    node.location = {
      name: 'opetussuunnitelmaTekstikappale',
      params: {
        viiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'oppiaineet':
    node.label = 'oppiaineet';
    node.location = {
      name: 'lops2019OpetussuunnitelmaOppiaineet',
    };
    break;
  case 'oppimaarat':
    node.label = 'oppimaarat';
    break;
  case 'lukiooppimaarat_2015':
    node.label = 'oppimaarat';
    break;
  case 'oppiaine':
    node.location = {
      name: 'lops2019OpetussuunnitelmaOppiaine',
      params: {
        oppiaineId: _.toString(rawNode.id),
      },
    };
    break;
  case 'lukiooppiaine_2015':
    node.location = {
      name: 'lopsOpetussuunnitelmaOppiaine',
      params: {
        oppiaineId: _.toString(rawNode.id),
      },
    };
    break;
  case 'lukiokurssi':
    node.location = {
      name: 'lopsOpetussuunnitelmaKurssi',
      params: {
        kurssiId: _.toString(rawNode.id),
      },
    };
    break;
  case 'poppiaine':
    node.location = {
      name: 'lops2019OpetussuunnitelmaPoppiaine',
      params: {
        oppiaineId: _.toString(rawNode.id),
      },
    };
    break;
  case 'lukiokurssit':
    node.label = 'kurssit';
    break;
  case 'moduulit':
    node.label = 'moduulit';
    break;
  case 'moduuli':
    node.location = {
      name: 'lops2019OpetussuunnitelmaModuuli',
      params: {
        oppiaineId: _.toString(rawNode.meta!.oppiaine),
        moduuliId: _.toString(rawNode.id),
      },
    };
    break;
  case 'opintojaksot':
    node.label = 'opintojaksot';
    break;
  case 'opintojakso':
    node.location = {
      name: 'lops2019OpetussuunnitelmaOpintojakso',
      params: {
        opintojaksoId: _.toString(rawNode.id),
      },
    };
    break;
  case 'tutkinnonosat':
    node.label = 'tutkinnonosat';
    node.location = {
      name: 'toteutussuunnitelmaTutkinnonosat',
    };
    break;
  case 'tutkinnonosat_paikalliset':
    node.label = 'tutkinnonosat-paikalliset';
    node.location = {
      name: 'toteutussuunnitelmaTutkinnonosat',
    };
    break;
  case 'tutkinnonosat_tuodut':
    node.label = 'tutkinnonosat-tuodut';
    node.location = {
      name: 'toteutussuunnitelmaTutkinnonosat',
    };
    break;
  case 'tutkinnonosat_pakolliset':
    node.label = 'tutkinnonosat-pakolliset';
    node.location = {
      name: 'toteutussuunnitelmaTutkinnonosat',
    };
    break;
  case 'suorituspolut':
    node.label = 'suorituspolut';
    node.location = {
      name: 'toteutussuunnitelmaSuorituspolut',
      params: {
        sisaltoviiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'tekstikappale':
    node.location = {
      name: 'toteutussuunnitelmaSisalto',
      params: {
        sisaltoviiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'linkki':
    node.location = {
      name: 'toteutussuunnitelmaSisalto',
      params: {
        sisaltoviiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'tutkinnonosa':
    node.location = {
      name: 'toteutussuunnitelmaSisalto',
      params: {
        sisaltoviiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'suorituspolku':
    node.location = {
      name: 'toteutussuunnitelmaSisalto',
      params: {
        sisaltoviiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'osasuorituspolku':
    node.location = {
      name: 'toteutussuunnitelmaSisalto',
      params: {
        sisaltoviiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'vuosiluokkakokonaisuus':
    node.location = {
      name: 'opetussuunnitelmanvuosiluokkakokonaisuus',
      params: {
        vlkId: _.toString(rawNode.id),
      },
    };
    break;
  case 'perusopetusoppiaine':
    node.location = {
      name: _.get(rawNode, 'meta.vlkId') ? 'opetussuunnitelmaperusopetusvuosiluokanoppiaine' : 'opetussuunnitelmaperusopetusoppiaine',
      params: {
        oppiaineId: _.toString(rawNode.id),
        ...(_.get(rawNode, 'meta.vlkId') && { vlkId: rawNode.meta!.vlkId }) as any,
      },
    };
    break;
  case 'perusopetusoppiaineet':
    node.label = 'oppiaineet';
    node.location = {
      name: 'opetussuunnitelmaperusopetusoppiaineet',
    };
    break;
  case 'valinnaisetoppiaineet':
    node.label = 'valinnaiset-oppiaineet';
    node.location = {
      name: 'opetussuunnitelmaperusopetusvalinnaisetoppiaineet',
      params: {
        ...(_.get(rawNode, 'meta.vlkId') && { vlkId: rawNode.meta!.vlkId }) as any,
      },
    };
    break;
  case 'opintokokonaisuus':
    node.location = {
      name: 'toteutussuunnitelmaSisalto',
      params: {
        sisaltoviiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'osaamismerkki':
    node.label = 'kansalliset-perustaitojen-osaamismerkit';
    node.location = {
      name: 'toteutussuunnitelmaSisalto',
      params: {
        sisaltoviiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'laajaalainenosaaminen':
    node.location = {
      name: 'toteutussuunnitelmaSisalto',
      params: {
        sisaltoviiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'koulutuksenosa':
    node.location = {
      name: 'toteutussuunnitelmaSisalto',
      params: {
        sisaltoviiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'koulutuksenosat':
    node.location = {
      name: 'toteutussuunnitelmaSisalto',
      params: {
        sisaltoviiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'koto_kielitaitotaso':
    node.location = {
      name: 'toteutussuunnitelmaSisalto',
      params: {
        sisaltoviiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'koto_opinto':
    node.location = {
      name: 'toteutussuunnitelmaSisalto',
      params: {
        sisaltoviiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'koto_laajaalainenosaaminen':
    node.location = {
      name: 'toteutussuunnitelmaSisalto',
      params: {
        sisaltoviiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'osaalue':
    node.location = {
      name: 'toteutussuunnitelmaOsaAlue',
      params: {
        sisaltoviiteId: _.toString(rawNode.meta?.sisaltoviiteId),
        osaalueId: _.toString(rawNode.id),
      },
    };
    break;
  case 'pakolliset_osaalueet':
    node.label = 'pakolliset-osa-alueet';
    break;
  case 'valinnaiset_osaalueet':
    node.label = 'valinnaiset-osa-alueet';
    break;
  case 'paikalliset_osaalueet':
    node.label = 'paikalliset-osa-alueet';
    break;
  case 'tavoitteet_sisallot_arviointi':
    node.label = 'tavoitteet-sisallot-ja-arviointi';
    node.location = {
      name: 'tavoitteetSisallotArviointi',
    };
    break;
  default:
    break;
  }
}

export function filterNavigation(node: NavigationNode, navfilter: NavigationFilter): NavigationNode {
  if (navfilter.isEnabled) {
    return {
      ...node,
      children: _(node.children)
        .map(child => filterNavigation(child, navfilter))
        .filter(child => child.isMatch || !_.isEmpty(child.children))
        .value(),
      isMatch: checkMatch(node, navfilter),
      isVisible: true,
    };
  }
  else {
    return node;
  }
}

let nextKey = 0;

function setParents(node: NavigationNode, path: NavigationNode[] = []) {
  node.path = path;
  node.key = ++nextKey;
  for (const child of node.children) {
    setParents(child, [...path, child]);
  }
}

function buildRoot(rawNavigation: NavigationNodeDto, children: NavigationNode[]): NavigationNode {
  return {
    type: 'root',
    label: rawNavigation.label,
    children: [
      ...children,
    ],
    path: [],
  };
}

export function buildTiedot(routeName: string, params: object): NavigationNode {
  return buildNavigationNode('tiedot', 'tiedot', routeName, params);
}

export function buildNavigationNode(type: NavigationType, label: string, routeName: string, params?: object): NavigationNode {
  return {
    type: type,
    label: label,
    path: [],
    location: {
      name: routeName,
      params: {
        ...params,
      },
    },
    children: [],
  };
}

function checkMatch(node: NavigationNode, filter?: NavigationFilter) {
  return filter && Kielet.search(filter.label, node.label);
}

export function getLaajaAlainenId(laajaAlainen) {
  const koodiUri = _.get(laajaAlainen, 'meta.koodi.uri');
  return koodiUri || 'laaja-alainen-' + laajaAlainen.id;
}

export function chapterStringSort(chapter) {
  return _.join(_.map(_.split(chapter, '.'), chap => numToSSColumn(chap)), '.');
}

function numToSSColumn(num) {
  let s = ''; let t;

  while (num > 0) {
    t = (num - 1) % 26;
    s = String.fromCharCode(65 + t) + s;
    num = (num - t) / 26 | 0;
  }
  return s || undefined;
}

export function naytaPerusteTiedotNaviMenussa(peruste) {
  return peruste.tyyppi !== _.toLower(PerusteKaikkiDtoTyyppiEnum.DIGITAALINENOSAAMINEN) && peruste.opasTyyppi !== _.toLower(PerusteBaseDtoOpasTyyppiEnum.TIETOAPALVELUSTA);
}
