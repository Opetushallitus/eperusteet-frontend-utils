<template>
  <div class="d-flex align-items-center">
    <span :id="'item-tooltip'+node.id" class="postfix" v-if="node.meta && node.meta.postfix_label">({{$t(node.meta.postfix_label)}})</span>
    <b-tooltip v-if="node.meta && node.meta.postfix_tooltip" custom-class="postfix-tooltip" :target="'item-tooltip'+node.id" triggers="hover" placement="right">{{$t(node.meta.postfix_tooltip)}}</b-tooltip>
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
