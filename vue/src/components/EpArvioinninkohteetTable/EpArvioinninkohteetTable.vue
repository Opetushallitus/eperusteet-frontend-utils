<template>
  <EpTable
    striped
    :items="arvioinninKohteetSorted"
    :fields="sarakkeet"
  />
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import * as _ from 'lodash';
import { $t, $kaanna } from '@shared/utils/globals';
import EpTable from '@shared/components/EpTable/EpTable.vue';

const props = defineProps({
  arvioinninkohteet: {
    type: Array,
    required: true,
  },
});

const arvioinninKohteetSorted = computed(() => {
  return _.sortBy(props.arvioinninkohteet, 'arvosana');
});

const osaamisenKuvauksetTyhjia = computed(() => {
  return _.size(_.filter(props.arvioinninkohteet, kohde => kohde.arvosana !== null)) === 0;
});

const arvosanaSarake = computed(() => {
  return {
    key: 'arvosana',
    label: $t('arviointitaulukko-arvosana-otsikko'),
    thStyle: { width: '30%' },
    formatter: (value, key, item) => {
      if (value) {
        return $t('osaamisen-kuvaus-arvosanalle_' + value);
      }

      return '';
    },
  };
});

const osaamisenKuvausSarake = computed(() => {
  return {
    key: 'osaamisenKuvaus',
    label: $t('arviointitaulukko-osaaminen-otsikko'),
    formatter: (value, key, item) => {
      return $kaanna(value);
    },
  };
});

const sarakkeet = computed(() => {
  if (osaamisenKuvauksetTyhjia.value) {
    return [
      osaamisenKuvausSarake.value,
    ];
  }

  return [
    arvosanaSarake.value,
    osaamisenKuvausSarake.value,
  ];
});
</script>

<style lang="scss" scoped>

</style>
