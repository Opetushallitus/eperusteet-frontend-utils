<template>
<div class="sidenav">
    <div class="bar" :class="{ 'bar-open': toggled}">
      <button class="btn btn-link"
              @click="toggled = !toggled">
        <fas icon="bars"></fas>
      </button>
      <slot v-if="toggled"
            name="bar"></slot>
    </div>
    <div class="view">
      <slot name="view"></slot>
    </div>
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class EpSidebar extends Vue {
  private toggled = true;
}

</script>
<style scoped lang="scss">
@import "../../styles/_variables.scss";

.sidenav {
  @media (min-width: 768px) {
    display: flex;

    .bar {
      &.bar-open {
        min-width: $sidebar-width;
      }
    }

    .view {
      border-left: 1px solid #eee;
    }
  }

}
</style>
