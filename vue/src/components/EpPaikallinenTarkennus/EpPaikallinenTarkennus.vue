<template>
  <div class="paikallinen-tarkennus-alue">
    <ep-collapse
      v-if="avattava && !noheader"
      tyyppi="paikallinen-teksti"
      :border-bottom="false"
      :use-padding="false"
    >
      <template #header>
        <div class="otsikko">
          <slot name="header">
            <h4
              v-if="headerh4"
              class="mb-0"
            >
              {{ $t('paikallinen-teksti') }}
            </h4>
            <div
              v-else
              class="otsikko"
            >
              {{ $t('paikallinen-teksti') }}
            </div>
          </slot>
        </div>
      </template>
      <slot />
    </ep-collapse>

    <div
      v-else
      class="vain-teksti"
    >
      <slot
        v-if="!noheader"
        name="header"
      >
        <h4 v-if="headerh4">
          {{ $t('paikallinen-teksti') }}
        </h4>
        <div
          v-else
          class="otsikko"
        >
          {{ $t('paikallinen-teksti') }}
        </div>
      </slot>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';

const props = defineProps({
  avattava: {
    type: Boolean,
    default: true,
  },
  headerh4: {
    type: Boolean,
    default: false,
  },
  noheader: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.paikallinen-tarkennus-alue {
  border-radius: 1rem;
  background-color: $ylops-paikallinen-color;
  padding: 0.8rem;

  .vain-teksti {
    .otsikko {
      margin-bottom: 8px;
    }
  }

  .otsikko {
    font-weight: 600;
  }
}
</style>
