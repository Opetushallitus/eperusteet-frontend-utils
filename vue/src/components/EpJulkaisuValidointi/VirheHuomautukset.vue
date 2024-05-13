<template>
  <EpNaytaKaikki v-model="naytaKaikki" :total-list-length="virhehuomautukset.length" :collapsed-size="collapsedSize">
    <div class="validointi p-2" v-for="(virhehuomautus, index) in huomautukset" :key="'virheet'+index">
      <router-link v-if="virhehuomautus.route" :to="virhehuomautus.route">
        <IkoniTeksti :tyyppi="tyyppi">
          {{$t(virhehuomautus.kuvaus)}}
          <span v-if="virhehuomautus.navigationNode && virhehuomautus.navigationNode.label">({{$kaanna(virhehuomautus.navigationNode.label)}})</span>
        </IkoniTeksti>
      </router-link>
      <IkoniTeksti v-else :tyyppi="tyyppi">
        {{$t(virhehuomautus.kuvaus)}}
        <span v-if="virhehuomautus.navigationNode &&  virhehuomautus.navigationNode.label">({{$kaanna(virhehuomautus.navigationNode.label)}})</span>
      </IkoniTeksti>
    </div>
  </EpNaytaKaikki>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { VirheHuomautus } from './EpJulkaisuValidointi.vue';
import IkoniTeksti from './IkoniTeksti.vue';
import EpNaytaKaikki from '@shared/components//EpNaytaKaikki/EpNaytaKaikki.vue';

@Component({
  components: {
    EpNaytaKaikki,
    IkoniTeksti,
  },
})
export default class VirheHuomautukset extends Vue {
  @Prop({ required: true })
  private virhehuomautukset!: VirheHuomautus[];

  @Prop({ required: true })
  private tyyppi!: 'virhe' | 'huomautus';

  private naytaKaikki: boolean = false;
  private collapsedSize: number = 3;

  get huomautukset() {
    return this.naytaKaikki ? this.virhehuomautukset : this.virhehuomautukset.slice(0, this.collapsedSize);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.validointi {
  &:nth-of-type(even) {
    background-color: $table-even-row-bg-color;
  }
  &:nth-of-type(odd) {
    background-color: $table-odd-row-bg-color;
  }
}
</style>
