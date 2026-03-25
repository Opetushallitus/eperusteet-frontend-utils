<template>
  <div class="sidenav flex">
    <div
      v-if="showNavigation"
      class="bar print-none flex flex-col justify-between"
    >
      <div class="flex-1">
        <slot name="bar" />
      </div>
      <div
        v-if="slots.bottom"
        class="bottom content-center"
      >
        <slot name="bottom" />
      </div>
    </div>
    <!-- <Teleport
      v-else-if="mounted"
      to="#globalNavigation"
    >
      <div class="mb-5">
        <slot name="bar" />
      </div>
    </Teleport> -->
    <div
      :id="scrollAnchorId"
      class="view"
    >
      <slot name="view" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { BrowserStore } from '@shared/stores/BrowserStore';
import _ from 'lodash';
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { watch } from 'vue';

const props = defineProps({
  scrollEnabled: {
    type: Boolean,
    default: false,
  },
});

const slots = useSlots();
const route = useRoute();
const browserStore = new BrowserStore();
const mounted = ref(false);
const scrollAnchor = ref('scroll-anchor');

onMounted(() => {
  mounted.value = true;
  scroll();
});

const showNavigation = computed(() => {
  return browserStore.navigationVisible.value;
});

const settings = {
  autoScroll: true,
  showSubchapter: true,
};

const scrollAnchorId = computed(() => {
  return props.scrollEnabled ? 'scroll-anchor' : 'disabled-scroll-anchor';
});

const scrollToView = () => {
  const element = document.getElementById(scrollAnchorId.value);
  element?.scrollIntoView();
};

watch(route, () => {
  scroll();
});

const scroll = () => {
  if (props.scrollEnabled) {
    updateScrollMargin();
    scrollToView();
  }
};

const updateScrollMargin = () => {
  const element = document.getElementById(scrollAnchorId.value);
  if (!element) return;
  element.style.scrollMarginTop = `${offsetHeight.value}px`;
};

const offsetHeight = computed(() => {
  return getElementHeighById('navigation-bar') + getElementHeighById('notification-bar');
});

const getElementHeighById = (id: string) => {
  const element = document.getElementById(id);
  return element ? element.getBoundingClientRect().height : 0;
};

</script>
<style scoped lang="scss">
@import "../../styles/_variables.scss";
.sidenav {
  @media (min-width: 992px) {
    min-height: calc(100vh - 200px);
  }

  .bar {
    width: 340px;
    // height: calc(100%);

    .bar-buttons {
      padding: 0 $content-padding;
    }

    .bottom {
      height: 65px;
      background: #fff;
      border-top: 1px solid #eee;
      bottom: 0;
      position: sticky;
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
