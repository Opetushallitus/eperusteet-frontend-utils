<template>
  <div class="julkaisuhistoria mt-4">
    <EpSpinner v-if="!julkaisut" />
    <template v-else>
      <div
        v-if="julkaisut.length === 0"
        class="alert alert-info"
      >
        <slot name="empty">
          {{ $t('ei-julkaisuja') }}
        </slot>
      </div>
      <div v-else>
        <EpJulkaisuLista
          :julkaisut="julkaisutMapped"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpJulkaisuLista from '@shared/components/EpJulkaisuHistoriaJulkinen/EpJulkaisuLista.vue';

interface Julkaisu {
  muutosmaaraysVoimaan?: Date;
  revision?: number;
  julkinenTiedote?: { [key: string]: string; };
  luotu?: Date;
  tila?: 'JULKAISTU' | 'KESKEN' | 'VIRHE';
  liitteet?: any;
  peruste?: {
    id: number;
  };
}

const props = defineProps({
  julkaisut: {
    type: Array as () => Julkaisu[],
    required: false,
    default: () => [],
  },
  naytaKaikki: {
    type: Boolean,
    default: false,
  },
});

const sliceSize = computed(() => {
  return props.naytaKaikki ? props.julkaisut.length : 2;
});

function muutosmaaraysLiite(julkaisu: Julkaisu) {
  if (julkaisu.liitteet && julkaisu.liitteet.length > 0) {
    julkaisu.liitteet.forEach(liiteData => {
      liiteData.url = `/eperusteet-service/api/perusteet/${julkaisu.peruste?.id ?? 0}/julkaisu/liitteet/${liiteData.liite.id}`;
    });
    return julkaisu.liitteet;
  }
  else {
    return [];
  }
}

const julkaisutMapped = computed(() => {
  return _.chain(props.julkaisut)
    .map(julkaisu => {
      return {
        ...julkaisu,
        tila: julkaisu.tila || 'JULKAISTU',
        liitteet: muutosmaaraysLiite(julkaisu),
      };
    })
    .sortBy('revision')
    .reverse()
    .value();
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables';

:deep(.ep-collapse .header) {
  color: #3367E3;
}

</style>
