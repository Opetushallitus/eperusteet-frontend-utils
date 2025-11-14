<template>
  <img :src="src">
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  image: {
    type: String,
    required: true,
  },
});

const src = computed(() => {
  return new URL(`../../../public/img/icons/${props.image}`, import.meta.url).href;
});
</script>

<style lang="scss" scoped>
</style>
