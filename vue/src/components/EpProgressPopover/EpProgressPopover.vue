<template>
  <div>
    <EpPopover
      v-if="slots.default"
      :triggers="['hover', 'focus']"
      popover-class="w-70"
      @show="tilaPopupVisible = true"
      @hide="tilaPopupVisible = false"
    >
      <template #trigger>
        <div
          class="text-center"
        >
          <div class="progress-area">
            <ep-progress
              :slices="processSlices"
              :height="height"
              :width="width"
            />
          </div>
          <div class="header text-center">
            <slot name="header" />
          </div>
        </div>
      </template>

      <div class="slot-area text-center mr-1">
        <slot />
      </div>

      <div class="popup-hr">
        <hr>
      </div>

      <div class="popup-bottom block text-center">
        <slot name="bottom" />
      </div>
    </EpPopover>

    <div
      v-else
    >
      <div class="progress-area text-center">
        <ep-progress
          :slices="processSlices"
          :height="height"
          :width="width"
        />
      </div>
      <div class="w-full header">
        <slot name="header" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue';
import _ from 'lodash';
import EpProgress from './EpProgress.vue';
import EpPopover from '../EpPopover/EpPopover.vue';

const props = defineProps({
  slices: {
    type: Array as () => number[],
    required: true,
  },
  popupStyle: {
    type: Object,
    default: () => ({
      'background-color': '#2146a3',
    }),
  },
});

const slots = useSlots();
const height = ref(60);
const width = ref(60);
const tilaPopupVisible = ref(false);

const done = computed(() => {
  return _.size(_.filter(props.slices, (slice) => slice === 1)) === _.size(props.slices);
});

const zero = computed(() => {
  return _.isEqual(props.slices, [0]);
});

const processSlices = computed(() => {
  if (props.slices) {
    if (done.value) {
      return props.slices;
    }
    if (zero.value) {
      return props.slices;
    }

  }
  return [0.2, 0.5, 1];
});

defineExpose({
  tilaPopupVisible,
});
</script>

<style lang="scss" scoped>

@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.progress-area {
  height: 70px;
}

</style>
