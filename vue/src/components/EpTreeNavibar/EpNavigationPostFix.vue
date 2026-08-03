<template>
  <div
    v-if="postfixLabel"
    class="flex items-center"
  >
    <EpPopover
      :triggers="['hover', 'click']"
      :disabled="!node.meta || !node.meta.postfix_tooltip"
    >
      <template #trigger>
        <div
          v-if="node.meta && node.meta.postfix_label"
          :id="'item-popover'+node.id"
          class="postfix"
        >
          ({{ $t(postfixLabel) }})
        </div>
      </template>
      {{ $t(postfixTooltip) }}
    </EpPopover>
  </div>
</template>

<script setup lang="ts">
import { NavigationNodeDto } from '@shared/tyypit';
import * as _ from 'lodash';
import { computed } from 'vue';
import EpPopover from '../EpPopover/EpPopover.vue';

const props = defineProps({
  node: {
    type: Object as () => NavigationNodeDto,
    required: true,
  },
});

const postfixLabel = computed((): string => {
  return _.toString(props.node.meta?.postfix_label);
});

const postfixTooltip = computed((): string => {
  return _.toString(props.node.meta?.postfix_tooltip);
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.postfix {
  font-size: 0.9rem;
  font-weight: 600;
}
</style>
