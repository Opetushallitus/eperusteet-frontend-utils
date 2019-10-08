<template>
<div>
  <div class="sidenav">
    <div class="closed">
      <button class="btn btn-link"
              v-if="!toggled"
              @click="toggled = !toggled">
        <span class="bar">
          <fas icon="bars"></fas>
        </span>
      </button>
    </div>
    <div class="bar"
         v-if="toggled"
         @click="toggled = !toggled">
      <button class="btn btn-link">
        <fas icon="bars"></fas>
      </button>
      <slot name="bar"></slot>
    </div>
    <div class="view">
      <slot name="view"></slot>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class EpSidebar extends Vue {
  private width = window.innerWidth;
  private toggled = true;

  public mounted() {
    window.addEventListener('resize', this.onResize);
  }

  public destroyed() {
    window.removeEventListener('resize', this.onResize);
  }

  private onResize(data: Event) {
    const newWidth = window.innerWidth;
    if (this.width >= 768 && newWidth < 768) {
      this.toggled = false;
    }
    if (this.width < 768 && newWidth >= 768) {
      this.toggled = true;
    }

    this.width = newWidth;
  }
}

</script>
<style scoped lang="scss">
@import "../../styles/_variables.scss";

.sidenav {
  @media (min-width: 768px) {
    display: flex;

    .bar {
      min-width: $sidebar-width;
    }

    .view {
      border-left: 1px solid #eee;
    }
  }

}
</style>
