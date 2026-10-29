<template>
  <component
    :is="tag"
    :class="{ 'kaannos-puuttuu': kaannosPuuttuu(value) }"
  >
    {{ $kaanna(value) }}
  </component>
</template>

<script setup lang="ts">
import { $kaanna } from '@shared/utils/globals';
import { kaannosPuuttuu } from '@shared/utils/kieli';

defineProps({
  value: {
    type: [Object, String],
    default: null,
  },
  tag: {
    type: String,
    default: 'span',
  },
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.kaannos-puuttuu {
  color: $grey500;
}
</style>
