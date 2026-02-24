<template>
  <div class="ep-button print:hidden inline-block whitespace-nowrap">
    <button
      v-bind="$attrs"
      :title="help ? $t(help) : undefined"
      :class="[
        'ep-button__btn',
        'inline-flex items-center justify-center',
        'font-normal text-center align-middle cursor-pointer select-none',
        'border transition-all duration-150 whitespace-nowrap',
        buttonVariantClasses,
        buttonSizeClasses,
        buttonClass,
        { 'ep-button__btn--disabled': disabled || showSpinner }
      ]"
      :disabled="disabled || showSpinner"
      @click="click"
    >
      <EpMaterialIcon
        v-if="icon"
        class="ep-button__icon mr-2 inline-flex items-center"
        icon-shape="outlined"
        :background="inherit"
        :color="inherit"
      >
        {{ icon }}
      </EpMaterialIcon>
      <span
        class="ep-button__text inline-flex items-center"
        :class="{ 'px-2': paddingx && !isLink }"
      >
        <slot />
      </span>
      <EpSpinnerInline
        v-if="showSpinner"
        :link="isLink || isOutline"
      />
    </button>
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
  variant: { type: String, default: '' },
  size: { type: String, default: 'md' },
  help: { type: String, default: '' },
  paddingx: { type: Boolean, default: true },
  link: { type: Boolean, default: false },
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

const buttonVariantClasses = computed(() => {
  if (isLink.value) {
    return 'ep-button__btn--link';
  }
  if (isOutline.value) {
    return 'ep-button__btn--outline';
  }
  return 'ep-button__btn--primary';
});

const buttonSizeClasses = computed(() => {
  if (isLink.value) {
    return ''; // Links don't need size padding
  }

  const sizeMap: Record<string, string> = {
    'sm': 'px-2 py-1 text-sm rounded-2xl',
    'md': 'px-3 py-1 text-base rounded-full',
    'lg': 'px-4 py-1 text-lg rounded-3xl',
  };

  return sizeMap[props.size] || sizeMap['md'];
});

const inherit = computed(() => {
  return resolvedVariant.value === 'link' ? 'inherit' : '';
});
</script>

<style lang="scss" scoped>
@import '@shared/styles/_variables.scss';

.ep-button__btn--link {
  background: transparent;
  border: none;
  color: $link;
  padding: 0;
  border-radius: 0;

  &:hover {
    background: transparent;
    color: $link-hover-color;

    .ep-button__text {
      text-decoration: underline;
    }
  }
}

.ep-button__btn--outline {
  background: transparent;
  border-color: $blue2;
  color: $blue2;

  &:hover {
    background: $blue2;
    color: $white;

    .ep-button__text {
      text-decoration: none;
    }
  }
}

.ep-button__btn--primary {
  background: $blue3;
  border-color: transparent;
  color: $white;

  &:hover {
    background: $blue2;
  }

  &:active {
    background: $blue2;
  }
}

.ep-button__btn--disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.ep-button__btn:disabled {
  pointer-events: none;
}
</style>
