<template>
  <div class="content">
    <ep-spinner v-if="!tiedot" />

    <div v-else>
      <div v-for="(tieto, index) in tiedotFiltered" :key="index" class="tieto p-2 pl-3" @click="avaaTieto(tieto)">
        <div class="otsikko" :class="{'uusi': tieto.uusi}">{{$kaanna(tieto.otsikko)}} <span class="uusi" v-if="tieto.uusi">{{$t('uusi')}}</span></div>
        <div class="muokkausaika">{{$sdt(tieto.muokattu)}}</div>
      </div>

      <div>
        <ep-button variant="link" @click="naytettavaTietoMaara += 3" v-if="naytettavaTietoMaara < tiedotSize">
          <slot name="lisaaBtnText">
            {{$t('katso-lisaa-tiedotteita')}}
          </slot>
        </ep-button>
        <span v-if="tiedotSize === 0">
          <slot name="eiTietoja">
            {{$t('ei-tuloksia')}}
          </slot>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpButton from '../EpButton/EpButton.vue';

export interface JulkiRivi {
  otsikko?: { [key: string]: string; }
  uusi: boolean;
  muokattu?: Date;
}

@Component({
  components: {
    EpSpinner,
    EpButton,
  },
})
export default class EpJulkiLista extends Vue {
  @Prop({ required: true })
  private tiedot!: JulkiRivi;

  @Prop({ required: false})
  private tietoMaara;

  private naytettavaTietoMaara = 3;

  mounted() {
    if (this.tietoMaara) {
      this.naytettavaTietoMaara = this.tietoMaara;
    }
  }

  get tiedotSize() {
    return _.size(this.tiedot);
  }

  get tiedotFiltered() {
    if (this.tiedot) {
      return _.chain(this.tiedot)
        .map((tieto: JulkiRivi) => {
          return {
            ...tieto,
            uusi: this.tuntisitten((tieto as any).luotu),
          } as JulkiRivi;
        })
        .take(this.naytettavaTietoMaara)
        .value();
    }
  }

  avaaTieto(tieto: JulkiRivi) {
    this.$emit('avaaTieto', tieto);
  }

  tuntisitten(aika) {
    const tunti = 1000 * 60 * 60;
    const tuntisitten = Date.now() - tunti;

    return aika > tuntisitten;
  }
}
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

  .content {

    .tieto:nth-of-type(even) {
      background-color: $table-even-row-bg-color;
    }

    .tieto:nth-of-type(odd) {
      background-color: $table-odd-row-bg-color;
    }

    .tieto {

      &:hover{
        background-color: $table-hover-row-bg-color;
        cursor: pointer;
      }

      .otsikko {

        &.uusi {
          font-weight: bold;
        }

        .uusi {
          background-color: $blue-lighten-3;
          border-radius: 5px;
          padding: 2px 4px;
          font-size: 0.7rem;
          margin-left: 5px;
        }
      }

      .muokkausaika {
        color: $gray-lighten-1;
      }
    }

    ::v-deep .btn {
      padding: 0px;
    }

  }

</style>
