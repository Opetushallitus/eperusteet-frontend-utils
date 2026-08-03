const sidebarRegistry: Map<string, { toggle: () => void }> = new Map();

export function registerSidebar(id: string, toggle: () => void) {
  sidebarRegistry.set(id, { toggle });
}

export function unregisterSidebar(id: string) {
  sidebarRegistry.delete(id);
}

export function getSidebarToggle(id: string) {
  return sidebarRegistry.get(id)?.toggle;
}

export const vBToggle = {
  mounted(el: HTMLElement, binding: { value?: string; arg?: string }) {
    const id = binding.arg || binding.value;
    if (!id) return;

    el.addEventListener('click', () => {
      const toggle = getSidebarToggle(id);
      toggle?.();
    });
  },
};
