<template>
  <div class="ep-tab-content">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'EpTab',
});

defineProps({
  title: {
    type: String,
    required: true,
  },
  tabIndex: {
    type: Number,
    default: 0,
  },
});
</script>

<style scoped lang="scss">
.ep-tab-content {
  margin-top: 1rem;
}
</style>
