<template>
  <div>
    <div
      id="tila-popover"
      class="row justify-content-center"
    >
      <div class="col-12 progress-area">
        <ep-progress
          :slices="processSlices"
          :height="height"
          :width="width"
        />
      </div>
      <div class="col-12 header">
        <slot name="header" />
      </div>
    </div>

    <b-popover
      v-if="slots.default"
      ref="progresspopover"
      container="tila-popover"
      target="tila-popover"
      triggers="focus hover blur"
      size="md"
      placement="bottom"
      :show.sync="tilaPopupVisible"
      custom-class="progress-popover"
    >
      <div
        class="popup-top row flex-column align-items-center"
        :style="popupStyle"
      >
        <!-- <div class="progress-area">
          <ep-progress
            :slices="processSlices"
            :height="height"
            :width="width"
            :popup-style="{ 'background-color': '' }"
          />
        </div> -->
        <!-- <div class="header">
          <slot name="header" />
        </div> -->
      </div>

      <div class="slot-area row justify-content-center">
        <slot />
      </div>

      <div class="popup-hr">
        <hr>
      </div>

      <div class="popup-bottom row flex-column align-items-center">
        <slot name="bottom" />
      </div>
    </b-popover>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue';
import _ from 'lodash';
import EpProgress from './EpProgress.vue';

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

    return [0.2, 0.5, 1];
  }
});

defineExpose({
  tilaPopupVisible,
});
</script>

<style lang="scss" scoped>

@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.progress-area {
  width: 100px;
}

.progress-popover {
  width: 250px;
  @include tile-background-shadow-selected;
  border: 0px;
  border-radius: 1rem;
  transform: translate3d(45px, 55px, 0px) !important;

  :deep(.arrow) {
    display:none;
  }

  :deep(.popover-body) {
    padding: 0;

    .popup-top {
      padding: 15px;
      background: $popup-top-background;
      border-radius: 1rem 1rem 0 0;
      font-size: 1rem;
    }

    .slot-area {
      padding: 15px;
      background-color: $white;
    }

    .popup-hr {
      background-color: $white;
      margin-right: -15px;
      margin-left: -15px;
      display: flow-root;
    }

    .popup-bottom {
      padding: 5px 15px;
      background-color: $white;
      border-radius: 0 0 1rem 1rem;
    }

    hr {
      margin: 0;
    }
  }
}

</style>
