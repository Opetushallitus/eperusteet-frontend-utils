import { inject, provide, ref } from 'vue';

const SIDEBAR_TOGGLE_KEY = Symbol('sidebar-toggle');

export function provideSidebarToggle(visible: ReturnType<typeof ref<boolean>>) {
  provide(SIDEBAR_TOGGLE_KEY, {
    toggle: () => {
      visible.value = !visible.value;
    },
    show: () => {
      visible.value = true;
    },
    hide: () => {
      visible.value = false;
    },
  });
}

export function useSidebarToggle() {
  const toggle = inject<{ toggle: () => void; show: () => void; hide: () => void }>(SIDEBAR_TOGGLE_KEY);
  if (!toggle) {
    console.warn('useSidebarToggle: No sidebar toggle provided. Use provideSidebarToggle in the parent.');
    return {
      toggle: () => {},
      show: () => {},
      hide: () => {},
    };
  }
  return toggle;
}
