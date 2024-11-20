<template>
  <div class="mt-2">
    <div v-for="(julkaisu, index) in julkaisutMapped" :key="'julkaisu'+index" class="julkaisu taulukko-rivi-varitys pb-2 pt-2 px-2">
      <div class="d-flex align-items-end justify-content-between">
        <div>
          <span class="font-bold font-size pr-4">{{$t('julkaisu')}} {{ $sd(julkaisu.luotu) }}</span>
          <span v-if="versio === julkaisu.revision" class="pr-4">
            <EpMaterialIcon size="18px" class="pr-1">visibility</EpMaterialIcon>
            <span class="font-italic">{{ $t('katselet-tata-julkaisua') }}</span>
          </span>
          <router-link
            v-if="versio !== julkaisu.revision"
            :to="{ name: 'perusteTiedot', params: { perusteId: julkaisu.peruste.id, revision: julkaisu.revision } }">
            {{ $t('siirry-julkaisuun') }}
          </router-link>
        </div>
        <div v-if="julkaisu.revision === uusinVoimassaolevaJulkaisu.revision" class="julkaistu">{{$t('voimassaoleva')}}</div>
        <div class="voimassaolo-alkaa text-right" v-else-if="julkaisu.muutosmaarays">
          <span class="pl-2">{{$t('voimassaolo-alkaa')}}</span>
          <span class="ml-1 font-bold">{{$sd(julkaisu.muutosmaarays.voimassaoloAlkaa)}}</span>
        </div>
      </div>
      <div v-if="julkaisu.muutosmaarays" class="d-flex mt-2">
        <div class="pdf-url" v-if="julkaisu.muutosmaarays.url">
          <EpPdfLink :url="julkaisu.muutosmaarays.url">{{ $kaanna(julkaisu.muutosmaarays.nimi) }}</EpPdfLink>
        </div>
        <template v-if="julkaisu.liitteet && julkaisu.liitteet.length > 0">
          <div v-for="(liiteData, index) in julkaisu.liitteet" :key="'maarays'+index" class="pdf-url">
            <EpPdfLink :url="liiteData.url">{{ $kaanna(liiteData.nimi) }}</EpPdfLink>
          </div>
        </template>
      </div>
      <div v-if="julkaisu.julkinenTiedote" class="my-1" v-html="$kaanna(julkaisu.julkinenTiedote)"></div>
      <EpCollapse :borderBottom="false"
                  :expandedByDefault="false"
                  :chevronLocation="'right'"
                  :use-padding="false">
        <template v-slot:header="{ toggled }">
          <template v-if="!toggled">{{$t('nayta-muutokset')}}</template>
          <template v-if="toggled">{{$t('piilota-muutokset')}}</template>
        </template>
        <EpMuutosvertailu :julkaisu="julkaisu"></EpMuutosvertailu>
      </EpCollapse>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpMuutosvertailu from '@shared//components/EpJulkaisuHistoriaJulkinen/EpMuutosvertailu.vue';
import { MaaraysLiiteDtoTyyppiEnum } from '@shared/generated/eperusteet';
import { MaarayksetParams, baseURL } from '@shared/api/eperusteet';

@Component({
  components: {
    EpCollapse,
    EpMuutosvertailu,
  },
})
export default class EpJulkaisuLista extends Vue {
  @Prop({ required: true })
  private julkaisut!: any[];

  get julkaisutMapped() {
    return _.chain(this.julkaisut)
      .map(julkaisu => {
        return {
          ...julkaisu,
          liitteet: _.filter(julkaisu.liitteet, liite => liite.kieli === Kielet.getSisaltoKieli.value),
          ...(!!julkaisu.muutosmaarays && {
            muutosmaarays: {
              ...julkaisu.muutosmaarays,
              url: this.muutosmaaraysUrl(julkaisu.muutosmaarays),
            },
          }),
        };
      })
      .map(julkaisu => {
        return {
          ...julkaisu,
          muutosmaarays: (!julkaisu.muutosmaarays && julkaisu.muutosmaaraysVoimaan && {
            voimassaoloAlkaa: julkaisu.muutosmaaraysVoimaan,
          }) || julkaisu.muutosmaarays,
        };
      })
      .value();
  }

  muutosmaaraysUrl(muutosmaarays) {
    if (!_.find(muutosmaarays.liitteet![this.$slang.value].liitteet, liite => liite.tyyppi === MaaraysLiiteDtoTyyppiEnum.MAARAYSDOKUMENTTI)) {
      return null;
    }

    return baseURL + MaarayksetParams.getMaaraysLiite(_.toString(_.get(_.find(muutosmaarays.liitteet![this.$slang.value].liitteet, liite => liite.tyyppi === MaaraysLiiteDtoTyyppiEnum.MAARAYSDOKUMENTTI), 'id'))).url;
  }

  get versio() {
    return _.toNumber(this.$route.params?.revision) || _.max(_.map(this.julkaisut, 'revision'));
  }

  get julkaisutSorted() {
    return _.sortBy(this.julkaisut, 'revision');
  }

  get julkaisutReversed() {
    return _.clone(this.julkaisutSorted).reverse();
  }

  get ensimmainenTulevaMuutosmaarays() {
    return _.find(this.julkaisutSorted, julkaisu => julkaisu.muutosmaarays && julkaisu.muutosmaarays.voimassaoloAlkaa > Date.now());
  }

  get uusinTulevaMuutosmaarays() {
    return _.find(this.julkaisutReversed, julkaisu => julkaisu.muutosmaarays && julkaisu.muutosmaarays.voimassaoloAlkaa > Date.now());
  }

  get uusinVoimassaolevaJulkaisu() {
    return _.find(this.julkaisutReversed, julkaisu => julkaisu.revision < this.ensimmainenTulevaMuutosmaarays?.revision) || _.first(this.julkaisutReversed);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables';

.julkaistu {
  border-radius: 25px;
  background-color: $green-1;
  padding: 1px 10px;
  margin-left: 10px;
  color: $white;

  &--kesken {
    background-color: $yellow-1;
    color: $black;
  }

  &--virhe {
    background-color: $red-lighten-1;
    color: $black;
  }
}

.font-bold {
  font-weight: 600 !important;
}

.font-size {
  font-size: 110%;
}

.julkinen {
  color: $green;
}

.maarayslinkit {
  display: inline;
  padding-right: 5px;
  width: 70%;
  margin-right: 15px;
  overflow: auto;
}

.pdf-url {
  width: 70%;
  word-break: break-word;
}

.voimassaolo-alkaa {
  width: 30%;
}

::v-deep .ml-auto {
  margin-left: 0 !important;
}

::v-deep .ep-collapse {
  overflow: auto;
}

::v-deep .ep-collapse .header {
  margin-left: auto !important;
  margin-right: 5px;
}
</style>
