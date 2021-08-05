<template>
  <div>
    <IkoniTeksti v-if="!virheita && !huomautuksia" tyyppi="kaikki-kunnossa">
      {{$t('kaikki-kunnossa')}}
    </IkoniTeksti>

    <template v-if="virheita">
      <div class="font-weight-bold mt-4 mb-3">{{$t('julkaisun-estavat-virheet')}}</div>
      <VirheHuomautukset :virhehuomautukset="validointi.virheet" tyyppi="virhe"/>
    </template>

    <template v-if="huomautuksia">
      <EpToggle v-model="naytaHuomautukset" class="mt-4">
        {{$t('nayta-huomautukset')}}
      </EpToggle>

      <template v-if="naytaHuomautukset">
        <div class="font-weight-bold mt-4 mb-3">{{$t('huomautukset')}}</div>
        <VirheHuomautukset :virhehuomautukset="validointi.huomautukset" tyyppi="huomautus"/>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import VirheHuomautukset from './VirheHuomautukset.vue';
import IkoniTeksti from './IkoniTeksti.vue';

export interface VirheHuomautus {
  kuvaus: string;
  nimi: { [key: string]: string; };
  route: any;
}

interface Validointi {
  kategoria: string;
  virheet: VirheHuomautus[];
  huomautukset: VirheHuomautus[];
}

@Component({
  components: {
    EpToggle,
    VirheHuomautukset,
    IkoniTeksti,
  },
})
export default class EpJulkaisuValidointi extends Vue {
  @Prop({ required: true })
  private validointi!: Validointi;

  private naytaHuomautukset: boolean = false;

  get virheita() {
    return !_.isEmpty(this.validointi.virheet);
  }

  get huomautuksia() {
    return !_.isEmpty(this.validointi.huomautukset);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
