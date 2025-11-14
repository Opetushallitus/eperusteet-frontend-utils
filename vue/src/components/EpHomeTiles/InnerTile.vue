<template>
  <div :class="{ 'innertile': true, 'route-button': effectEnabled}">
    <div
      class="tile-header"
      :style="tileHeaderStyle"
    >
      <h3 class="oph-h3 tileheader">
        <slot name="header" />
      </h3>
    </div>
    <div class="iconline">
      <ep-icon
        :icon="icon"
        :color="correctColor"
        background-color="white"
      >
        <template #fas>
          <slot name="fas" />
        </template>
      </ep-icon>
      <div
        v-if="count"
        class="count"
      >
        {{ count }}
      </div>
    </div>
    <div class="tile-content px-3">
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import EpIcon from '@shared/components/EpIcon/EpIcon.vue';

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#071A58',
  },
  effects: {
    type: Object,
    default: () => ({ hover: false, focus: false }),
  },
  count: {
    type: Number,
    required: false,
  },
  headerStyle: {
    type: String,
    required: false,
  },
});

const tileHeaderStyle = inject('tileHeaderStyle', {});

const effectEnabled = computed(() => {
  if (props.effects.hover || props.effects.focus) {
    return true;
  }
  return false;
});

const correctColor = computed(() => {
  if (effectEnabled.value) {
    return '#3467e3';
  }
  return props.color;
});
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';
@import '../../styles/_mixins.scss';

$tile-height: 300px;
$tile-width: 540px;

.innertile {
  cursor: pointer;
  min-height: $tile-height;
  background: $etusivu-tile-background;
  border: 1px solid #eee;
  border-radius: 10px;
  user-select: none;
  @include tile-background-shadow;

  .tile-header {
    height: 120px;
    border-radius: 10px 10px 0 0;
    background: linear-gradient(180deg, $home-tile-top-background-color 0%, $home-tile-bottom-background-color 100%);
    color: white;
    padding-top: 30px;
  }

  .tile-content {
    overflow: hidden;
    color: $dark-blue;
    margin-top: -20px;
  }

  .iconline {
    position: relative;
    top: -37px;
    display: flex;
    justify-content: center;
    color: $black;
  }

  .count {
    position: absolute;
    border-radius: 100%;
    border: 1px solid $white;
    background-color: $red;
    width: 24px;
    line-height: 24px;
    color: $white;
    font-size: 0.85rem;
    margin-right: -55px;
    margin-top: -5px;
  }
}

.route-button {
  @include tile-background-shadow-selected;
}
</style>
