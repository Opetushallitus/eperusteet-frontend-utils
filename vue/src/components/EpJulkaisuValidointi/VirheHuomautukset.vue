<template>
  <EpNaytaKaikki
    :value="virhehuomautukset"
    striped
  >
    <template #default="{ data }">
      <router-link
        v-if="data.route"
        :to="data.route"
      >
        <IkoniTeksti :tyyppi="tyyppi">
          {{ $t(data.kuvaus) }}
          <span v-if="data.navigationNode?.label">{{ formatNavigationLabel(data.navigationNode) }}</span>
        </IkoniTeksti>
      </router-link>
      <IkoniTeksti
        v-else
        :tyyppi="tyyppi"
      >
        {{ $t(data.kuvaus) }}
        <span v-if="data.navigationNode?.label">{{ formatNavigationLabel(data.navigationNode) }}</span>
      </IkoniTeksti>
    </template>
  </EpNaytaKaikki>
</template>

<script setup lang="ts">
import { VirheHuomautus } from './EpJulkaisuValidointi.vue';
import IkoniTeksti from './IkoniTeksti.vue';
import EpNaytaKaikki from '@shared/components//EpNaytaKaikki/EpNaytaKaikki.vue';
import { NavigationNodeDto } from '@shared/tyypit';
import { $kaanna, $kaannaOlioTaiTeksti } from '@shared/utils/globals';

function formatNavigationLabel(navigationNode: NavigationNodeDto): string {
  let label = `(${$kaanna(navigationNode.label)}`;
  const validationPostLabel = navigationNode.meta?.validationPostLabel;
  if (validationPostLabel) {
    label += `, ${$kaannaOlioTaiTeksti(validationPostLabel)}`;
  }
  return `${label})`;
}

defineProps({
  virhehuomautukset: {
    type: Array as () => VirheHuomautus[],
    required: true,
  },
  tyyppi: {
    type: String as () => 'virhe' | 'huomautus',
    required: true,
  },
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
