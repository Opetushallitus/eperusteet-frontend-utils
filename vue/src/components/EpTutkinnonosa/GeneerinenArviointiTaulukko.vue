<template>
  <ep-form-content class="col-md-12 mb-5">
    <slot name="header">
      <label>{{ $t('arviointi') }}</label>
    </slot>
    <div>{{$kaanna(arviointi.kohde)}}</div>
    <div v-if="kriteeriton">{{$kaanna(osaamistasonOtsikko)}}</div>
    <b-container v-else fluid="lg" class="osaamistasot mt-3">
      <b-row v-for="(osaamistasonKriteeri,index) in arviointi.osaamistasonKriteerit" :key="'osaamistasokriteeri'+index">
        <b-col class="pt-3" md="12" lg="4">
          <span>{{$kaanna(arviointi.arviointiAsteikko.osaamistasot[index].otsikko)}}</span>
        </b-col>
        <b-col class="pt-3" md="12" lg="8">
          <ul class="pl-3">
            <li v-for="(kriteeri, index) in osaamistasonKriteeri.kriteerit" :key="'kriteeri'+index">
              {{$kaanna(kriteeri)}}
            </li>
          </ul>
        </b-col>
      </b-row>
    </b-container>
  </ep-form-content>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpAlert from '@shared/components/EpAlert/EpAlert.vue';
import * as _ from 'lodash';

@Component({
  components: {
    EpFormContent,
    EpAlert,
  },
})
export default class GeneerinenArviointiTaulukko extends Vue {
  @Prop({ required: true })
  private arviointi!: any;

  get osaamistasonKriteeritFields() {
    return [{
      key: 'osaamistaso',
      label: this.$t('osaamistaso') as string,
      thStyle: { display: 'none' },
    }, {
      key: 'kriteerit',
      label: this.$t('kriteerit') as string,
      thStyle: { display: 'none' },
    }] as any[];
  }

  get kriteeriton() {
    return this.arviointi?.osaamistasonKriteerit?.length === 1
      && _.chain(this.arviointi.osaamistasonKriteerit)
        .map('kriteerit')
        .flatten()
        .isEmpty()
        .value();
  }

  get osaamistasonOtsikko() {
    return _.get(this.arviointi, 'osaamistasonKriteerit[0].osaamistaso.otsikko');
  }
}
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

  .osaamistasot {
    .row:nth-of-type(even) {
      background-color: $table-even-row-bg-color;
    }
    .row:nth-of-type(odd) {
      background-color: $table-odd-row-bg-color;
    }
  }

</style>
