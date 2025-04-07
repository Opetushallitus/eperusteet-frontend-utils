<template>
  <div class="julkaisuhistoria mt-4">
    <EpSpinner v-if="!julkaisut" />
    <template v-else>
      <div
        v-if="julkaisut.length === 0"
        class="alert alert-info"
      >
        <slot name="empty">
          {{ $t('ei-julkaisuja') }}
        </slot>
      </div>
      <div v-else>
        <EpJulkaisuLista
          :julkaisut="julkaisutMapped"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpJulkaisuLista from '@shared/components/EpJulkaisuHistoriaJulkinen/EpJulkaisuLista.vue';

interface Julkaisu {
  muutosmaaraysVoimaan?: Date;
  revision?: number;
  julkinenTiedote?: { [key: string]: string; };
  luotu?: Date;
  tila?: 'JULKAISTU' | 'KESKEN' | 'VIRHE';
  liitteet?: any;
}

@Component({
  components: {
    EpJulkaisuLista,
    EpButton,
    EpSpinner,
    EpCollapse,
  },
})
export default class EpJulkaisuHistoriaJulkinen extends Vue {
  @Prop({ required: false })
  private julkaisut!: Julkaisu[];

  @Prop({ required: false, type: Boolean, default: false })
  private naytaKaikki!: boolean;

  get sliceSize() {
    return this.naytaKaikki ? this.julkaisut.length : 2;
  }

  get julkaisutMapped() {
    return _.chain(this.julkaisut)
      .map(julkaisu => {
        return {
          ...julkaisu,
          tila: julkaisu.tila || 'JULKAISTU',
          liitteet: this.muutosmaaraysLiite(julkaisu),
        };
      })
      .sortBy('revision')
      .reverse()
      .value();
  }

  muutosmaaraysLiite(julkaisu) {
    if (julkaisu.liitteet && julkaisu.liitteet.length > 0) {
      julkaisu.liitteet.forEach(liiteData => {
        liiteData.url = `/eperusteet-service/api/perusteet/${julkaisu.peruste.id!}/julkaisu/liitteet/${liiteData.liite.id}`;
      });
      return julkaisu.liitteet;
    }
    else {
      return [];
    }
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables';

::v-deep .ep-collapse .header {
  color: #3367E3;
}

</style>
