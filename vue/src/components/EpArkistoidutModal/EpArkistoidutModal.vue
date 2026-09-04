<template>
  <div>
    <EpButton
      variant="link"
      icon="folder"
      @click="modalRef?.show()"
    >
      <slot name="title">
        <span>{{ $t('arkistoidut') }}</span>
      </slot>
    </EpButton>
    <EpModal
      ref="modalRef"
      size="lg"
      hide-footer
    >
      <template #modal-title>
        <div>
          {{ $t('arkistoidut') + ' (' + arkistoidut.length + ')' }}
        </div>
      </template>
      <div class="search">
        <EpSearch v-model="query" />
      </div>
      <EpTable
        responsive
        borderless
        striped
        :items="arkistoidutSortedFiltered"
        :fields="fields"
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
      </EpTable>
    </EpModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import _ from 'lodash';

import { Kielet } from '@shared/stores/kieli';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpModal from '@shared/components/EpModal/EpModal.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { $t, $kaanna, $sdt } from '@shared/utils/globals';
import EpTable from '@shared/components/EpTable/EpTable.vue';

const modalRef = ref<InstanceType<typeof EpModal> | null>(null);

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
:deep(.ep-table.borderless .p-datatable thead th) {
  border: none;
}
</style>
