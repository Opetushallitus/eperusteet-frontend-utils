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
import { unref } from 'vue';

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
    return unref(props.store.dokumentti);
  }

  return null;
});

const dokumenttiHref = computed(() => {
  return unref(props.store?.dokumenttiHref);
});

const dokumenttiJulkaisu = computed(() => {
  if (props.store) {
    return unref(props.store.dokumenttiJulkaisu);
  }

  return null;
});

const dokumenttiJulkaisuHref = computed(() => {
  return unref(props.store?.dokumenttiJulkaisuHref);
});

const isPolling = computed(() => {
  return unref(props.store?.polling);
});

const julkaisudokumenttiJaDokumenttiSamat = computed(() => {
  return unref(dokumenttiJulkaisu) && unref(dokumentti)?.id === unref(dokumenttiJulkaisu)?.id;
});

function luoPdf() {
  props.store?.luoPdf();
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

</style>
