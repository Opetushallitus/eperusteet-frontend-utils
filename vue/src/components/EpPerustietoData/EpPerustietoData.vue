<template>
  <div class="data-content d-flex">
    <div class="pr-3">
      <EpMaterialIcon>{{ icon }}</EpMaterialIcon>
    </div>
    <div>
      <div class="topic">
        <h4 class="mb-1">
          <slot name="header">
            {{ topic }}
          </slot>
        </h4>
      </div>
      <div><slot /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: false
  }
});
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

  .icon {
    color: $blue-lighten-6;
    vertical-align: top;
    font-size: 22px;
  }

</style>
