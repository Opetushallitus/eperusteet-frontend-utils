<template>
<div class="sidenav">
  <div class="bar" :class="{ 'bar-open': toggled}">
    <div class="bar-buttons">
      <div class="btn-group-sm" :class="{ 'btn-group': toggled, 'btn-group-vertical': !toggled }">
        <button class="btn btn-link btn-sm"
                :aria-label="$t('avaa-rakenteen-navigaatio')"
                @click="toggled = !toggled">
          <fas fixed-width icon="bars"></fas>
        </button>
        <button class="btn btn-link btn-sm"
                :aria-label="$t('avaa-asetukset')"
                id="popover-button-event">
          <fas fixed-width icon="cog"></fas>
        </button>

        <b-popover target="popover-button-event" triggers="click blur">
          <template v-slot:title>{{ $t('lisaasetukset') }}</template>
          <ep-toggle v-model="autoScroll">{{ $t('automaattinen-nayton-vieritys')}}</ep-toggle>
          <ep-toggle v-model="showSubchapter" :is-editing="false">{{ $t('avaa-paalukujen-aliluvut-automaattisesti')}}</ep-toggle>
        </b-popover>
      </div>
    </div>
    <slot v-if="toggled"
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

@Component({
  components: {
    EpToggle,
  }
})
export default class EpSidebar extends Vue {
  private toggled = true;
  private autoScroll = true;
  private showSubchapter = true;

  get scrollId() {
    return this.autoScroll ? 'scroll-anchor' : 'scroll-anchor-disabled';
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
