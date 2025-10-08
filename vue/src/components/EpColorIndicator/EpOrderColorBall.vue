<template>
  <span :style="'color:' + kohdealueVarit[index]">
    <EpMaterialIcon size="14px">circle</EpMaterialIcon>
  </span>
</template>

<script setup lang="ts">
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
});

const kohdealueVarit = ['#99B3F1', '#9BDCFF', '#B2B2B2', '#002D99', '#FFD900', '#E60895', '#C126B8', '#575757',
  '#2e3192', '#8283be', '#663300', '#a38566', '#666600', '#a3a366'];
</script>

<style lang="scss" scoped>
</style>
