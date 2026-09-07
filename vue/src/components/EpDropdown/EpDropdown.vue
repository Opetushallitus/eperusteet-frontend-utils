<template>
  <div class="ep-dropdown inline-block">
    <button
      ref="triggerRef"
      type="button"
      class="ep-dropdown-trigger"
      :class="{
        'ep-dropdown-trigger--primary': variant === 'primary',
        'ep-dropdown-trigger--link': variant === 'link',
      }"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      @click="handleToggle"
    >
      <slot name="button-content" />
      <EpMaterialIcon
        v-if="!noCaret"
        class="ep-dropdown-caret"
        aria-hidden="true"
      >
        expand_more
      </EpMaterialIcon>
    </button>
    <Popover
      ref="popoverRef"
      append-to="body"
      :pt="popoverPt"
      @show="onShow"
      @hide="onHide"
    >
      <slot />
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, provide, ref, useTemplateRef } from 'vue';
import Popover from 'primevue/popover';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

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
  variant: {
    type: String,
    default: '',
  },
});

const triggerRef = useTemplateRef<HTMLButtonElement>('triggerRef');
const popoverRef = useTemplateRef<InstanceType<typeof Popover>>('popoverRef');
const isOpen = ref(false);

function hide() {
  popoverRef.value?.hide();
}

provide('epDropdownClose', hide);

const popoverPt = computed(() => ({
  root: {
    class: ['ep-dropdown-popover', props.right ? 'ep-dropdown-popover--right' : ''],
  },
  content: {
    class: `!p-0 !pt-2 !pb-2 min-w-0 ${props.contentClass}`.trim(),
  },
}));

function handleToggle(event: Event) {
  popoverRef.value?.toggle(event);
}

async function onShow() {
  isOpen.value = true;
  if (props.right) {
    await nextTick();
    alignRight();
  }
}

function onHide() {
  isOpen.value = false;
}

function alignRight() {
  const popoverEl = (popoverRef.value as any)?.$el as HTMLElement | undefined;
  const trigger = triggerRef.value;
  if (!popoverEl || !trigger) {
    return;
  }
  const triggerRect = trigger.getBoundingClientRect();
  const popoverRect = popoverEl.getBoundingClientRect();
  const left = Math.max(8, triggerRect.right - popoverRect.width);
  popoverEl.style.left = `${left}px`;
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
  align-items: center;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  padding: 0;
  vertical-align: middle;

  &--primary {
    background: $blue3;
    border-color: transparent;
    border-radius: 9999px;
    color: $white;
    font-weight: 400;
    padding: 0.25rem 0.5rem;

    &:hover {
      background: $blue2;
    }
  }

  &--link {
    color: $link;
    padding: 0;

    &:hover {
      color: $link-hover-color;
      text-decoration: underline;
    }
  }
}

.ep-dropdown-caret {
  margin-left: 0.25rem;
}

:deep(.ep-dropdown-popover) {
  .p-popover-content {
    padding: 0 !important;
    color: $black;
  }
}
</style>
