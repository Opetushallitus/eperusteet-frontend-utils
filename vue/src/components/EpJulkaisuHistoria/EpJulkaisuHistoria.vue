<template>
  <div class="julkaisuhistoria">
    <h3 slot="header">{{ $t('julkaisuhistoria') }}</h3>
    <template v-if="julkaisut">
      <div class="alert alert-info" v-if="julkaisut.length === 0">
        <slot name="empty">{{ $t('ei-julkaisuja') }}</slot>
      </div>
      <div v-else>
        <div v-for="(julkaisu, index) in julkaisutMapped" :key="'julkaisu'+julkaisu.revision" class="julkaisu pb-2 ml-1 px-3">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="font-weight-bold pr-1">{{$t('julkaisu')}} {{julkaisu.fixedRevision}}</span>
              <span v-if="index === 0" class="julkaistu">{{$t('julkaistu-versio')}}</span>
            </div>
            <div v-if="index > 0 && palauta">
              <EpButton
                variant="link"
                icon="peruuta"
                @click="palautaConfirm(julkaisu)"
                v-oikeustarkastelu="{ oikeus: 'muokkaus' }">
                {{ $t('palauta') }}
              </EpButton>
            </div>
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
import EpButton from '@shared/components/EpButton/EpButton.vue';

interface Julkaisu {
  revision?: number;
  tiedote?: { [key: string]: string; };
  luotu?: Date;
  luoja?: string;
  kayttajanTieto?: any;
}

@Component({
  components: {
    EpButton,
  },
})
export default class EpJulkaisuHistoria extends Vue {
  @Prop({ required: false })
  private julkaisut!: Julkaisu[];

  @Prop({ required: false })
  private palauta!: Function;

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

  async palautaConfirm(julkaisu) {
    if (await this.$bvModal.msgBoxConfirm((this.$t('toiminto-kopioi-ja-palauttaa-valitsemasi-version-julkiseksi') as any), {
      title: this.$t('palauta-versio-julkiseksi'),
      okVariant: 'primary',
      okTitle: this.$t('kylla') as any,
      cancelVariant: 'link',
      cancelTitle: this.$t('peruuta') as any,
      centered: true,
      ...{} as any,
    })) {
      this.palauta(julkaisu);
    }
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
    background-color: $green-lighten-2;
    padding: 5px 10px;
    margin-left: 10px;
    color: $white;
  }

</style>
