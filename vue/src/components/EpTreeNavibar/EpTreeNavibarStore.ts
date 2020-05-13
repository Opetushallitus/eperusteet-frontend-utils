import Vue from 'vue';
import VueCompositionApi, { reactive, computed } from '@vue/composition-api';
import { Location } from 'vue-router';
import { PerusteprojektiDto, PerusteDto, Perusteprojektit, Perusteet } from '@shared/api/eperusteet';
import { Computed } from '@shared/utils/interfaces';
import { LokalisoituTekstiDto, NavigationNodeType, NavigationNodeDto } from '@shared/tyypit';
import _ from 'lodash';

Vue.use(VueCompositionApi);

export interface FlattenedNodeDto {
  id?: number;
  label?: LokalisoituTekstiDto;
  type?: NavigationNodeType;
  meta?: { [key: string]: object; };
  depth: number;
  chapter: string;
  children: NavigationNodeDto[];
}

export class EpTreeNavibarStore {
  constructor(
    private navigation: Computed<NavigationNodeDto>,
    private readonly routeToNodeImpl: (route: Location) => NavigationNodeDto | null,
  ) {
  }

  public routeToNode(route: Location) {
    return this.routeToNodeImpl(route);
  }

  private readonly connected = computed(() => {
    return _.drop(flattenNodes(this.navigation.value), 1);
  });

  public readonly filtered = computed(() => this.connected.value);
}

function flattenNodes(root: NavigationNodeDto, depth = 0, idx = 0): FlattenedNodeDto[] {
  return [{
    id: root.id,
    label: root.label,
    type: root.type,
    meta: root.meta,
    children: root.children as any,
    // chapter: (depth > 1 ? '.' : '') + (idx + 1),
    chapter: '',
    depth,
  }, ..._.flatten(_.map(root.children, (child, idx) => flattenNodes(child, depth + 1, idx)))];
}
