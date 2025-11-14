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
          <span v-if="data.navigationNode && data.navigationNode.label">({{ $kaanna(data.navigationNode.label) }})</span>
        </IkoniTeksti>
      </router-link>
      <IkoniTeksti
        v-else
        :tyyppi="tyyppi"
      >
        {{ $t(data.kuvaus) }}
        <span v-if="data.navigationNode && data.navigationNode.label">({{ $kaanna(data.navigationNode.label) }})</span>
      </IkoniTeksti>
    </template>
  </EpNaytaKaikki>
</template>

<script setup lang="ts">
import { VirheHuomautus } from './EpJulkaisuValidointi.vue';
import IkoniTeksti from './IkoniTeksti.vue';
import EpNaytaKaikki from '@shared/components//EpNaytaKaikki/EpNaytaKaikki.vue';

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
