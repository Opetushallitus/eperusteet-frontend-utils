<template>
  <span class="pallo" :style="'color:' + kohdealueVarit[index]"><fas icon="circle"/></span>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class EpOrderColorBall extends Vue {
  @Prop({ required: true })
  private index!: number;

  private kohdealueVarit = ['#99B3F1', '#9BDCFF', '#B2B2B2', '#002D99', '#FFD900', '#E60895', '#C126B8', '#575757',
    '#2e3192', '#8283be', '#663300', '#a38566', '#666600', '#a3a366'];
}
</script>

<style lang="scss" scoped>

  .pallo {
    font-size: 0.8rem;
  }

</style>
