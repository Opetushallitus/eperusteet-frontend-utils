<template>
  <span :class="'material-icons' + shape"
        class="icon"
        :style="{color: color, fontSize: size, background: background}">
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EpMaterialIcon extends Vue {
  @Prop({ required: false, default: '' })
  iconShape?: string;

  @Prop({ required: false })
  color?: string;

  @Prop({ required: false })
  background?: string;

  @Prop({ required: false })
  size?: string;

  @Prop({ required: false, type: Boolean })
  private outlined!: boolean;

  @Prop({ required: false, type: Boolean })
  private rounded!: boolean;

  get shape() {
    if (this.outlined || this.iconShape === 'outlined') {
      return '-outlined';
    }
    else if (this.rounded || this.iconShape === 'rounded') {
      return '-rounded';
    }

    return '';
  }
};
</script>

<style lang="scss" scoped>

.icon {
  display: inline-block !important;
  vertical-align: sub;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

</style>
