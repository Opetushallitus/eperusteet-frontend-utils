import Vue from 'vue';
import VueCompositionApi, { reactive, computed } from '@vue/composition-api';
import { PerusteprojektiDto, PerusteDto, Perusteprojektit, Perusteet } from '@shared/api/eperusteet';
import { Computed } from '@shared/utils/interfaces';
import { LokalisoituTekstiDto, NavigationNodeType, NavigationNodeDto } from '@shared/tyypit';
import _ from 'lodash';

Vue.use(VueCompositionApi);

interface FlattenedNodeDto {
  id?: number;
  label?: LokalisoituTekstiDto;
  type?: NavigationNodeType;
  meta?: { [key: string]: object; };
  depth: number;
}

export class EpTreeNavibarStore {
  constructor(
    private navigation: Computed<NavigationNodeDto>,
  ) {
  }

  private readonly connected = computed(() => {
    return _.drop(flattenNodes(this.navigation.value), 2);
  });

  public readonly filtered = computed(() => this.connected.value);
}

function flattenNodes(root: NavigationNodeDto, depth = 0): FlattenedNodeDto[] {
  return [{
    id: root.id,
    label: root.label,
    type: root.type,
    meta: root.meta,
    depth,
  }, ..._.flatten(_.map(root.children, child => flattenNodes(child, depth + 1)))];
}
