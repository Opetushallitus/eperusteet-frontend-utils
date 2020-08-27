<template>
  <div>
    <div class="row justify-content-center">
      <div class="progress-area">
        <ep-progress :slices="slices" :height="height" :width="width"/>
        <div class="header">
          <slot name="header" />
        </div>
      </div>
    </div>

    <b-popover
      target="tila-popover"
      triggers="focus hover blur"
      size="md"
      placement="top"
      :show.sync="tilaPopupVisible"
      ref="popover"
      custom-class="progress-popover"
      v-if="$slots.default">

      <div class="popup-top row justify-content-center" :style="popupStyle">
        <div class="progress-area">
          <ep-progress :slices="slices" :height="height" :width="width"
                       :popup-style="{ 'background-color': '' }" />
          <div class="header">
            <slot name="header" />
          </div>
        </div>
      </div>

      <div class="slot-area row justify-content-center">
        <slot />
      </div>
    </b-popover>

  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import _ from 'lodash';
import EpProgress from './EpProgress.vue';

@Component({
  components: {
    EpProgress,
  },
})
export default class EpProgressPopover extends Vue {
  @Prop({ required: true })
  private slices!: number[];

  @Prop({ default: 70 })
  private height!: number;

  @Prop({ default: 70 })
  private width!: number;

  @Prop({
    default() {
      return {
        'background-color': '#2146a3',
      };
    },
  })
  private popupStyle!: string;

  private tilaPopupVisible = false;
}
</script>

<style lang="scss" scoped>

@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.header {
  color: $gray-lighten-4;
}

.progress-area {
  width: 100px;
}

.progress-popover {
  width: 250px;
  @include tile-background-shadow-selected;
  border: 0px;
  border-radius: 1rem;
  margin-top: -95px;

  /deep/ .arrow {
    display:none;
  }

  /deep/ .popover-body{
    padding: 0px;

    .popup-top {
      padding: 15px;
      background: $popup-top-background;
      border-radius: 1rem 1rem 0rem 0rem;
      font-size: 1rem;
    }

    .slot-area {
      padding: 15px;
      background-color: $white;
      border-radius: 0rem 0rem 1rem 1rem;
    }

  }

}

</style>
