<template>
  <div class="sidenav">
    <div
      v-if="showNavigation"
      class="bar d-print-none"
    >
      <slot name="bar" />
      <div
        v-if="slots.bottom"
        v-sticky
        class="bottom"
        sticky-side="bottom"
        sticky-z-index="500"
      >
        <slot name="bottom" />
      </div>
    </div>
    <Portal
      v-else
      to="globalNavigation"
    >
      <slot name="bar" />
    </Portal>
    <div
      :id="scrollAnchor"
      class="view"
    >
      <slot name="view" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import EpToggle from '../forms/EpToggle.vue';
import Sticky from 'vue-sticky-directive';
import { BrowserStore } from '../../stores/BrowserStore';
import _ from 'lodash';
import { useRoute } from 'vue-router';

const props = defineProps({
  scrollEnabled: {
    type: Boolean,
    default: false,
  },
});

const slots = useSlots();
const route = useRoute();
const browserStore = new BrowserStore();

const showNavigation = computed(() => {
  return browserStore.navigationVisible.value;
});

const settings = {
  autoScroll: true,
  showSubchapter: true,
};

const scrollAnchor = computed(() => {
  return props.scrollEnabled && !_.includes(['peruste', 'perusteTiedot'], route?.name)
    ? 'scroll-anchor'
    : 'disabled-scroll-anchor';
});
</script>
<style scoped lang="scss">
@import "../../styles/_variables.scss";
.sidenav {
  @media (min-width: 992px) {
    min-height: 100vh;
  }

  .bar {
    width: 340px;

    .bar-buttons {
      padding: 0 $content-padding;
    }

    .bottom {
      background: #fff;
      padding-top: 6px;
      border-top: 1px solid #eee;
      bottom: 0;
      position: fixed;
      width: $sidebar-width;
    }
  }

  @media (max-width: 767.98px) {
    .btn-group-vertical {
      flex-direction: row;
    }

    .view {
      border-top: 2px solid #eee;
      padding-top: 20px;
      margin-top: 10px;
    }
  }

  @media (min-width: 992px) {
    display: flex;
    .bar {
      &.bar-open {
        min-width: $sidebar-width;
      }
    }
    .view {
      width: calc(100% - 340px);
      border-left: 1px solid #eee;
      @media print {
        border-left: none;
      }
    }
  }
}
</style>
