<template>
  <div
    class="ep-button d-print-none"
  >
    <Button
      v-tooltip="help ? $t(help) : undefined"
      :disabled="disabled || showSpinner"
      :size="pvSize"
      :class="buttonClasses"
      @click.native="click"
      :link="isLink"
      :text="isText"
      :outlined="isOutline"
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
        :class="{'pl-3 pr-3': paddingx && !noPadding && !isLink}"
      >
        <slot />
        <ep-spinner-inline
          v-if="showSpinner"
          :link="variant === 'link' || isOutline"
        />
      </div>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import _ from 'lodash';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpSpinnerInline from '../EpSpinner/EpSpinnerInline.vue';
import Button from 'primevue/button';

const props = defineProps({
  icon: { type: String, default: '' },
  buttonClass: { type: String },
  disabled: { type: Boolean, default: false },
  showSpinner: { type: Boolean, default: false },
  variant: { type: String, default: '' },
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

const isLink = computed(() => {
  return props.link || props.variant === 'link';
});

const resolvedVariant = computed(() => {
  return props.link ? 'link' : props.variant;
});

const isOutline = computed(() => {
  return _.startsWith(resolvedVariant.value, 'outline');
});

const isText = computed(() => {
  return resolvedVariant.value === 'link';
});

// Map Bootstrap sizes to PrimeVue sizes
const pvSize = computed(() => {
  const sizeMap: Record<string, string | undefined> = {
    'sm': 'small',
    'md': undefined,
    'lg': 'large',
  };

  return sizeMap[props.size];
});

const buttonClasses = computed(() => {
  let classes: string[] = [];

  if (isOutline.value) {
    classes.push('no-outline');
  }

  if (props.buttonClass) {
    classes.push(props.buttonClass);
  }

  if (props.noPadding) {
    classes.push('no-padding');
  }

  // Keep backward compatibility with Bootstrap variant classes for styling
  // classes.push('btn-' + resolvedVariant.value);

  return classes.join(' ');
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

  :deep(button) {
    &.no-outline {
      border: none;
      color: #2B2B2B;
    }

    &.btn-outline-primary:not(.disabled):hover {
      div.teksti {
        color: $white;
      }
    }

    &.no-padding {
      padding: 0 !important;

      div {
        padding: 0 !important;
      }

      .teksti {
        padding-left: 0 !important;
      }
    }

    &.btn-link {
      padding-left: 0 !important;

      .teksti {
        padding-left: 0 !important;
      }
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
}
</style>
