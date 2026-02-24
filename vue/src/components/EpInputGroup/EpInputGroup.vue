<template>
  <InputGroup class="ep-input-group">
    <slot />
    <InputGroupAddon v-if="$slots.append">
      <slot name="append" />
    </InputGroupAddon>
  </InputGroup>
</template>

<script setup lang="ts">
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
</script>

<style scoped lang="scss">
.ep-input-group {
  display: flex;
}
</style>
