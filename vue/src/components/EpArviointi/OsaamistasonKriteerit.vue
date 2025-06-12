<template>
  <div>
    <OsaamistasonKriteeri
      v-for="(osaamistasonkriteeri, osaamistasoIndex) in osaamistasonKriteerit"
      :key="'osaamistasonkriteeri'+osaamistasonkriteeri._osaamistaso"
      v-model="osaamistasonKriteerit[osaamistasoIndex]"
      class="mb-3 ml-0 p-1 taulukko-rivi-varitys"
      :is-editing="isEditing"
      :arviointiasteikko="arviointiasteikko"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as _ from 'lodash';
import OsaamistasonKriteeri from '@shared/components/EpArviointi/OsaamistasonKriteeri.vue';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  isEditing: {
    type: Boolean,
    required: true,
  },
  arviointiasteikko: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const osaamistasonKriteerit = computed({
  get: () => _.sortBy(props.modelValue, '_osaamistaso'),
  set: (val) => {
    emit('update:modelValue', val);
  },
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
