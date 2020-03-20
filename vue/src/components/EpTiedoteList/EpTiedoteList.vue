<template>
  <div>
    <ep-spinner v-if="!tiedotteet" />

    <div v-else>
      <div v-for="(tiedote, index) in tiedotteetFiltered" :key="index" class="tiedote p-2 pl-3" @click="avaaTiedote(tiedote)">
        <div class="otsikko" :class="{'uusi': tiedote.uusi}">{{$kaanna(tiedote.otsikko)}} <span class="uusi" v-if="tiedote.uusi">Uusi</span></div>
        <div class="muokkausaika">{{$sdt(tiedote.muokattu)}}</div>
      </div>

      <div class="text-center">
        <ep-button variant="link" @click="tiedoteMaara += 3" v-if="tiedoteMaara < tiedotteetSize">{{$t('katso-lisaa-tiedotteita')}}</ep-button>
        <span v-if="tiedotteetSize === 0">{{$t('ei-tiedotteita')}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import EpSpinner from '../EpSpinner.vue';
import EpButton from '../EpButton.vue';
import { TiedoteDto } from '../../api/eperusteet';
import { ITiedotteetProvider } from '../../stores/types';

@Component({
  components: {
    EpSpinner,
    EpButton,
  },
})
export default class EpTiedoteList extends Vue {
  @Prop({ required: true })
  private tiedotteetStore!: ITiedotteetProvider;

  @Prop({ required: false, default: 3 })
  private tiedoteMaara = 3;

  get tiedotteet() {
    return this.tiedotteetStore.perusteenTiedotteet.value;
  }

  get tiedotteetSize() {
    return _.size(this.tiedotteet);
  }

  get tiedotteetFiltered() {
    return _.chain(this.tiedotteet)
      .map(tiedote => {
        return {
          ...tiedote,
          uusi: this.tuntisitten(tiedote.luotu),
        };
      })
      .take(this.tiedoteMaara)
      .value();
  }

  avaaTiedote(tiedote: TiedoteDto) {

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

    .tiedote:nth-of-type(even) {
      background-color: $table-even-row-bg-color;
    }

    .tiedote:nth-of-type(odd) {
      background-color: $table-odd-row-bg-color;
    }

    .tiedote {

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
