<template>
  <div class="ep-popover-wrapper">
    <div
      ref="triggerRef"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <slot name="trigger" />
    </div>
    <Popover
      ref="popover"
      :class="popoverClass"
      @show="handleShow"
      @hide="handleHide"
    >
      <div
        class="ep-popover-hover-target"
        @mouseenter="handlePopoverMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <template
          v-if="$slots.header"
        >
          <slot name="header" />
        </template>
        <slot />
      </div>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import Popover from 'primevue/popover';

/** Delay before hiding on hover leave so the pointer can cross the gap to the teleported popover. */
const HOVER_HIDE_DELAY_MS = 200;

export type PopoverTrigger = 'hover' | 'click' | 'focus' | 'manual';

const props = defineProps({
  triggers: {
    type: Array as () => PopoverTrigger[],
    default: () => ['hover', 'click'],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  popoverClass: {
    type: String,
    default: 'w-100',
  },
});

const emit = defineEmits<{
  show: [];
  hide: [];
}>();

const popover = ref();
const triggerRef = ref();

let hoverHideTimeoutId: number | null = null;

const clearHoverHideTimeout = () => {
  if (hoverHideTimeoutId !== null) {
    window.clearTimeout(hoverHideTimeoutId);
    hoverHideTimeoutId = null;
  }
};

const scheduleHoverHide = () => {
  if (props.disabled || !props.triggers.includes('hover')) return;
  clearHoverHideTimeout();
  hoverHideTimeoutId = window.setTimeout(() => {
    hoverHideTimeoutId = null;
    popover.value?.hide();
  }, HOVER_HIDE_DELAY_MS);
};

const handleMouseEnter = (event: MouseEvent) => {
  if (props.disabled || !props.triggers.includes('hover')) return;
  clearHoverHideTimeout();
  if (popover.value) {
    popover.value.show(event);
  }
};

const handlePopoverMouseEnter = () => {
  if (props.disabled || !props.triggers.includes('hover')) return;
  clearHoverHideTimeout();
};

const handleMouseLeave = () => {
  scheduleHoverHide();
};

onBeforeUnmount(() => {
  clearHoverHideTimeout();
});

const handleClick = (event: MouseEvent) => {
  if (props.disabled || !props.triggers.includes('click')) return;
  if (popover.value) {
    popover.value.toggle(event);
  }
};

const handleFocus = (event: FocusEvent) => {
  if (props.disabled || !props.triggers.includes('focus')) return;
  if (popover.value) {
    popover.value.show(event);
  }
};

const handleBlur = () => {
  if (props.disabled || !props.triggers.includes('focus')) return;
  if (popover.value) {
    popover.value.hide();
  }
};

const handleShow = () => {
  emit('show');
};

const handleHide = () => {
  emit('hide');
};

// Expose methods for manual control
defineExpose({
  show: (event?: Event) => popover.value?.show(event),
  hide: () => popover.value?.hide(),
  toggle: (event?: Event) => popover.value?.toggle(event),
});
</script>

<style scoped lang="scss">
.ep-popover-wrapper {
  display: inline-block;
}
</style>
