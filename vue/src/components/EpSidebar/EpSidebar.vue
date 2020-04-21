<template>
<div class="sidenav">
  <div class="bar" :class="{ 'bar-open': isOpen}">
    <div class="bar-buttons d-block">
      <!-- Desktop -->
      <ep-sidebar-buttons :mobile="false"
                          :inline="isOpen"
                          :show-social="showSocial"
                          v-model="settings"
                          @toggle="handleToggle" />
      <!-- Mobile -->
      <ep-sidebar-buttons :mobile="true"
                          :inline="isOpen"
                          :show-social="showSocial"
                          v-model="settings"
                          @toggle="handleToggle" />
    </div>
    <slot v-if="isOpen"
          name="bar" />
    <div v-if="isOpen && $scopedSlots.bottom" class="bottom" v-sticky sticky-side="bottom">
      <slot name="bottom" />
    </div>
  </div>
  <div class="view" :id="scrollId">
    <slot name="view" />
  </div>
</div>
</template>

<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator';
import EpToggle from '../forms/EpToggle.vue';
import EpSidebarButtons from './EpSidebarButtons.vue';
import Sticky from 'vue-sticky-directive';
import { setItem, getItem, removeItem } from '../../utils/localstorage';
import _ from 'lodash';

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
  @Prop({ default: true })
  private showSocial!: boolean;

  private isOpen = false;
  private settings = {
    autoScroll: true,
    showSubchapter: true,
  };

  get scrollId() {
    return this.settings.autoScroll ? 'scroll-anchor' : 'scroll-anchor-disabled';
  }

  private handleToggle(value) {
    this.isOpen = value;
    if (this.isOpen) {
      setItem('ep-sidebar-open', true);
    }
    else {
      removeItem('ep-sidebar-open');
    }
  }

  mounted() {
    this.isOpen = !!getItem('ep-sidebar-open');
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
