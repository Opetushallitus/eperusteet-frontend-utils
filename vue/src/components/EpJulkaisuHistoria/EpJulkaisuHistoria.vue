<template>
  <div class="julkaisuhistoria">
    <h3 slot="header">{{ $t('julkaisuhistoria') }}</h3>
    <template v-if="julkaisut">
      <div class="alert alert-info" v-if="julkaisut.length === 0">
        <slot name="empty">{{ $t('ei-julkaisuja') }}</slot>
      </div>
      <div v-else>
        <div v-for="(julkaisu, index) in julkaisutMapped" :key="'julkaisu'+julkaisu.revision" class="julkaisu py-2 ml-1 px-3">
          <div class="my-1">
            <span class="font-weight-bold pr-1">{{$t('julkaisu')}} {{julkaisu.fixedRevision}}</span>
            <span v-if="index === 0">({{$t('uusin-julkaisu')}})</span>
          </div>
          <div class="my-1">{{$sdt(julkaisu.luotu)}} {{julkaisu.nimi}}</div>
          <div class="my-1" v-html="$kaanna(julkaisu.tiedote)"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { parsiEsitysnimi } from '@shared/utils/kayttaja';

interface Julkaisu {
  revision?: number;
  tiedote?: { [key: string]: string; };
  luotu?: Date;
  luoja?: string;
  kayttajanTieto?: any;
}

@Component
export default class EpJulkaisuHistoria extends Vue {
  @Prop({ required: false })
  private julkaisut!: Julkaisu[];

  get julkaisutMapped() {
    return _.chain(this.julkaisut)
      .map(julkaisu => {
        return {
          ...julkaisu,
          nimi: parsiEsitysnimi(julkaisu.kayttajanTieto),
          fixedRevision: '1.' + julkaisu.revision,
        };
      })
      .sortBy('luotu')
      .reverse()
      .value();
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables';
  .julkaisu:nth-of-type(even) {
    background-color: $gray-lighten-13;
  }
</style>
