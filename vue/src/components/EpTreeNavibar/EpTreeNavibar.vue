<template>
  <div class="mb-4">
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

      <div class="header mb-2 pb-2">
        <slot
          name="header"
          :data="showAll"
        />
      </div>
      <div
        v-for="(item, menuIndex) in menuStyled"
        :key="item.idx"
      >
        <div
          class="d-flex align-items-start item"
          :class="item.class"
        >
          <div class="backwrapper ml-1">
            <div
              v-if="menuIndex === 0 && (active?.depth || 0) > 0 && !showAll"
              class="back"
            >
              <b-button
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
              v-if="item.navigationSubType === 'add'"
              class="navigation-type-add mb-1 mt-1"
            >
              <slot
                :name="slots[item.type] ? item.type : 'default'"
                :item="item"
              />
            </div>
            <div
              v-else-if="item.navigationSubType === 'subtype'"
              class="mt-3 mb-2"
            >
              <slot
                :name="slots[item.type] ? item.type : 'default'"
                :item="item"
              >
                <div class="text-muted">
                  {{ $t(item.type.replaceAll('_', '-')) }}
                </div>
              </slot>
            </div>
            <div
              v-else
              class="clickable d-flex align-items-center menu-item my-2"
              @click="navigate(item)"
            >
              <div class="d-flex align-items-start">
                <div
                  v-if="item.meta?.numerointi"
                  class="mr-2"
                >
                  {{ item.meta.numerointi }}
                </div>
                <slot
                  :name="slots[item.type] ? item.type : 'default'"
                  :item="item"
                >
                  {{ $kaannaOlioTaiTeksti(item.label) }}
                </slot>
              </div>
              <EpMaterialIcon
                v-if="item.meta && item.meta.liite"
                size="16px"
              >
                attach_file
              </EpMaterialIcon>
            </div>
          </div>
          <div
            v-if="item.children.length > 0 && item.idx !== activeIdx && !showAll"
            class="text-muted mr-1 py-2"
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
import { ref, computed, watch, useSlots, getCurrentInstance, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { FlattenedNodeDto, EpTreeNavibarStore } from '@shared/components/EpTreeNavibar/EpTreeNavibarStore';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';
import VueScrollTo from 'vue-scrollto';
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

  return _.findIndex(navigation.value, navItem => isActive(navItem));
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
      navigationSubType: _.get(item, 'meta.navigation-sub-type'),
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
  nextTick(() => {
    onRouteUpdate();
    if (active.value && navigation.value) {
      const refreshed = _.find(navigation.value, navItem =>
        isActive(navItem),
      ) as IndexedNode | undefined;
      if (refreshed) {
        active.value = refreshed;
      }
      else {
        active.value = null;
      }
    }
  });
});

const isActive = (navItem: IndexedNode) => {
  if (!active.value) {
    return false;
  }

  if (navItem.depth !== active.value?.depth) {
    return false;
  }

  if (navItem.id != null) {
    return navItem.id === active.value!.id && _.isEqual(navItem.meta, active.value?.meta);
  }

  return navItem.type === active.value?.type;
};
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
  border-bottom: 1px solid #D8D8D8;
  padding-left: 0px;
  margin-left: 28px;
  margin-right: 28px;
  font-size: 16px !important;
}

.item {
  font-size: 14px;

  .backwrapper {
    min-width: 40px;
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

  .navigation-type-add, .navigation-type-subtype {
    font-size: 14px !important;

    :deep(button) {
      font-size: 14px !important;
    }

  }
}

.menu-item, .header {
  :deep(a) {
    color: $black !important;
    &.router-link-exact-active {
      font-weight: 600;
    }
  }
}

.header {
  padding-left: 15px;
}

.action-container {
  margin-left: 20px;
}

.structure-toggle {
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
