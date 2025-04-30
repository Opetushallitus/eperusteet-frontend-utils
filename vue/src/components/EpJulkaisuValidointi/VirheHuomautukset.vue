<template>
  <EpNaytaKaikki
    v-model="virhehuomautukset"
    striped
  >
    <template #default="{ data }">
      <router-link
        v-if="data.route"
        :to="data.route"
      >
        <IkoniTeksti :tyyppi="tyyppi">
          {{ $t(data.kuvaus) }}
          <span v-if="data.navigationNode && data.navigationNode.label">({{ $kaanna(data.navigationNode.label) }})</span>
        </IkoniTeksti>
      </router-link>
      <IkoniTeksti
        v-else
        :tyyppi="tyyppi"
      >
        {{ $t(data.kuvaus) }}
        <span v-if="data.navigationNode && data.navigationNode.label">({{ $kaanna(data.navigationNode.label) }})</span>
      </IkoniTeksti>
    </template>
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
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
