<template>
  <div
    class="ep-progress text-center"
    placement="'bottom'"
  >
    <div v-if="!slices">
      <svg
        viewBox="0 0 100 100"
        class="vaiheet animation"
        :height="height"
        :width="width"
      >
        <circle
          r="50%"
          cx="50%"
          cy="50%"
          style="stroke: rgba(91, 202, 19, 1); stroke-dasharray: 72.2566, 314.15; stroke-dashoffset: -2;"
        />
        <circle
          r="50%"
          cx="50%"
          cy="50%"
          style="stroke: rgba(91, 202, 19, 0.4); stroke-dasharray: 72.2566, 314.15; stroke-dashoffset: -80.5398;"
        />
        <circle
          r="50%"
          cx="50%"
          cy="50%"
          style="stroke: rgba(91, 202, 19, 1); stroke-dasharray: 72.2566, 314.15; stroke-dashoffset: -159.08;"
        />
        <circle
          r="50%"
          cx="50%"
          cy="50%"
          style="stroke: rgba(91, 202, 19, 0.4); stroke-dasharray: 72.2566, 314.15; stroke-dashoffset: -237.619;"
        />
      </svg>
    </div>

    <div
      v-else-if="done"
      class="done-icon d-inline-block"
      :style="{ height: height + 'px', width: width + 'px' }"
    />

    <div v-else-if="hasValidation">
      <svg
        viewBox="0 0 100 100"
        class="vaiheet"
        style="transform: rotate(-90deg)"
        :height="height"
        :width="width"
      >
        <circle
          v-for="(v, idx) in slicesColored"
          :key="idx"
          r="50%"
          cx="50%"
          cy="50%"
          :style="'stroke: rgba('+v.color+', ' + (v.progress || 0.4) + ');' + 'stroke-dasharray: ' + segmentLength + ' ' + 314.15 + '; stroke-dashoffset: ' + (-idx * gapLength -2)"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import _ from 'lodash';

const props = defineProps({
  slices: {
    type: Array as () => number[] | null,
    required: false,
    default: null,
  },
  height: {
    type: Number,
    default: 80,
  },
  width: {
    type: Number,
    default: 80,
  },
});

const slicesColored = computed(() => {
  if (!props.slices) {
    return props.slices;
  }

  return _.map(props.slices, slice => {
    return {
      progress: slice,
      color: slice >= 0.9 ? '91, 202, 19' : '255, 255, 255',
    };
  });
});

const done = computed(() => {
  return _.size(_.filter(props.slices, (slice) => slice === 1)) === _.size(props.slices);
});

const total = computed(() => {
  return _.size(props.slices);
});

const gap = computed(() => {
  return 0.02;
});

const size = computed(() => {
  return 1 / total.value;
});

const segmentLength = computed(() => {
  return (size.value - gap.value) * Math.PI * 0.5 * 2 * 100;
});

const gapLength = computed(() => {
  return size.value * Math.PI * 0.5 * 2 * 100;
});

const hasValidation = computed(() => {
  return total.value !== 0;
});
</script>

<style lang="scss" scoped>
@import '@shared/styles/_variables.scss';

.ep-progress {

  /*
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    cursor: pointer;
  }
  */

  .done-icon {
    background: url('../../../public/img/icons/valmiusaste-indikaattori-valmis.svg');
    background-repeat: no-repeat;
    background-size: 100%;
  }

  svg.vaiheet {
    margin: 5px;
    background: transparent;
    border-radius: 50%;

    circle {
      fill: none;
      stroke-width: 20;
    }

    circle.stroke-background {
      stroke: rgba(91, 202, 19, 0.4);
    }

    circle.stroke-foreground {
      stroke: rgba(91, 202, 19, 1);
    }

  }

  svg.animation {
    animation: rotate 4.5s ease infinite;
  }

  @keyframes rotate {
    0% { -webkit-transform: rotate(0deg); }
    20% { -webkit-transform: rotate(90deg); }
    25% { -webkit-transform: rotate(90deg); }
    45% { -webkit-transform: rotate(180deg); }
    50% { -webkit-transform: rotate(180deg); }
    70% { -webkit-transform: rotate(270deg); }
    75% { -webkit-transform: rotate(270deg); }
    100% { -webkit-transform: rotate(360deg); }
  }

}

</style>
