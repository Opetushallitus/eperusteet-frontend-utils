<template>
  <div class="ep-button d-print-none inline-block whitespace-nowrap">
    <button
      v-bind="$attrs"
      v-tooltip="help ? $t(help) : undefined"
      :class="[
        'inline-flex items-center justify-center',
        'font-normal text-center align-middle cursor-pointer select-none',
        'border transition-all duration-150 whitespace-nowrap',
        buttonVariantClasses,
        buttonSizeClasses,
        buttonClass,
        { 'opacity-65 cursor-not-allowed': disabled || showSpinner },
        { 'p-0': noPadding }
      ]"
      :disabled="disabled || showSpinner"
      @click="click"
    >
      <EpMaterialIcon
        v-if="icon"
        class="mr-2 inline-flex items-center"
        icon-shape="outlined"
        :background="inherit"
        :color="inherit"
      >
        {{ icon }}
      </EpMaterialIcon>
      <span
        class="inline-flex items-center"
        :class="{ 'px-2': paddingx && !noPadding && !isLink }"
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
import { useI18n } from 'vue-i18n';
import _ from 'lodash';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpSpinnerInline from '../EpSpinner/EpSpinnerInline.vue';

const { t: $t } = useI18n();

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

const buttonVariantClasses = computed(() => {
  // Link variant
  if (isLink.value) {
    return [
      'bg-transparent border-none text-lime-600',
      'hover:bg-transparent hover:text-lime-700 hover:underline',
      'px-0 py-0 rounded-none'
    ].join(' ');
  }

  // Outline variant
  if (isOutline.value) {
    return [
      'bg-transparent border-blue-600 text-blue-600',
      'hover:bg-blue-600 hover:text-white'
    ].join(' ');
  }

  // Primary/default variant
  return [
    'bg-blue-600 text-white border-transparent',
    'hover:bg-blue-700',
    'active:bg-blue-800'
  ].join(' ');
});

const buttonSizeClasses = computed(() => {
  if (isLink.value) {
    return ''; // Links don't need size padding
  }

  const sizeMap: Record<string, string> = {
    'sm': 'px-4 py-1.5 text-sm rounded-2xl',
    'md': 'px-6 py-2 text-base rounded-full',
    'lg': 'px-8 py-3 text-lg rounded-3xl',
  };

  return sizeMap[props.size] || sizeMap['md'];
});

const inherit = computed(() => {
  return resolvedVariant.value === 'link' ? 'inherit' : '';
});
</script>

<style lang="scss" scoped>
// Minimal custom styles - most styling is done via Tailwind classes
button:disabled {
  pointer-events: none;
}
</style>
