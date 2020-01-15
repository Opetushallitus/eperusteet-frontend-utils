<template>
  <div>
    <div class="pohja">
      <div class="kulunut-aika" :style="'width:'+kulunutAikaWidth +'%'">&nbsp;</div>
      <div class="aikataulu d-inline-block"
          v-for="aikataulu in aikatauluTavoitteet"
          :key="aikataulu.id"
          :style="'right:' + aikataulu.rightPosition +'%'"
          :id="'aikataulu-popover-'+aikataulu.id"
          :class="aikataulu.tapahtuma">
        <b-popover :target="'aikataulu-popover-'+aikataulu.id" triggers="hover" placement="topleft">
          <template v-slot:title>
            {{$sd(aikataulu.tapahtumapaiva)}}
          </template>

          <div style="width: 15vw">
            {{$kaanna(aikataulu.tavoite)}}
          </div>
        </b-popover>
      </div>
    </div>

    <div class="alainfo">
      <div class="d-inline-block">
        <div class="luomispaiva">{{ $sd(luomisPaiva) }} </div>
        <div class="paiva-alatieto">{{ $t('aikataulu-projektin-luomispaiva') }}</div>
      </div>

      <div class="d-inline-block text-right julkaisu" :style="'right:'+julkaisuAikaPosition +'%'">
        <div class="julkaisupaiva">
          <span v-if="julkaisuPaiva">{{ $sd(julkaisuPaiva) }}</span>
          <span v-else>&nbsp;</span>
        </div>
        <div class="paiva-alatieto">{{ $t('aikataulu-projektin-suunniteltu-julkaisupaiva') }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Mixins } from 'vue-property-decorator';
import _ from 'lodash';
import { aikataulutapahtuma } from '../../utils/aikataulu';

@Component
export default class EpAikataulu extends Vue {

  @Prop( {required: true})
  private aikataulut!: any[];

  get luomisAikataulu() {
    return _.head(_.filter(this.aikataulut, (aikataulu) => aikataulu.tapahtuma === aikataulutapahtuma.luominen));
  }

  get julkaisuAikataulu() {
    return _.head(_.filter(this.aikataulut, (aikataulu) => aikataulu.tapahtuma === aikataulutapahtuma.julkaisu));
  }

  get luomisPaiva() {
    if (this.luomisAikataulu) {
      return this.luomisAikataulu.tapahtumapaiva;
    }
  }

  get julkaisuPaiva() {
    if (this.julkaisuAikataulu) {
      return this.julkaisuAikataulu.tapahtumapaiva;
    }
  }

  get aikataulutSorted() {
    return _.chain(this.aikataulut)
      .sortBy((aikataulu) => (aikataulu.tapahtumapaiva as any))
      .value();
  }

  get viimeinenTapahtuma() {
    return _.chain(this.aikataulutSorted)
      .reverse()
      .head()
      .value();
  }

  get viimeinenPaiva() {
    if (this.viimeinenTapahtuma) {
      return this.viimeinenTapahtuma.tapahtumapaiva;
    }
  }

  get aikatauluTavoitteet() {
    return _.chain(this.aikataulut)
      .filter(aikataulu => aikataulu.tapahtuma !== aikataulutapahtuma.luominen)
      .filter(aikataulu => aikataulu.tapahtuma !== aikataulutapahtuma.julkaisu)
      .map(aikataulu => {
        return {
          ...aikataulu,
          rightPosition: this.aikatauluPosition(aikataulu.tapahtumapaiva),
        };
      })
      .value();
  }

  get kulunutAikaWidth() {
    if (this.julkaisuPaiva) {
      return Math.min(this.timelinePosition(new Date().getTime()), 100);
    }

    return 1;
  }

  aikatauluPosition(time) {
    return Math.max(100 - this.timelinePosition(time), 0);
  }

  get julkaisuAikaPosition() {
    if (this.julkaisuPaiva) {
      return Math.max(100 - this.timelinePosition(this.julkaisuPaiva), 0);
    }

    return 0;
  }

  timelinePosition(time) {
    return Math.floor((time - (this.luomisPaiva as any))
            / ((this.viimeinenPaiva as any) - (this.luomisPaiva as any)) * 100);
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

  .pohja {
    margin: 10px 0px;
    background-color: $gray-lighten-8;
    border-radius: 15px;
    height: 10px;
    position: relative;

    .kulunut-aika {
      background-color: $green-lighten-3;
      border-radius: 15px;
      height: 10px;
      position: absolute;
    }

    .aikataulu {
      height: 14px;
      width: 14px;
      border-radius: 30px;
      position: absolute;
      top: -2px;

      &.tavoite {
        background-color: $blue-lighten-5;
      }

      &.julkaisu {
        background-color: $blue-lighten-2;
      }
    }

  }

  .alainfo {
    position: relative;

    .julkaisu {
      position: absolute;
    }
  }

  .luomispaiva {
    border-left: 1px solid $gray-lighten-3;
    padding-left: 5px;
  }

  .julkaisupaiva {
    border-right: 1px solid $gray-lighten-3;
    padding-right: 5px;
  }

  .paiva-alatieto {
    color: $gray-lighten-1;
  }

</style>
