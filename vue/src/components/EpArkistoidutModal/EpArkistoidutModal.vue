<template>
  <div>
    <EpButton
      v-b-modal.arkistoidutModal
      variant="link"
      icon="folder"
    >
      <slot name="title">
        <span>{{ $t('arkistoidut') }}</span>
      </slot>
    </EpButton>
    <b-modal
      id="arkistoidutModal"
      ref="arkistoidutModal"
      size="lg"
      :hide-footer="true"
    >
      <template #modal-title>
        <div>
          {{ $t('arkistoidut') + ' (' + arkistoidut.length + ')' }}
        </div>
      </template>
      <div class="search">
        <EpSearch v-model="query" />
      </div>
      <b-table
        responsive
        borderless
        striped
        :items="arkistoidutSortedFiltered"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
      >
        <template #cell(nimi)="data">
          {{ $kaanna(data.value) }}
        </template>
        <template #cell(muokattu)="data">
          {{ $sdt(data.value) }}
        </template>
        <template #cell(siirtyminen)="data">
          <slot
            name="palauta"
            :data="data"
          />
        </template>
      </b-table>
      <b-pagination
        v-model="currentPage"
        :total-rows="arkistoidutSortedFiltered.length"
        :per-page="perPage"
        aria-controls="arkistoidut"
        align="center"
      />
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance } from 'vue';
import _ from 'lodash';

import { Kielet } from '@shared/stores/kieli';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { $t, $kaanna, $sdt } from '@shared/utils/globals';

interface Palautettava {
  nimi: any;
  muokattu: any;
}

const props = defineProps({
  arkistoidut: {
    type: Array as () => Palautettava[],
    required: false,
    default: () => [],
  },
});

const query = ref('');
const currentPage = ref(1);
const perPage = ref(10);

const arkistoidutSortedFiltered = computed(() => {
  return _.chain(props.arkistoidut)
    .filter(arkistoitu => Kielet.search(query.value, arkistoitu.nimi))
    .orderBy('muokattu', 'desc')
    .value();
});

const fields = computed(() => {
  return [{
    key: 'nimi',
    label: $t('nimi'),
  }, {
    key: 'muokattu',
    label: $t('poistettu'),
    sortable: true,
  }, {
    key: 'siirtyminen',
    label: '',
  }];
});
</script>

<style lang="scss" scoped>
:deep(.b-table.table-borderless thead th) {
  border: none;
}
</style>
