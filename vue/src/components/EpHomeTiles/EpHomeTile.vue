<template>
  <div class="tile">
    <!-- Todo: Onko parempaa tapaa välittää slotit alikomponentille? -->
    <!-- router-link täytyy olla a, jotta navigointi onnistuu näppäimistöllä -->
    <router-link
      v-if="route"
      :to="route && route"
      tag="a"
      @mouseover.native="effects.hover = true"
      @mouseleave.native="effects.hover = false"
      @focus.native="effects.focus = true"
      @blur.native="effects.focus = false"
      style="outline: none;">
      <InnerTile :icon="icon" :color="color" :effects="effects">
        <template slot="header">
          <slot name="header"></slot>
        </template>
        <template slot="content">
          <slot name="content"></slot>
        </template>
      </InnerTile>
    </router-link>
    <a
      v-else
      :href="href && href"
      rel="noopener noreferrer"
      target="_blank"
      @mouseover="effects.hover = true"
      @mouseleave="effects.hover = false"
      @focus="effects.focus = true"
      @blur="effects.focus = false"
      style="outline: none;">
      <InnerTile :icon="icon" :color="color" :effects="effects">
        <template slot="header">
          <slot name="header"></slot>
        </template>
        <template slot="content">
          <slot name="content"></slot>
        </template>
      </InnerTile>
    </a>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import EpIcon from '@shared/components/EpIcon/EpIcon.vue';
import InnerTile from './InnerTile.vue';

@Component({
  components: {
    EpIcon,
    InnerTile,
  },
})
export default class EpHomeTile extends Vue {
  @Prop({ required: true })
  private icon!: string;

  @Prop({ default: null })
  private color!: string | null;

  @Prop({ default: null })
  private route!: object | string | null;

  @Prop({ default: null })
  private href!: string | null;

  private effects = {
    hover: false,
    focus: false,
  };
}
</script>

<style scoped lang="scss">

$tile-width: 540px;

.tile {
  width: $tile-width;
  margin: 15px 15px;
  text-align: center;
}

</style>
