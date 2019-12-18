<template>
<div class="ep-button" ref="button-container">
  <b-button :variant="variant"
          v-bind="$attrs"
          :disabled="disabled || showSpinner"
          @click="$emit('click')"
          :size="size"
          :class="buttonClass">
    <span v-if="icon"
         class="float-left mr-2"
         :class="isOutline && 'icon'">
      <fas fixed-width :icon="icon"></fas>
    </span>
    <slot />
    <ep-spinner-inline v-if="showSpinner" />
  </b-button>
  <b-tooltip v-if="help" :target="() => $refs['button-container']">{{ $t(help) }}</b-tooltip>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import _ from 'lodash';

import EpSpinnerInline from '../EpSpinner/EpSpinnerInline.vue';

@Component({
  components: {
    EpSpinnerInline,
  },
})
export default class EpButton extends Vue {
  @Prop({ default: '', type: String })
  private icon!: string;

  @Prop()
  private buttonClass!: string;

  get isOutline() {
    return _.startsWith(this.variant, 'outline');
  }

  get variantClass() {
    let result = 'btn-' + this.variant;
    if (this.isOutline) {
      result = 'no-outline ' + result;
    }
    return result;
  }

  @Prop({ default: false, type: Boolean })
  private disabled!: boolean;

  @Prop({ default: false, type: Boolean })
  private showSpinner!: boolean;

  @Prop({ default: 'primary', type: String })
  private variant!: string;

  @Prop({ default: 'md', type: String })
  private size!: string;

  @Prop({ default: '', type: String })
  private help!: string;
}
</script>

<style lang="scss" scoped>
.ep-button {
  display: inline-block;

  button.no-outline {
    border: none;
    color: #2B2B2B;

  }

  .icon {
    height: 24px;
    width: 24px;
    border-radius: 100%;
    margin: 0;
    padding: 0;
    color: #fff;
    background-color: #3367E3;
  }
}
</style>
