<template>
  <component :is="component">
    <span>
      <slot />
      <EpMaterialIcon v-if="piilotettu" class="ml-2" size="16px">visibility_off</EpMaterialIcon>
      <template v-if="postfixLabel">
        <span
          :id="'item-popover'+node.id"
          class="postfix"
          v-if="node.meta && node.meta.postfix_label">
          ({{$t(postfixLabel)}})
        </span>
        <b-popover
          v-if="node.meta && node.meta.postfix_tooltip"
          :target="'item-popover'+node.id"
          triggers="click hover"
          placement="right">
          {{$t(postfixTooltip)}}
        </b-popover>
      </template>
    </span>
  </component>
</template>

<script lang="ts">
import { NavigationNodeDto } from '@shared/tyypit';
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EpNavigationLabel extends Vue {
  @Prop()
  node!: NavigationNodeDto;

  @Prop()
  to!: any;

  get component() {
    return this.to ? 'router-link' : 'div';
  }

  get postfixLabel(): string {
    return _.toString(this.node.meta?.postfix_label);
  }

  get postfixTooltip(): string {
    return _.toString(this.node.meta?.postfix_tooltip);
  }

  get piilotettu() {
    return this.node.meta?.piilotettu;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.postfix {
  font-size: 0.9rem;
  font-weight: 600;
}

</style>
