<template>
  <component
    :is="to ? 'router-link' : 'div'"
    class="secondary-button d-inline-block"
    :to="to"
    @click="!to && $emit('click')"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
defineProps<{
  to?: { name?: string; path?: string; query?: Record<string, unknown> };
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<style lang="scss" scoped>
@import '../../styles/_variables.scss';

.secondary-button {
  color: $link-color;
  font-weight: 600;
  border: 2px solid $link-color;
  padding: 5px 15px;
  cursor: pointer;

  &:hover {
    color: $link-hover-color;
    border-color: $link-hover-color;
  }
}
</style>
