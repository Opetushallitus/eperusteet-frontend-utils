<template>
  <div class="linkki">
    <a
      :href="url"
      rel="noopener noreferrer"
      target="_blank"
    >
      <EpMaterialIcon
        v-if="icon && !iconRight"
        class="mr-1"
        size="18px"
        :alt="$t('avautuu-uuteen-valilehteen')"
      >
        {{ icon }}
      </EpMaterialIcon>
      <slot v-if="hasSlot" />
      <span v-else>{{ cleanUrl }}</span>
      <EpMaterialIcon
        v-if="icon && iconRight"
        class="ml-1"
        size="18px"
        :alt="$t('avautuu-uuteen-valilehteen')"
      >
        {{ icon }}
      </EpMaterialIcon>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { hasSlotContent } from '@shared/utils/vue-utils';

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    default: '',
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

const slots = useSlots();

const hasSlot = computed(() => {
  return hasSlotContent(slots.default);
});

const cleanUrl = computed(() => {
  let result = props.url
    ? (props.url.replace(/^https?:\/\//, ''))
    : '';

  result = result.replace(/^mailto?:/, '');

  if (props.onlyTopLevel) {
    const idx = result.indexOf('/');
    if (idx > 0) {
      result = result.substr(0, idx);
    }
  }
  return result;
});
</script>

<style scoped lang="scss">

.linkki {
  a {
    display: inline;
  }
}

// Käytetään external linkin kanssa
.linkki.medium {
  font-size: 1rem;

  a {
    white-space: normal; // Saattaa olla liian pitkä
  }
}
</style>
