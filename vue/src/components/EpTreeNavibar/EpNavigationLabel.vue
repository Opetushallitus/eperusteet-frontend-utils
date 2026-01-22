<template>
  <component
    :is="component"
    :to="to"
  >
    <span>
      <slot />
      <EpMaterialIcon
        v-if="piilotettu"
        class="ml-2"
        size="16px"
      >visibility_off</EpMaterialIcon>
      <template v-if="postfixLabel">
        <EpPopover
          :triggers="['hover', 'click']"
          :disabled="!node.meta || !node.meta.postfix_tooltip"
        >
          <template #trigger>
            <span
              v-if="node.meta && node.meta.postfix_label"
              :id="'item-popover'+node.id"
              class="postfix"
            >
              ({{ $t(postfixLabel) }})
            </span>
          </template>
          {{ $t(postfixTooltip) }}
        </EpPopover>
      </template>
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NavigationNodeDto } from '@shared/tyypit';
import * as _ from 'lodash';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpPopover from '../EpPopover/EpPopover.vue';

const props = defineProps({
  node: {
    type: Object as () => NavigationNodeDto,
    required: true,
  },
  to: {
    type: [Object, String],
    required: false,
    default: undefined,
  },
});

const component = computed(() => {
  return props.to ? 'router-link' : 'div';
});

const postfixLabel = computed((): string => {
  return _.toString(props.node.meta?.postfix_label);
});

const postfixTooltip = computed((): string => {
  return _.toString(props.node.meta?.postfix_tooltip);
});

const piilotettu = computed(() => {
  return props.node.meta?.piilotettu;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.postfix {
  font-size: 0.9rem;
  font-weight: 600;
}

</style>
