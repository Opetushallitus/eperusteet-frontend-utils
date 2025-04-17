<template>
  <div>
    <EpMaterialIcon :class="tyyppi">
      {{ icon }}
    </EpMaterialIcon>
    <span class="pl-2"><slot /></span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const props = defineProps({
  tyyppi: {
    type: String as () => 'virhe' | 'huomautus' | 'kaikki-kunnossa',
    required: true,
  },
});

const icon = computed(() => {
  if (props.tyyppi === 'kaikki-kunnossa') {
    return 'check_circle';
  }
  return 'info';
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .virhe {
    color: $red;
  }

  .huomautus {
    color: $yellow;
  }

  .kaikki-kunnossa {
    color: $green;
  }

</style>
