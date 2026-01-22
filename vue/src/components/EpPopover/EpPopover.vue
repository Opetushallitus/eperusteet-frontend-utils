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
      @show="handleShow"
      @hide="handleHide"
    >
      <template v-if="$slots.header" #header>
        <slot name="header" />
      </template>
      <slot />
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Popover from 'primevue/popover';

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
});

const emit = defineEmits<{
  show: [];
  hide: [];
}>();

const popover = ref();
const triggerRef = ref();

const handleMouseEnter = (event: MouseEvent) => {
  if (props.disabled || !props.triggers.includes('hover')) return;
  if (popover.value) {
    popover.value.show(event);
  }
};

const handleMouseLeave = () => {
  if (props.disabled || !props.triggers.includes('hover')) return;
  if (popover.value) {
    popover.value.hide();
  }
};

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
