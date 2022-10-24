<template>
  <div>
    <EpProgressPopover v-if="validoinnit" :slices="prosessi" :popup-style="popupStyle">
      <template v-slot:header>
        <div class="d-flex flex-column align-items-center">
          <span class="validation-text pb-2">
            {{ $t(tila) }}
          </span>

          <template v-if="!arkistoitu">
            <div class="text-center julkaisemattomia-muutoksia font-size-08" v-if="julkaisemattomiaMuutoksia">
              <fas icon="info" class="mr-2"/>{{$t(julkaisemattomiaTeksti)}}
            </div>

            <b-button class="px-3 py-1" variant="primary" v-if="luonnos && !julkaistava" @click="asetaValmiiksi">
              {{$t('aseta-valmiiksi')}}
            </b-button>
            <b-button class="px-3 py-1" variant="primary" :to="{ name: 'julkaise' }" v-else-if="julkaistava && luonnos && !julkaistu && !arkistoitu">
              {{ $t('siirry-julkaisunakymaan') }}
            </b-button>
          </template>
        </div>
      </template>
      <div class="d-flex flex-column align-items-center">
        <b-button
          v-if="arkistoitu"
          variant="primary"
          @click="palauta">{{ $t('palauta') }}
        </b-button>
        <template v-else>
          <b-button
            v-if="(julkaistu || valmis) && julkaistava"
            variant="primary"
            :to="{ name: 'julkaise' }">{{ $t('siirry-julkaisunakymaan') }}
          </b-button>
          <div class="pl-3 pt-2 pb-1 row" v-if="validoinnit && validoinnit.virheet.length === 0 && validoinnit.huomautukset.length === 0">
            <div class="col-1">
              <fas class="text-success" icon="check-circle"/>
            </div>
            <div class="col">
              {{ $t('validointi-ei-virheita') }}
            </div>
          </div>
          <div class="ml-3">
            <div class="pt-2 pb-1 row" v-for="virhe in validoinnit.virheet" :key="virhe">
              <div class="col-1">
                <fas class="text-danger" icon="info-circle"/>
              </div>
              <div class="col">
                <span>{{ $t(virhe) }}</span>
              </div>
            </div>
            <div class="pt-2 pb-1 row" v-if="validoinnit.huomautukset.length > 0">
              <div class="col-1">
                <fas class="text-warning" icon="info-circle"/>
              </div>
              <div class="col">
                <span>{{ $t(huomautuksia) }}</span>
              </div>
            </div>
        </div>
        </template>
      </div>
    </EpProgressPopover>
    <EpSpinner v-else class="mt-4" color="#fff"/>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpProgressPopover from '@shared/components/EpProgressPopover/EpProgressPopover.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { tileBackgroundColor } from '@shared/utils/bannerIcons';

export enum ValidoitavatTilat {
  LUONNOS = 'luonnos',
  VALMIS = 'valmis',
  POISTETTU = 'poistettu',
  JULKAISTU = 'julkaistu',
}

export interface ValidableObject {
  tila: string,
  koulutustyyppi?: string,
  peruste?: {
    koulutustyyppi? :string,
  },
  tyyppi: string,
  viimeisinJulkaisuAika?: number;
}

export interface Validoinnit {
  virheet: string[];
  huomautukset: string[];
}

@Component({
  components: {
    EpProgressPopover,
    EpSpinner,
  },
})
export default class EpValidPopover extends Vue {
  @Prop({ required: true })
  private validoitava!: ValidableObject;

  @Prop({ required: false })
  private validoinnit!: Validoinnit;

  @Prop({ required: true })
  private julkaisemattomiaMuutoksia!: boolean;

  @Prop({ required: true })
  private julkaistava!: boolean;

  @Prop({ required: true })
  private tyyppi!: 'peruste' | 'toteutussuunnitelma' | 'opetussuunnitelma';

  asetaValmiiksi() {
    this.$emit('asetaValmiiksi');
  }

  palauta() {
    this.$emit('palauta');
  }

  get prosessi() {
    if (this.arkistoitu) {
      return [0];
    }

    if (_.size(this.validoinnit?.virheet) > 0) {
      return [0.2, 0.5, 1];
    }

    return [1];
  }

  get tila() {
    if (this.julkaistu && !this.arkistoitu) {
      return ValidoitavatTilat.JULKAISTU;
    }

    return _.toLower(this.validoitava?.tila);
  }

  get popupStyle(): { background: string; } | undefined {
    if (this.tyyppi === 'peruste') {
      return {
        background: '#1d7599',
      };
    }

    return tileBackgroundColor(this.validoitava?.peruste ? this.validoitava?.peruste?.koulutustyyppi : this.validoitava?.koulutustyyppi);
  }

  get julkaistu(): boolean {
    return this.validoitava?.tila === ValidoitavatTilat.JULKAISTU || !!this.validoitava.viimeisinJulkaisuAika;
  }

  get valmis(): boolean {
    return this.validoitava?.tila === ValidoitavatTilat.VALMIS;
  }

  get luonnos(): boolean | undefined {
    return this.tila === ValidoitavatTilat.LUONNOS;
  }

  get arkistoitu(): boolean {
    return this.validoitava?.tila === ValidoitavatTilat.POISTETTU;
  }

  get julkaisemattomiaTeksti() {
    if (this.tyyppi === 'peruste') {
      return 'perusteessa-on-julkaisemattomia-muutoksia';
    }

    if (this.tyyppi === 'toteutussuunnitelma') {
      return 'toteutussuunnitelmassa-on-julkaisemattomia-muutoksia';
    }

    if (this.tyyppi === 'opetussuunnitelma') {
      return 'opetussuunnitelmassa-on-julkaisemattomia-muutoksia';
    }
  }

  get huomautuksia() {
    if (this.tyyppi === 'peruste') {
      return 'perusteessa-huomautuksia';
    }

    if (this.tyyppi === 'toteutussuunnitelma') {
      return 'toteutussuunnitelmassa-huomautuksia';
    }

    if (this.tyyppi === 'opetussuunnitelma') {
      return 'opetussuunnitelmassa-huomautuksia';
    }
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables';

.validation-text {
  font-size: 14px;
}

.julkaisemattomia-muutoksia {
  width: 15rem;
  line-height: 1.1rem;
}
</style>
