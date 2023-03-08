<template>
  <div class="d-flex align-items-center">
    <div
      :id="'item-tooltip'+node.id"
      class="postfix"
      v-if="node.meta && node.meta.postfix_label">
      ({{$t(postfixLabel)}})
    </div>
    <b-tooltip
      v-if="node.meta && node.meta.postfix_tooltip"
      custom-class="postfix-tooltip"
      :target="'item-tooltip'+node.id"
      triggers="hover"
      placement="right">
      {{$t(postfixTooltip)}}
    </b-tooltip>
  </div>
</template>

<script lang="ts">
import { NavigationNodeDto } from '@shared/tyypit';
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EpNavigationPostFix extends Vue {
  @Prop()
  node!: NavigationNodeDto

  get postfixLabel(): string {
    return _.toString(this.node.meta?.postfix_label);
  }

  get postfixTooltip(): string {
    return _.toString(this.node.meta?.postfix_tooltip);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.postfix {
  font-size: 0.9rem;
  font-weight: 600;
}
.postfix-tooltip {
  ::v-deep .tooltip-inner {
    max-width: none;
  }
}

</style>
