<template>
  <div>
    <EpPdfDokumentti
      v-if="dokumenttiJulkaisu && naytaJulkaistu"
      :dokumentti="dokumenttiJulkaisu"
      :dokumentti-href="dokumenttiJulkaisuHref"
      :is-polling="false"
      :pdfnimi="pdfnimi"
    />
    <hr v-if="!julkaisudokumenttiJaDokumenttiSamat && naytaJulkaistu">
    <EpPdfDokumentti
      v-if="!julkaisudokumenttiJaDokumenttiSamat"
      :dokumentti="dokumentti"
      :dokumentti-href="dokumenttiHref"
      :is-polling="isPolling"
      :pdfnimi="pdfnimi"
    />
    <div class="btn-group">
      <ep-button
        :disabled="isPolling || !dokumentti"
        :show-spinner="isPolling"
        button-class="px-5"
        @click="luoPdf"
      >
        <span>{{ $t('luo-uusi-pdf') }}</span>
      </ep-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Kielet } from '@shared/stores/kieli';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import { IDokumenttiStore } from '@shared/tyypit';
import EpPdfDokumentti from '@shared/components/EpPdfLuonti/EpPdfDokumentti.vue';

const props = defineProps({
  store: {
    type: Object as () => IDokumenttiStore,
    required: true,
  },
  pdfnimi: {
    type: String,
    required: true,
  },
  naytaJulkaistu: {
    type: Boolean,
    default: true,
  },
});

const dokumentti = computed(() => {
  if (props.store) {
    return props.store.dokumentti.value;
  }
});

const dokumenttiHref = computed(() => {
  return props.store?.dokumenttiHref.value;
});

const dokumenttiJulkaisu = computed(() => {
  if (props.store) {
    return props.store.dokumenttiJulkaisu.value;
  }
});

const dokumenttiJulkaisuHref = computed(() => {
  return props.store?.dokumenttiJulkaisuHref.value;
});

const kieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const isPolling = computed(() => {
  return props.store?.polling.value;
});

const julkaisudokumenttiJaDokumenttiSamat = computed(() => {
  return dokumenttiJulkaisu.value && dokumentti.value?.id === dokumenttiJulkaisu.value?.id;
});

function luoPdf() {
  props.store?.luoPdf();
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

</style>
