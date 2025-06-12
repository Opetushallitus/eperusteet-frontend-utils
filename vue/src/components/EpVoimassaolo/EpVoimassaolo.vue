<template>
  <span
    v-if="voimassa"
    class="ml-2"
  >
    <EpColorIndicator
      :size="10"
      background-color="#4c7f00"
      :tooltip="false"
      kind=""
    />
    {{ $t('voimassa') }}
  </span>
  <span
    v-else-if="tulossa"
    class="ml-2"
  >
    <EpColorIndicator
      :size="10"
      background-color="#5BCA13"
      :tooltip="false"
      kind=""
    />
    {{ $t('tulossa-voimaan') }}
  </span>
  <span
    v-else-if="siirtymaAjalla"
    class="ml-2"
  >
    <EpColorIndicator
      :size="10"
      background-color="#F5B800"
      :tooltip="false"
      kind=""
    />
    {{ $t('ajoitus-siirtyma') }}
  </span>
  <span
    v-else-if="eraantynyt"
    class="ml-2"
  >
    <EpColorIndicator
      :size="10"
      background-color="#FF5000"
      :tooltip="false"
      kind=""
    />
    {{ $t('ei-voimassa') }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';

interface Voimassaolo {
  voimaantulo?: number;
  voimassaoloAlkaa?: number;
  voimassaoloLoppuu?: number;
  siirtymaPaattyy?: number;
}

const props = defineProps({
  voimassaolo: {
    type: Object as () => Voimassaolo,
    required: true,
  },
});

const voimassaolonAlku = computed(() => {
  return props.voimassaolo.voimaantulo || props.voimassaolo.voimassaoloAlkaa;
});

const eraantynyt = computed(() => {
  return props.voimassaolo.voimassaoloLoppuu && Date.now() > props.voimassaolo.voimassaoloLoppuu;
});

const voimassa = computed(() => {
  return voimassaolonAlku.value && voimassaolonAlku.value < Date.now() && (!props.voimassaolo.voimassaoloLoppuu || Date.now() < props.voimassaolo.voimassaoloLoppuu);
});

const tulossa = computed(() => {
  return voimassaolonAlku.value && voimassaolonAlku.value > Date.now();
});

const siirtymaAjalla = computed(() => {
  return props.voimassaolo.siirtymaPaattyy && Date.now() < props.voimassaolo.siirtymaPaattyy;
});
</script>

<style scoped lang="scss">

</style>
