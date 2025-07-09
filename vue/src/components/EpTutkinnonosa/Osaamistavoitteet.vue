<template>
  <div>
    <ep-collapse :border-bottom="true">
      <template #header>
        <h3>{{ nimi }}</h3>
      </template>
      <EpAmmattitaitovaatimukset
        v-if="perusteenOsaamistavoite"
        tavoitekoodisto="osaamistavoitteet"
        :value="perusteenOsaamistavoite.tavoitteet"
        :is-editing="false"
      />
    </ep-collapse>

    <ep-collapse
      :border-bottom="true"
      :collapsable="!isEditing"
      :class="{'pt-0 pb-0': isEditing}"
    >
      <template #header>
        <h3 v-if="!isEditing">
          {{ $t('arviointi') }}
        </h3>
      </template>
      <div v-if="perusteData">
        <GeneerinenArviointiTaulukko
          v-if="perusteData.geneerinenArviointiasteikko"
          :arviointi="perusteData.geneerinenArviointiasteikko"
        />
        <Arviointi2020Taulukko
          v-else-if="perusteData.tyyppi === 'osaalue2020' && perusteData.arviointi"
          :arviointi="perusteData.arviointi"
        />
      </div>
      <div
        v-else
        class="alert alert-warning"
      >
        {{ $t('perusteella-virheellinen-arviointi') }}
      </div>
    </ep-collapse>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, getCurrentInstance } from 'vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpEditointi from '@shared/components/EpEditointi/EpEditointi.vue';
import GeneerinenArviointiTaulukko from '@shared/components/EpTutkinnonosa/GeneerinenArviointiTaulukko.vue';
import Arviointi2020Taulukko from '@shared/components/EpTutkinnonosa/Arviointi2020Taulukko.vue';
import EpAmmattitaitovaatimukset from '@shared/components/EpAmmattitaitovaatimukset/EpAmmattitaitovaatimukset.vue';
import { $t } from '@shared/utils/globals';

const props = defineProps({
  isEditing: {
    type: Boolean,
    required: false,
    default: false,
  },
  tyyppi: {
    type: [String, Object],
    required: true,
  },
  perusteData: {
    type: Object,
    default: null,
  },
});

const perusteenOsaamistavoite = computed(() => {
  if (props.perusteData) {
    if (props.tyyppi === 'pakollinen') {
      return props.perusteData.pakollisetOsaamistavoitteet;
    }
    else if (props.tyyppi === 'valinnainen') {
      return props.perusteData.valinnaisetOsaamistavoitteet;
    }
  }
  return null;
});

const nimi = computed(() => {
  const nimiStr = props.tyyppi === 'pakollinen'
    ? $t('pakolliset-osaamistavoitteet')
    : $t('valinnaiset-osaamistavoitteet');
  if (perusteenOsaamistavoite.value?.laajuus) {
    const laajuusosa = ', ' + perusteenOsaamistavoite.value.laajuus + ' ' + $t('osaamispistetta');
    return nimiStr + laajuusosa;
  }
  else {
    return nimiStr;
  }
});
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";
@import '@shared/styles/_mixins.scss';
</style>
