<template>
  <ep-linkki
    :class="styleclass"
    :url="url"
    :label="label"
    :icon="icon"
    :only-top-level="onlyTopLevel"
    :icon-right="iconRight"
  >
    <slot />
  </ep-linkki>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EpLinkki from '@shared/components/EpLinkki/EpLinkki.vue';

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  label: {
    type: String,
    required: false,
  },
  styleclass: {
    type: String,
    default: 'medium',
  },
  onlyTopLevel: {
    type: Boolean,
    default: true,
  },
  iconRight: {
    type: Boolean,
    default: false,
  },
});

const icon = computed(() => {
  if (props.showIcon) {
    return 'launch';
  }
  return '';
});

const urlWithQueryParam = computed(() => {
  return props.url + '?paluuosoite=' + encodeURIComponent(location.href);
});
</script>
