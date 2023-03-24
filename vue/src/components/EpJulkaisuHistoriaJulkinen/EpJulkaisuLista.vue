<template>
  <div class="mt-2">
    <div v-for="(julkaisu, index) in julkaisutFiltered" :key="'julkaisu'+index" class="julkaisu pb-2 pt-2 ml-1 px-3">
      <div class="d-flex">
        <span class="font-bold font-size pr-3 ">{{$t('julkaisu')}} {{ $sd(julkaisu.luotu) }}</span>
        <span v-if="latestJulkaisuRevision && latestJulkaisuRevision.revision === julkaisu.revision" class="julkaistu">{{$t('uusin')}}</span>
      </div>
      <div v-if="julkaisu.muutosmaaraysVoimaan && julkaisu.liitteet && julkaisu.liitteet.length > 0" class="mt-2">
        <div v-for="(liiteData, index) in julkaisu.liitteet" :key="'maarays'+index" class="maarayslinkit">
          <a :href="liiteData.url"
             target="_blank"
             rel="noopener noreferrer">{{ liiteData.nimi }}</a>
        </div>
        <span>- {{ $t('voimassaolo-alkaa') }} {{ $sd(julkaisu.muutosmaaraysVoimaan) }}</span>
      </div>
      <div v-if="julkaisu.julkinenTiedote" class="my-1" v-html="$kaanna(julkaisu.julkinenTiedote)"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';

@Component({
  components: {
  },
})
export default class EpJulkaisuLista extends Vue {
  @Prop({ required: true })
  private julkaisut!: any[];

  @Prop({ required: true })
  private latestJulkaisuRevision!: any;

  get julkaisutFiltered() {
    return _.chain(this.julkaisut)
      .map(julkaisu => {
        return {
          ...julkaisu,
          liitteet: _.filter(julkaisu.liitteet, liite => liite.kieli === Kielet.getSisaltoKieli.value),
        };
      })
      .value();
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables';

.julkaisu:nth-of-type(even) {
  background-color: $gray-lighten-13;
}

.julkaistu {
  border-radius: 25px;
  background-color: $green-1;
  padding: 1px 10px;
  margin-left: 10px;
  color: $black;

  &--kesken {
    background-color: $yellow-1;
  }

  &--virhe {
    background-color: $red-lighten-1;
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
}

</style>
