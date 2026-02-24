<template>
  <div class="ep-dropdown inline-block">
    <div
      ref="triggerRef"
      class="ep-dropdown-trigger cursor-pointer"
      @click="handleToggle"
    >
      <slot name="button-content" />
    </div>
    <Popover
      ref="popoverRef"
      append-to="body"
      :pt="popoverPt"
    >
      <slot />
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, computed } from 'vue';
import Popover from 'primevue/popover';

const props = defineProps({
  right: {
    type: Boolean,
    default: false,
  },
  noCaret: {
    type: Boolean,
    default: false,
  },
  contentClass: {
    type: String,
    default: '',
  },
});

const triggerRef = ref<HTMLElement | null>(null);
const popoverRef = ref<InstanceType<typeof Popover> | null>(null);

function hide() {
  popoverRef.value?.hide();
}

provide('epDropdownClose', hide);

const popoverPt = computed(() => ({
  root: {
    class: 'ep-dropdown-popover',
  },
  content: {
    class: `!p-0 !pt-2 !pb-2 min-w-0 ${props.contentClass}`.trim(),
  },
}));

function handleToggle(event: Event) {
  popoverRef.value?.toggle(event);
}

defineExpose({
  show: (event?: Event) => {
    const e = event ?? (triggerRef.value ? { currentTarget: triggerRef.value } as unknown as Event : undefined);
    if (e) popoverRef.value?.show(e);
  },
  hide: () => popoverRef.value?.hide(),
  toggle: (event?: Event) => {
    const e = event ?? (triggerRef.value ? { currentTarget: triggerRef.value } as unknown as Event : undefined);
    if (e) popoverRef.value?.toggle(e);
  },
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.ep-dropdown-trigger {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}

:deep(.ep-dropdown-popover) {
  .p-popover-content {
    padding: 0 !important;
    color: $black;
  }
}
</style>
