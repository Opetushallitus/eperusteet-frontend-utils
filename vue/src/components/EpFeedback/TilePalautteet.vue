<template>
  <EpHomeTile
    icon="feedback"
    :route="route">
    <template slot="header">
      <span>{{ $t('tile-palautteet') }}</span>
    </template>
    <template slot="content">
      <p>{{ $t(text) }}</p>
    </template>
  </EpHomeTile>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide } from 'vue-property-decorator';
import EpHomeTile from '@shared/components/EpHomeTiles/EpHomeTile.vue';

@Component({
  components: {
    EpHomeTile,
  },
})
export default class TilePalautteet extends Vue {
  @Prop({ required: false, default: () => ({ name: 'palautteet' }) })
  private route!: any;

  @Prop({ required: false, default: 'tile-palautteet-kuvaus' })
  private text!: string;

  @Prop({ required: false })
  private headerStyle!: string;

  @Provide('tileHeaderStyle')
  private tileHeaderStyle = this.headerStyle;
}
</script>
