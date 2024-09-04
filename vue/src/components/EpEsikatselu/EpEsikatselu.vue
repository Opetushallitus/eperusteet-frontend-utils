<template>
  <div >
    <label class="font-weight-600">{{$t(header)}}</label>
    <ep-toggle v-model="model.esikatseltavissa" :is-editing="isEditing" v-if="isEditing" :class="{'disabled-events': model.tila === 'poistettu'}">
      {{$t(toggleText)}}
    </ep-toggle>
    <ep-external-link :url="externalUrl" v-if="!isEditing && model.esikatseltavissa"/>
    <div v-if="!isEditing && !model.esikatseltavissa">
      {{$t('et-ole-sallinut-esikatselua')}}
    </div>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Kielet } from '@shared/stores/kieli';
import { PerusteDto } from '@shared/api/eperusteet';
import { koulutustyyppiTheme } from '@shared/utils/perusteet';
import { buildPerusteEsikatseluUrl, buildEsikatseluUrl } from '@shared/utils/esikatselu';

interface Esikatseltavissa {
  id: number;
  esikatseltavissa: boolean;
  koulutustyyppi: string;
  tyyppi: string;
  tila: string;
  jotpatyyppi?: string;
  peruste?: PerusteDto
}

@Component
export default class EpEsikatselu extends Vue {
  @Prop()
  private value!: Esikatseltavissa;

  @Prop({ default: false })
  private isEditing!: Boolean;

  @Prop({ default: false, type: Boolean })
  private peruste!: Boolean;

  @Prop({ default: false, type: Boolean })
  private opetussuunnitelma!: Boolean;

  @Prop({ default: false, type: Boolean })
  private toteutussuunnitelma!: Boolean;

  @Prop({ default: false, type: Boolean })
  private opas!: Boolean;

  get model() {
    return this.value;
  }

  set model(value) {
    this.$emit('input', value);
  }

  get type() {
    if (this.peruste) {
      return 'peruste';
    }
    else if (this.opetussuunnitelma) {
      return 'opetussuunnitelma';
    }
    else if (this.toteutussuunnitelma) {
      return 'toteutussuunnitelma';
    }
    else if (this.opas) {
      return 'opas';
    }
    return 'peruste';
  }

  get header() {
    return 'esikatsele-' + this.type;
  }

  get toggleText() {
    return 'salli-esikatselu-' + this.type;
  }

  get externalUrl() {
    if (this.peruste) {
      return buildPerusteEsikatseluUrl(this.value.peruste);
    }

    if (this.opas) {
      return buildEsikatseluUrl(Kielet.getSisaltoKieli.value, `/opas/${this.value.id}`);
    }

    if (this.opetussuunnitelma) {
      return buildEsikatseluUrl(Kielet.getSisaltoKieli.value, `/opetussuunnitelma/${this.value.id}`, `/${koulutustyyppiTheme(this.value.koulutustyyppi!)}/tiedot`);
    }

    if (this.toteutussuunnitelma) {
      return buildEsikatseluUrl(Kielet.getSisaltoKieli.value, `/toteutussuunnitelma/${this.value.id}`, `/${this.toteutussuunnitelmaToteutus(this.value, this.amosaaToteutustyyppi)}`);
    }
  }

  toteutussuunnitelmaToteutus(toteutussuunnitelma, toteutus) {
    if (toteutussuunnitelma.jotpatyyppi === 'MUU') {
      return 'muukoulutus';
    }

    return toteutus;
  }

  get amosaaToteutustyyppi() {
    return (this.$router as any).params.toteutus;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
