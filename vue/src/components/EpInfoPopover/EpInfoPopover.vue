<template>
  <EpPopover :triggers="['hover', 'click', 'focus']">
    <template #trigger>
      <EpMaterialIcon
        :id="'infopopup-' + uniqueId"
        class="default-icon clickable"
        icon-shape="outlined"
      >
        info
      </EpMaterialIcon>
    </template>
    <slot />
  </EpPopover>
</template>

<script setup lang="ts">
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpPopover from '../EpPopover/EpPopover.vue';
import _ from 'lodash';

const props = defineProps({
  // Käytä komponentin proppina uniqueId:tä, jos EpInfoPopover on käytössä useamman kerran samassa komponentissa, jotta popover näytetään oikeassa ikonissa.
  uniqueId: {
    type: String,
    required: false,
    default: () => _.uniqueId('infopopup-'),
  },
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
