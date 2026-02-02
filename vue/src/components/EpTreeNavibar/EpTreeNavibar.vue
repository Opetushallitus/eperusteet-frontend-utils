<template>
  <div>
    <EpSpinner v-if="!navigation" />
    <div v-else>
      <div
        v-if="showAllToggle"
        class="structure-toggle"
      >
        <ep-toggle v-model="showAll">
          {{ $t('nayta-koko-rakenne') }}
        </ep-toggle>
      </div>

      <div class="header">
        <slot
          name="header"
          :data="showAll"
        />
      </div>
      <div
        v-for="item in menuStyled"
        :key="item.idx"
      >
        <div
          class="d-flex align-items-center item"
          :class="item.class"
        >
          <div class="backwrapper">
            <div
              v-if="activeIdx === item.idx && !showAll"
              class="back"
            >
              <b-button
                size="sm"
                variant="link"
                class="backbtn"
                @click="navigateUp()"
              >
                <EpMaterialIcon>chevron_left</EpMaterialIcon>
              </b-button>
            </div>
          </div>
          <div
            class="flex-grow-1"
            :class="{'font-weight-bold': item.isMatch}"
          >
            <div
              class="clickable d-flex align-items-center"
              @click="navigate(item)"
            >
              <slot
                :name="slots[item.type] ? item.type : 'default'"
                :item="item"
              >
                {{ $kaannaOlioTaiTeksti(item.label) }}
              </slot>
              <EpMaterialIcon
                size="16px"
                v-if="item.meta && item.meta.liite"
              >
                attach_file
              </EpMaterialIcon>
            </div>
          </div>
          <div
            v-if="item.children.length > 0 && item.idx !== activeIdx && !showAll"
            class="text-muted mr-1"
          >
            <EpMaterialIcon>chevron_right</EpMaterialIcon>
          </div>
        </div>
      </div>

      <div class="action-container">
        <slot name="new" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, useSlots, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { FlattenedNodeDto, EpTreeNavibarStore } from '@shared/components/EpTreeNavibar/EpTreeNavibarStore';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';
import VueScrollTo from 'vue-scrollto';
import EpNavigationLabel from '@shared/components/EpTreeNavibar/EpNavigationLabel.vue';
import { $t, $kaannaOlioTaiTeksti } from '@shared/utils/globals';
import { unref } from 'vue';

export type ProjektiFilter = 'koulutustyyppi' | 'tila' | 'voimassaolo';

type IndexedNode = FlattenedNodeDto & { idx: number };

const props = defineProps({
  store: {
    type: Object as () => EpTreeNavibarStore,
    required: true,
  },
  showAllToggle: {
    type: Boolean,
    default: false,
  },
  query: {
    type: String,
    required: false,
  },
});

// Access to slots
const slots = useSlots();

// Access route
const route = useRoute();

// Reactive state
const active = ref<IndexedNode | null>(null);
const showAll = ref(false);

// Computed properties
const depth = computed(() => {
  return active.value?.depth || 1;
});

const navigation = computed((): IndexedNode[] | null => {
  if (!props.store) {
    return null;
  }

  return _.map(unref(props.store.filtered), (item, idx) => {
    return {
      ...item,
      idx,
    };
  });
});

const activeIdx = computed(() => {
  if (!active.value || !props.store) {
    return -1;
  }

  return _.findIndex(navigation.value, navItem =>
    navItem.id != null ? navItem.id === active.value!.id : navItem.type === active.value?.type,
  );
});

const activeParents = computed(() => {
  return parents(active.value);
});

const children = computed(() => {
  if (!navigation.value || activeIdx.value < 0) {
    return null;
  }

  const node = navigation.value[activeIdx.value];

  return _(navigation.value)
    .drop(activeIdx.value + 1)
    .takeWhile(item => node.depth < item.depth)
    .value();
});

const path = computed(() => {
  return route?.path || null;
});

const allOrQuery = computed(() => {
  return showAll.value || !_.isEmpty(props.query);
});

const menu = computed(() => {
  if (allOrQuery.value) {
    return _.chain(navigation.value)
      .map(navi => filterNavigation(navi))
      .filter('isVisible')
      .value();
  }
  else if (active.value) {
    return _.filter([
      active.value,
      ...(children.value || [])],
    item => item.depth === depth.value || item.depth === depth.value + 1);
  }
  else {
    return _.filter(navigation.value, item => item.depth === depth.value);
  }
});

const menuStyled = computed(() => {
  return _.map(menu.value, item => {
    return {
      ...item,
      ...(allOrQuery.value && { class: 'item-margin-' + (item.depth - 1) }),
      koodi: _.get(item, 'meta.koodi.arvo') || _.get(item, 'meta.koodi'),
    };
  });
});

// Methods
function parents(node: IndexedNode | null) {
  if (!navigation.value || !node) {
    return [];
  }

  const idx = _.findIndex(navigation.value, { idx: node.idx });
  let nodeDepth = navigation.value[idx].depth;
  return _(navigation.value)
    .take(idx)
    .reverse()
    .filter(item => {
      if (item.depth < nodeDepth) {
        --nodeDepth;
        return true;
      }
      else {
        return false;
      }
    })
    .reverse()
    .value();
}

function isMatch(node) {
  return props.query ? Kielet.search(props.query, node.label ? node.label : $t(node.type)) : false;
}

function filterNavigation(node) {
  const nodeChildren = _(node.children)
    .map(child => filterNavigation(child))
    .filter(child => child.isMatch || child.isVisible)
    .value();
  return {
    ...node,
    children: nodeChildren,
    isMatch: isMatch(node),
    isVisible: (showAll.value && !props.query) || isMatch(node) || _.some(nodeChildren, child => child.isMatch),
  };
}

function navigate(item: IndexedNode) {
  if (_.isEmpty(item.children)) {
    active.value = _.last(parents(item)) || null;
  }
  else {
    active.value = item;
  }
}

function navigateUp() {
  active.value = _.last(activeParents.value) || null;
}

function onRouteUpdate() {
  if (!props.store) {
    return;
  }

  const matching = props.store.routeToNode(route as any);
  if (matching) {
    const node = _.find(navigation.value, matching) as IndexedNode | null;
    if (node) {
      navigate(node);
      VueScrollTo.scrollTo('#scroll-anchor');
    }
  }
}

// Watch for changes
watch(() => props.store, () => {
  onRouteUpdate();
});

watch(path, () => {
  onRouteUpdate();
}, { immediate: true });

watch(navigation, () => {
  active.value = null;
});
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
        padding: 0.25rem 0.1rem;
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
