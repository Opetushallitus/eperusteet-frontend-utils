<template>
  <span :class="'material-icons' + shape"
        class="icon"
        :style="{color: color}"
        aria-hidden="true">
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

  get shape() {
    if (this.iconShape === 'outlined') {
      return '-outlined';
    }
    else if (this.iconShape === 'rounded') {
      return '-rounded';
    }
    else {
      // default = filled
      return '';
    }
  }
};
</script>

<style lang="scss" scoped>

.icon {
  display: inline-block !important;
  vertical-align: sub;
}

</style>
