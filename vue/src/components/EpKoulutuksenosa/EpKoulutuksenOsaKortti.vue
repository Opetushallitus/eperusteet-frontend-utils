<template>
  <router-link :to="route">
    <div class="inline-flex align-items-start flex-col kortti ml-0 mr-3 my-3 pl-3 pt-3 pr-2 pb-2">
      <div class="font-bold mb-auto nimi">
        {{ $kaanna(koulutuksenosa.nimi) }}
      </div>
      <div class="w-full text-right laajuus">
        <span class="pr-1">
          {{ koulutuksenosa.laajuusMinimi }}-{{ koulutuksenosa.laajuusMaksimi }} {{ $t('viikkoa') }}
        </span>

        <EpColorCircle
          v-for="(laajuusmerkki, index) in laajuusmerkit"
          :key="'laajuusmerkki'+index"
          class="laajuusmerkki"
          :color="laajuusmerkki"
        />
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EpColorCircle from '@shared/components/EpColorIndicator/EpColorCircle.vue';

const props = defineProps({
  koulutuksenosa: {
    type: Object,
    required: true,
  },
  route: {
    type: [Object, String],
    required: true,
  },
});

const laajuusmerkit = computed(() => {
  return [
    props.koulutuksenosa.laajuusMaksimi >= 10 ? '#E75B00' : '#FCBF88',
    props.koulutuksenosa.laajuusMaksimi >= 20 ? '#E75B00' : '#FCBF88',
    props.koulutuksenosa.laajuusMaksimi >= 30 ? '#E75B00' : '#FCBF88',
  ];
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables';
@import '@shared/styles/_mixins.scss';

  .kortti {
    background-color: #F8E1CC;
    border-radius: 0.5rem;
    min-height: 150px;
    width: 200px;
    color: $black;

    @include tile-background-shadow;

    &:hover {
      @include tile-background-shadow-selected;
    }

    .laajuus {
      font-size: 0.8rem;

      .laajuusmerkki {
        margin-right: 2px;
      }
    }

  }

</style>
