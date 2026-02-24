<template>
  <div class="ep-dropdown-text px-3 py-2">
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.ep-dropdown-text {
  color: $grey700;
}
</style>
