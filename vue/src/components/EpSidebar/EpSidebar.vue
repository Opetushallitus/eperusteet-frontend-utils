<template>
<div class="sidenav">
  <div class="bar" :class="{ 'bar-open': isOpen}">
    <div class="bar-buttons d-block">
      <!-- Desktop -->
      <ep-sidebar-buttons :mobile="false"
                          :inline="isOpen"
                          v-model="settings"
                          @toggle="handleToggle" />
      <!-- Mobile -->
      <ep-sidebar-buttons :mobile="true"
                          :inline="isOpen"
                          v-model="settings"
                          @toggle="handleToggle" />
    </div>
    <slot v-if="isOpen"
          name="bar" />
    <div v-if="$scopedSlots.bottom" class="bottom" v-sticky sticky-side="bottom">
      <slot name="bottom" />
    </div>
  </div>
  <div class="view" :id="scrollId">
    <slot name="view" />
  </div>
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import EpToggle from '../forms/EpToggle.vue';
import EpSidebarButtons from './EpSidebarButtons.vue';
import Sticky from 'vue-sticky-directive';


@Component({
  components: {
    EpSidebarButtons,
    EpToggle,
  },
  directives: {
    Sticky,
  },
})
export default class EpSidebar extends Vue {
  private isOpen = true;
  private settings = {
    autoScroll: true,
    showSubchapter: true
  };
  get scrollId() {
    return this.settings.autoScroll ? 'scroll-anchor' : 'scroll-anchor-disabled';
  }
  private handleToggle(value) {
    this.isOpen = value;
  }
}
</script>
<style scoped lang="scss">
@import "../../styles/_variables.scss";
.sidenav {
  min-height: 100vh;

  .bar {

    .bar-buttons {
      padding: 0 $content-padding;
    }

    .bottom {
      background: #fff;
      padding-top: 6px;
      border-top: 1px solid #eee;
      position: relative;
      bottom: 0;
    }
  }
  @media (max-width: 767.98px) {
    .btn-group-vertical {
      flex-direction: row;
    }
  }
  @media (min-width: 768px) {
    display: flex;
    .bar {
      &.bar-open {
        width: $sidebar-width;
      }
    }
    .view {
      flex: 1;
      border-left: 1px solid #eee;
    }
  }
}
</style>
