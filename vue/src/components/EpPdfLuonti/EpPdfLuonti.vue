<template>
  <div>
    <EpPdfDokumentti v-if="dokumenttiJulkaisu && naytaJulkaistu"
                     :dokumentti="dokumenttiJulkaisu"
                     :dokumentti-href="dokumenttiJulkaisuHref"
                     :is-polling="false"
                     :pdfnimi="pdfnimi">
    </EpPdfDokumentti>
    <hr v-if="!julkaisudokumenttiJaDokumenttiSamat && naytaJulkaistu">
    <EpPdfDokumentti v-if="!julkaisudokumenttiJaDokumenttiSamat"
                     :dokumentti="dokumentti"
                     :dokumentti-href="dokumenttiHref"
                     :is-polling="isPolling"
                     :pdfnimi="pdfnimi">
    </EpPdfDokumentti>
    <div class="btn-group">
      <ep-button @click="luoPdf"
                 :disabled="isPolling || !dokumentti"
                 :show-spinner="isPolling"
                 buttonClass="px-5"><span>{{ $t('luo-uusi-pdf') }}</span></ep-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Kielet } from '@shared/stores/kieli';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import { IDokumenttiStore } from '@shared/tyypit';
import EpPdfDokumentti from '@shared/components/EpPdfLuonti/EpPdfDokumentti.vue';

@Component({
  components: {
    EpButton,
    EpPdfDokumentti,
  },
})
export default class EpPdfLuonti extends Vue {
  @Prop({ required: true })
  protected store!: IDokumenttiStore;

  @Prop({ required: true })
  protected pdfnimi!: string;

  @Prop({ required: false, default: true })
  protected naytaJulkaistu!: boolean;

  get dokumentti() {
    if (this.store) {
      return this.store.dokumentti.value;
    }
  }

  get dokumenttiHref() {
    return this.store?.dokumenttiHref.value;
  }

  get dokumenttiJulkaisu() {
    if (this.store) {
      return this.store.dokumenttiJulkaisu.value;
    }
  }

  get dokumenttiJulkaisuHref() {
    return this.store?.dokumenttiJulkaisuHref.value;
  }

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get isPolling() {
    return this.store?.polling.value;
  }

  luoPdf() {
    this.store?.luoPdf();
  }

  get julkaisudokumenttiJaDokumenttiSamat() {
    return this.dokumenttiJulkaisu && this.dokumentti?.id === this.dokumenttiJulkaisu?.id;
  }
}

</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

</style>
