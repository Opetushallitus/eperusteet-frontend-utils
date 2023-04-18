<template>
  <div >
    <ep-spinner v-if="!dokumentti" />
    <div v-else>
      <div class="row pdf-box align-items-center justify-content-between"
          :class="{'luotu': dokumenttiLuotu, 'ei-luotu': !dokumenttiLuotu, 'polling': isPolling, 'epaonnistui': dokumenttiEpaonnistui}">
        <div class="col col-auto ikoni">
          <img src="../../../public/img/icons/pdfkuva_lataus.svg" />
        </div>
        <div class="col-lg teksti">
          <span v-if="dokumenttiLuotu">
            {{ pdfTitle }}
          </span>
          <span v-else-if="dokumenttiEpaonnistui">
            {{$t('pdf-tiedosto-luonti-epaonnistui')}} <span v-if="dokumentti.virhekoodi">: {{$t('pdf-virhe-' + dokumentti.virhekoodi)}}</span>
          </span>
          <span v-else>
            {{$t('pdf-tiedostoa-ei-ole-viela-luotu')}}
          </span>
        </div>
        <div class="col-sm-2 text-left luomisaika" v-if="dokumenttiLuotu && !isPolling">
          <span class="luontitiedot">{{$t('luotu')}}: {{$sd(dokumentti.valmistumisaika)}}</span>
          <span class="luontitiedot" v-if="dokumentti.julkaisuDokumentti">{{$t('julkaistu')}}</span>
          <span class="luontitiedot" v-else>{{$t('tyoversio')}}</span>
        </div>
        <div class="col-sm-2 text-left"  v-if="dokumenttiLuotu">
          <a class="btn btn-link pl-0" :href="dokumenttiHref" target="_blank" rel="noopener noreferrer" variant="link">
            <fas class="mr-2" icon="silma"></fas>
            <span>{{ $t('esikatsele-ja-lataa') }}</span>
          </a>
        </div>
      </div>

      <div class="btn-group">
        <ep-button @click="luoPdf" :disabled="isPolling" :show-spinner="isPolling" buttonClass="px-5"><span>{{ $t('luo-uusi-pdf') }}</span></ep-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Kielet } from '@shared/stores/kieli';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { IDokumenttiStore } from '@shared/tyypit';

@Component({
  components: {
    EpButton,
    EpFormContent,
    EpSpinner,
  },
})
export default class EpPdfLuonti extends Vue {
  @Prop({ required: true })
  protected store!: IDokumenttiStore;

  @Prop({ required: true })
  protected pdfnimi!: string;

  get pdfTitle() {
    return this.pdfnimi + '.pdf (' + (this.dokumentti.julkaisuDokumentti ? this.$t('julkaistu') : this.$t('tyoversio')) + ')';
  }

  get dokumenttiLuotu() {
    return this.dokumentti != null && this.dokumenttiHref != null;
  }

  get dokumentti() {
    if (this.store) {
      return this.store.dokumentti.value;
    }
  }

  get dokumenttiHref() {
    return this.store?.dokumenttiHref.value;
  }

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get isPolling() {
    return this.store?.polling.value;
  }

  get dokumenttiEpaonnistui() {
    return this.dokumentti && this.dokumentti.tila as any === 'epaonnistui';
  }

  luoPdf() {
    this.store?.luoPdf();
  }
}

</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

.luontitiedot {
  display: block;
}

.pdf-box {
  margin: 25px 0px;
  width: 100%;
  border-radius: 2px;
  padding: 25px;

  .ikoni {
    font-size: 1.5rem;
  }

  &.luotu {
    background-color: $gray-lighten-10;

    .ikoni {
      color: $blue-lighten-6;
    }

    @media(max-width: 575px) {

      .ikoni {
        display: none;
      }
    }

    .teksti {
      font-weight: 600;
    }
  }

  &.ei-luotu {
    border: 1px solid $gray-lighten-9;
    color: $gray-lighten-2;
    font-style: italic;
  }

  &.epaonnistui {
    border-color: $red;
    color: $red;
    font-style: normal;
  }

  .polling {
    opacity: 0.5;
  }
}

</style>
