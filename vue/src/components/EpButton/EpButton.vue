<template>
  <div
    ref="button-container"
    class="ep-button d-print-none"
  >
    <b-button
      v-bind="$attrs"
      :variant="resolvedVariant"
      :disabled="disabled || showSpinner"
      :size="size"
      :class="variantClass"
      @click="click"
    >
      <EpMaterialIcon
        v-if="icon"
        class="float-left mr-1"
        icon-shape="outlined"
        :background="inherit"
        :color="inherit"
      >
        {{ icon }}
      </EpMaterialIcon>
      <div
        class="teksti"
        :class="{'pl-3 pr-3': paddingx && !noPadding}"
      >
        <slot />
        <ep-spinner-inline
          v-if="showSpinner"
          :link="variant === 'link' || isOutline"
        />
      </div>
    </b-button>
    <b-tooltip
      v-if="help"
      :target="() => $refs['button-container']"
    >
      {{ $t(help) }}
    </b-tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import _ from 'lodash';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpSpinnerInline from '../EpSpinner/EpSpinnerInline.vue';

const props = defineProps({
  icon: { type: String, default: '' },
  buttonClass: { type: String },
  disabled: { type: Boolean, default: false },
  showSpinner: { type: Boolean, default: false },
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  help: { type: String, default: '' },
  paddingx: { type: Boolean, default: true },
  link: { type: Boolean, default: false },
  noPadding: { type: Boolean, default: false },
});

const emit = defineEmits(['click']);

function click() {
  emit('click');
}

const resolvedVariant = computed(() => {
  return props.link ? 'link' : props.variant;
});

const isOutline = computed(() => {
  return _.startsWith(resolvedVariant.value, 'outline');
});

const variantClass = computed(() => {
  let result = 'btn-' + resolvedVariant.value;
  if (isOutline.value) {
    result = 'no-outline ' + result;
  }
  if (props.buttonClass) {
    result = props.buttonClass + ' ' + result;
  }

  if (props.noPadding) {
    result = 'no-padding ' + result;
  }

  return result;
});

const inherit = computed(() => {
  return resolvedVariant.value === 'link' ? 'inherit' : '';
});
</script>

<style lang="scss" scoped>
@import '../../styles/_variables.scss';

.ep-button {
  display: inline-block;
  white-space: nowrap;

  button.no-outline {
    border: none;
    color: #2B2B2B;
  }

  ::v-deep button.btn-outline-primary:not(.disabled):hover{
    div.teksti {
      color: $white;
    }
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

  &.no-padding {
    button {
      padding: 0 !important;

      div {
        padding: 0 !important;
      }
    }
  }

  &.no-padding {
    ::v-deep .btn-link, .btn {
      padding-left: 0 !important;
      .teksti{
        padding-left: 0 !important;
      }
    }
  }

  .no-padding {
    ::v-deep &.btn-link, &.btn {
      padding-left: 0 !important;
      .teksti{
        padding-left: 0 !important;
      }
    }
  }
}
</style>
