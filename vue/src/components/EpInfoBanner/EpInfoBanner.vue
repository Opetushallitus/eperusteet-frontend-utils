<template>
  <div class="ep-info-banner d-flex p-3">
    <EpMaterialIcon class="icon mr-2">
      info
    </EpMaterialIcon>
    <div><slot /></div>
  </div>
</template>

<script setup lang="ts">
// This component doesn't have any props, methods or computed properties
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

 .ep-info-banner {
  background-color: $blue-lighten-4;
  border-radius: 5px;
 }

 .icon {
  color: $paletti-blue;
 }

</style>
