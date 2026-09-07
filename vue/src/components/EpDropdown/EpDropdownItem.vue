<template>
  <RouterLink
    v-if="to && !disabled"
    :to="to"
    class="ep-dropdown-item ep-dropdown-item-link flex items-center px-3 py-1 no-underline text-inherit transition-colors"
    @click="closeDropdown?.()"
  >
    <slot />
  </RouterLink>
  <span
    v-else-if="to && disabled"
    class="ep-dropdown-item flex items-center px-3 py-1 opacity-50 cursor-not-allowed"
  >
    <slot />
  </span>
  <a
    v-else-if="href && !disabled"
    :href="href"
    class="ep-dropdown-item ep-dropdown-item-link flex items-center px-3 py-1 no-underline text-inherit transition-colors"
    @click="closeDropdown?.()"
  >
    <slot />
  </a>
  <span
    v-else-if="href && disabled"
    class="ep-dropdown-item flex items-center px-3 py-1 opacity-50 cursor-not-allowed"
  >
    <slot />
  </span>
  <button
    v-else
    type="button"
    class="ep-dropdown-item ep-dropdown-item-button flex items-center px-3 py-1 w-full text-left cursor-pointer transition-colors"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  href: {
    type: String,
    default: undefined,
  },
  to: {
    type: [String, Object],
    default: undefined,
  },
});

const emit = defineEmits<{
  click: [];
}>();

const closeDropdown = inject<(() => void) | undefined>('epDropdownClose');

function handleClick() {
  if (!props.disabled) {
    emit('click');
    closeDropdown?.();
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

a {
  color: $black;
}

.ep-dropdown-item-button {
  background: transparent;
  border: none;
  color: inherit;
  font: inherit;
}

.ep-dropdown-item-link:hover,
.ep-dropdown-item-button:hover:not(:disabled) {
  background-color: $grey50;
}
</style>
