<template>
  <b-table
    responsive
    striped
    hover
    :items="items"
    :fields="fields"
  >
    <template #cell(nimi)="data">
      {{ $kaanna(data.value) }}
    </template>
    <template #cell(muokattu)="data">
      {{ $ago(data.value) }}
    </template>
    <template #cell(actions)="row">
      <ep-button
        variant="link"
        icon="keyboard_return"
        :show-spinner="isPalautettu(row.item)"
        @click="palauta(row.item)"
      >
        {{ $t('palauta') }}
      </ep-button>
    </template>
  </b-table>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance } from 'vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import Poistettu from './PoistetutHakuTable.vue';
import EpSpinnerInline from '@shared/components/EpSpinner/EpSpinnerInline.vue';
import _ from 'lodash';

const instance = getCurrentInstance();
const $t = instance?.appContext.config.globalProperties.$t;
const $kaanna = instance?.appContext.config.globalProperties.$kaanna;
const $ago = instance?.appContext.config.globalProperties.$ago;

const props = defineProps({
  poistetut: {
    type: Array as () => Poistettu[],
    required: true,
  },
});

const emit = defineEmits(['palauta']);

const palautettu = ref<Poistettu[]>([]);

const items = computed(() => {
  return props.poistetut;
});

const fields = computed(() => {
  return [{
    label: $t('nimi'),
    key: 'nimi',
    sortable: true,
    class: 'align-middle',
  }, {
    label: $t('poistoajankohta'),
    key: 'muokattu',
    sortable: true,
    class: 'align-middle',
  }, {
    label: $t('poistaja'),
    key: 'muokkaaja',
    sortable: true,
    class: 'align-middle',
  }, {
    key: 'actions',
    label: '',
    thStyle: { borderBottom: '0px' },
    class: 'align-middle',
  }];
});

const isPalautettu = (item: Poistettu) => {
  return _.includes(palautettu.value, item);
};

const palauta = (poistettu: Poistettu) => {
  palautettu.value = [...palautettu.value, poistettu];
  emit('palauta', poistettu);
};
</script>
