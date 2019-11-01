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
          name="bar"></slot>
  </div>
  <div class="view" :id="scrollId">
    <slot name="view"></slot>
  </div>
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import EpToggle from '../forms/EpToggle.vue';
import EpSidebarButtons from './EpSidebarButtons.vue';

@Component({
  components: {
    EpToggle,
    EpSidebarButtons,
  }
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
  .bar {
    .bar-buttons {
      padding: 0 $content-padding;
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
