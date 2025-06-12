<template>
  <div>
    <ep-search
      v-model="query"
      class="mb-4"
    />
    <poistetut-table
      :poistetut="rajatut"
      @palauta="palauta"
    />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed } from 'vue';
import { Kielet } from '@shared/stores/kieli';
import PoistetutTable from './PoistetutTable.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';

export interface Poistettu {
  id?: number;
  tyyppi?: any;
  nimi?: { [key: string]: string };
  luoja?: string;
  luotu?: Date;
  muokkaaja?: string;
  muokattu?: Date;
}

const props = defineProps({
  poistetut: {
    type: Array as () => Poistettu[],
    required: true,
  },
});

const emit = defineEmits(['palauta']);

const query = ref('');

const rajatut = computed(() => {
  const hakutermi = _.toLower(query.value);
  const kieli = Kielet.getSisaltoKieli.value;

  return _.chain(props.poistetut)
    .filter(p => _.includes(_.toLower(_.get(p, 'nimi.' + kieli)), hakutermi))
    .sortBy('muokattu')
    .reverse()
    .value();
});

function palauta(poistettu: Poistettu) {
  emit('palauta', poistettu);
}
</script>
