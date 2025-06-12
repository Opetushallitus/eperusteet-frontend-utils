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
  return require(`../../../public/img/icons/${props.image}`);
});
</script>

<style lang="scss" scoped>
</style>
