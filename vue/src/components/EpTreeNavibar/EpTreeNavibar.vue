<template>
  <div>
    <EpSpinner v-if="!navigation" />
    <div v-else>
      <div class="structure-toggle" v-if="showAllToggle">
        <ep-toggle v-model="showAll">
          {{$t('nayta-koko-rakenne')}}
        </ep-toggle>
      </div>

      <div class="header">
        <slot name="header" :data="showAll"></slot>
      </div>
      <div v-for="item in menuStyled" :key="item.idx">
        <div class="d-flex align-items-center item" :class="item.class">
          <div class="backwrapper">
            <div v-if="activeIdx === item.idx && !showAll" class="back">
              <b-button size="sm" variant="link" @click="navigateUp()" class="backbtn">
                <fas icon="chevron-left" />
              </b-button>
            </div>
          </div>
          <div class="flex-grow-1" :class="{'font-weight-bold': item.isMatch}">
            <slot :name="$scopedSlots[item.type] ? item.type : 'default'" :item="item">
            {{ $kaanna(item.label) }}
            </slot>
          </div>
          <div class="text-muted" v-if="item.children.length > 0 && item.idx !== activeIdx && !showAll">
            <b-button variant="link" @click="navigate(item)" class="forwards">
              <fas icon="chevron-right" />
            </b-button>
          </div>
        </div>
      </div>

      <Portal to="breadcrumbs">
      </Portal>

      <div class="action-container">
        <slot name="new"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch, Prop, Component, Vue } from 'vue-property-decorator';
import EpIcon from '@shared/components/EpIcon/EpIcon.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { FlattenedNodeDto, EpTreeNavibarStore } from '@shared/components/EpTreeNavibar/EpTreeNavibarStore';
import { NavigationNodeType, NavigationNodeDto } from '@shared/tyypit';
import _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';

export type ProjektiFilter = 'koulutustyyppi' | 'tila' | 'voimassaolo';

type IndexedNode = FlattenedNodeDto & { idx: number };

@Component({
  components: {
    EpIcon,
    EpMultiSelect,
    EpSearch,
    EpButton,
    EpSpinner,
    EpToggle,
  },
})
export default class EpTreeNavibar extends Vue {
  @Prop({ required: true })
  private store!: EpTreeNavibarStore;

  @Prop({ required: false, type: Boolean, default: false })
  private showAllToggle!: boolean;

  @Prop({ required: false, type: String })
  private query!: string;

  private active: IndexedNode | null = null;
  private showAll= false;

  get depth() {
    return this.active?.depth || 1;
  }

  public parents(node: IndexedNode | null) {
    if (!this.navigation || !node) {
      return [];
    }

    const idx = _.findIndex(this.navigation, { idx: node.idx });
    let depth = this.navigation[idx].depth;
    return _(this.navigation)
      .take(idx)
      .reverse()
      .filter(item => {
        if (item.depth < depth) {
          --depth;
          return true;
        }
        else {
          return false;
        }
      })
      .reverse()
      .value();
  }

  get path() {
    return this.$route?.path || null;
  }

  @Watch('store')
  onStoreChange() {
    this.onRouteUpdate();
  }

  @Watch('path', { immediate: true })
  onRouteUpdate() {
    if (!this.store) {
      return;
    }

    const matching = this.store.routeToNode(this.$route as any);
    if (matching) {
      const node = _.find(this.navigation, matching) as IndexedNode | null;
      if (node) {
        this.navigate(node);
      }
    }
  }

  get activeIdx(): number {
    if (!this.active || !this.store) {
      return -1;
    }

    return _.findIndex(this.navigation, navItem => navItem.id === this.active!.id);
  }

  get activeParents() {
    return this.parents(this.active);
  }

  get children() {
    if (!this.navigation || this.activeIdx < 0) {
      return null;
    }

    const node = this.navigation[this.activeIdx];

    return _(this.navigation)
      .drop(this.activeIdx + 1)
      .takeWhile(item => node.depth < item.depth)
      .value();
  }

  get navigation(): IndexedNode[] | null {
    if (!this.store) {
      return null;
    }
    return _.map(this.store.filtered.value, (item, idx) => {
      return {
        ...item,
        idx,
      };
    });
  }

  get menu() {
    if (this.allOrQuery) {
      return _.chain(this.navigation)
        .map(navi => this.filterNavigation(navi))
        .filter('isVisible')
        .value();
    }
    else if (this.active) {
      return _.filter([
        this.active,
        ...(this.children || [])],
      item => item.depth === this.depth || item.depth === this.depth + 1);
    }
    else {
      return _.filter(this.navigation, item => item.depth === this.depth);
    }
  }

  filterNavigation(node) {
    const children = _(node.children)
      .map(child => this.filterNavigation(child))
      .filter(child => child.isMatch || child.isVisible)
      .value();
    return {
      ...node,
      children,
      isMatch: this.isMatch(node),
      isVisible: (this.showAll && !this.query) || this.isMatch(node) || _.some(children, child => child.isMatch),
    };
  }

  isMatch(node) {
    return this.query ? Kielet.search(this.query, node.label ? node.label : this.$t(node.type)) : false;
  }

  get menuStyled() {
    return _.map(this.menu, item => {
      return {
        ...item,
        ...(this.allOrQuery && { class: 'item-margin-' + (item.depth - 1) }),
      };
    });
  }

  get allOrQuery() {
    return this.showAll || !_.isEmpty(this.query);
  }

  navigate(item: IndexedNode) {
    if (_.isEmpty(item.children)) {
      this.active = _.last(this.parents(item)) || null;
    }
    else {
      this.active = item;
    }
  }

  navigateUp() {
    this.active = _.last(this.activeParents) || null;
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

.sidenav {
  min-width: $sidebar-width;
  max-width: $sidebar-width;
  background: #fff;
}

.portal-menu {
  height: 140px;

  h1 {
    margin: 0;
    padding: 0;
  }

  .upper-left {
    min-width: $sidebar-width;
    max-width: $sidebar-width;
  }
}

.actual {
  background: #f2f2f2;
}

.forwards {
  padding: 0 6px 0 0;
  color: #aaa;
}

.header {
  margin-bottom: 5px;
}

.item {

  .backwrapper {
    min-width: 28px;
    max-width: 28px;

    .back {
      margin-top: 4px;
      margin-left: 3px;
      background: #3367e3;
      border-radius: 100%;
      height: 30px;
      width: 30px;

      .btn {
        margin-top: -2px;
        font-size: 16px;
        font-weight: 400;
      }

      .backbtn {
        color: white;
      }
    }
  }
}

.action-container {
  margin-left: 20px;
}

.structure-toggle {
  font-size: 14px;
  border-top: 1px solid rgb(216, 216, 216);
  border-bottom: 1px solid rgb(216, 216, 216);
  padding: 10px 0px;
}

$sizes: 12;

@mixin margin-classes {
  @for $i from 1 through $sizes {
     $margin: $i * 0.40rem;
    .item-margin-#{$i} {margin-left: $margin;}
  }
}
@include margin-classes;

</style>
