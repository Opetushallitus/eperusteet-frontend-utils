import _ from 'lodash';
import { NavigationNodeDto, LokalisoituTekstiDto } from '../tyypit';
import { Kielet } from '../stores/kieli';
import { Location } from 'vue-router';

export type NavigationType =
    'root' | 'viite' | 'tiedot' | 'laajaalaiset'
    | 'oppiaineet' | 'oppiaine' | 'oppimaarat' | 'poppiaine'
    | 'moduulit' | 'moduuli' |
    'opintojaksot' | 'opintojakso'
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
  tiedot: NavigationNode,
  isOps = false,
) {
  const navigation = traverseNavigation(rawNavigation, isOps);
  const rakenne = buildRoot([
    tiedot,
    ...navigation!.children,
  ]);
  setParents(rakenne, [rakenne]);
  return rakenne;
}

function traverseNavigation(rawNode: NavigationNodeDto, isOps: boolean): NavigationNode {
  const node: NavigationNode = {
    label: rawNode.label as LokalisoituTekstiDto,
    type: rawNode.type as NavigationType,
    children: _.map(rawNode.children, child => traverseNavigation(child, isOps)),
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
  return node;
}

export function setPerusteData(node: NavigationNode, rawNode: NavigationNodeDto) {
  switch (rawNode.type as string) {
  case 'viite':
  case 'liite':
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
      name: 'lops2019oppiaineet',
    };
    break;
  case 'oppimaarat':
    node.label = 'oppimaarat';
    break;
  case 'kurssit':
    node.label = 'kurssit';
    break;
  case 'oppiaine':
    node.location = {
      name: 'lops2019oppiaine',
      params: {
        oppiaineId: _.toString(rawNode.id),
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
  case 'tutkinnonosaviite':
    node.location = {
      name: 'tutkinnonosa',
      params: {
        tutkinnonOsaViiteId: _.toString(rawNode.id),
      },
    };
    break;
  case 'muodostuminen':
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
      },
    };
    break;
  case 'aipekurssi':
    node.location = {
      name: 'aipekurssi',
      params: {
        kurssiId: _.toString(rawNode.id),
      },
    };
    break;
  case 'taiteenosa':
    if (!rawNode.label) {
      node.label = _.get(rawNode.meta, 'alaosa') as any;
    }
    node.location = {
      name: 'tekstikappaleOsa',
      params: {
        osa: _.get(rawNode.meta, 'alaosa') as any,
      },
    };
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
  default:
    break;
  }
}

export function setOpetussuunnitelmaData(node: NavigationNode, rawNode: NavigationNodeDto) {
  switch (rawNode.type as string) {
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
  case 'oppiaine':
    node.location = {
      name: 'lops2019OpetussuunnitelmaOppiaine',
      params: {
        oppiaineId: _.toString(rawNode.id),
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

function buildRoot(children: NavigationNode[]): NavigationNode {
  return {
    type: 'root',
    label: undefined,
    children: [
      ...children,
    ],
    path: [],
  };
}

export function buildTiedot(routeName: string, params: object): NavigationNode {
  return {
    type: 'tiedot',
    label: 'tiedot',
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
