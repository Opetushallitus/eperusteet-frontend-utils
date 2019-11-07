import _ from 'lodash';
import { PerusteDto, NavigationNodeDto, LokalisoituTekstiDto } from '@shared/api/tyypit';
import { Kielet } from '@shared/stores/kieli';
import { Location } from 'vue-router';

export type NavigationType =
    'root' | 'viite' | 'tiedot' | 'laajaalaiset' | 'oppiaineet' | 'oppiaine' | 'oppimaarat' | 'moduulit' | 'moduuli';

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
}

export interface NavigationFilter {
  label: string;
  isEnabled: boolean;
}

export function buildNavigation({id}, rawNavigation: NavigationNodeDto): NavigationNode {
  const navigation = traverseNavigation(rawNavigation);
  const rakenne = buildRoot([
    buildTiedot({perusteId: _.toString(id)}),
    ...navigation!.children,
  ]);
  setParents(rakenne, [rakenne]);
  return rakenne;
}

function traverseNavigation(rawNode: NavigationNodeDto): NavigationNode {

  const node: NavigationNode = {
    label: rawNode.label as LokalisoituTekstiDto,
    type: rawNode.type as NavigationType,
    children: _.map(rawNode.children, traverseNavigation),
    path: [], // setParents asettaa polun
    meta: rawNode.meta,
  };

  // Lisätään tiettyihin node tyyppeihin liittyiä asioita
  switch (rawNode.type as string) {
  case 'viite':
  case 'liite':
    // Route linkki
    node.location = {
      name: 'tekstikappale',
      params: {
        viiteId: _.toString(rawNode.id),
      }
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
    /*
    node.location = {
      name: 'lops2019oppiaine',
      hash: '#oppimaarat',
    };
    */
    break;
  case 'oppiaine':
    node.location = {
      name: 'lops2019oppiaine',
      params: {
        oppiaineId: _.toString(rawNode.id),
      }
    };
    break;
  case 'moduulit':
    node.label = 'moduulit';
    /*
    node.location = {
      name: 'lops2019oppiaine',
      hash: '#moduulit',
    };
    */
    break;
  case 'moduuli':
    node.location = {
      name: 'lops2019moduuli',
      params: {
        moduuliId: _.toString(rawNode.id),
      }
    };
    break;
  default:
    break;
  }

  return node;
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
  if (node.location && node.location.params) {
    node.location.params = _.mapValues(node.location.params, param => _.toString(param));
  }
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

function buildTiedot(params: object): NavigationNode {
  return {
    type: 'tiedot',
    label: 'tiedot',
    path: [],
    location: {
      name: 'perusteTiedot',
      params: {
        ...params,
      }
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
