<template>
  <div
    v-if="muutostiedot"
    class="muutostiedot"
  >
    <div v-if="muutostiedot.length > 0">
      <div
        v-for="(kohdeTapahtumat, index) in muutostiedot"
        :key="index"
      >
        <ep-form-content
          :name="kohdeTapahtumat.kohde"
          header-type="h3"
          header-class="h6"
        >
          <div v-if="yhteenvetoTapahtumat.includes(kohdeTapahtumat.kohde)">
            <div
              v-for="(tapahtuma, index) in kohdeTapahtumat.tapahtumat"
              :key="index"
            >
              {{ $t(kohdeTapahtumat.kohde + '-muutoshistoria-' + tapahtuma.tapahtuma, {kpl: tapahtuma.muokkaustiedot.length}) }}
            </div>
          </div>
          <template v-else>
            <div
              v-for="(tapahtuma, index) in kohdeTapahtumat.tapahtumat"
              :key="index"
            >
              {{ $t('muutoshistoria-' + tapahtuma.tapahtuma) }}

              <ul v-if="tapahtuma.muokkaustiedot && tapahtuma.muokkaustiedot.length > 0">
                <li
                  v-for="(tieto, i) in tapahtuma.muokkaustiedot"
                  :key="i"
                >
                  <EpRouterLink :muokkaustieto="tieto" />
                </li>
              </ul>
            </div>
          </template>
        </ep-form-content>
        <hr v-if="index !== muutostiedot.length - 1">
      </div>
    </div>
    <div v-if="muutostiedot.length === 0">
      {{ $t('muutostietoja-ei-ole-saatavilla') }}
    </div>
  </div>
  <div v-else>
    <EpSpinner />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import { MuokkaustietoStore } from '@shared/stores/MuokkaustietoStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpRouterLink from '@shared/components/EpJulkaisuHistoriaJulkinen/EpRouterLink.vue';
import _ from 'lodash';

@Component({
  components: {
    EpFormContent,
    EpSpinner,
    EpRouterLink,
  },
})
export default class EpMuutosvertailu extends Vue {
  @Prop({ required: true })
  private julkaisu!: any;

  private muokkaustietoStore = new MuokkaustietoStore();

  async mounted() {
    await this.muokkaustietoStore.getVersionMuutokset(this.julkaisu.peruste.id, this.julkaisu.revision);
  }

  get muutostiedot() {
    if (this.muokkaustietoStore.muutostiedot.value) {
      return _.map(this.muokkaustietoStore.muutostiedot.value, tieto => {
        return {
          ...tieto,
          tapahtumat: _.map(tieto.tapahtumat, tapahtuma => {
            return {
              ...tapahtuma,
              muokkaustiedot: _.map(tapahtuma.muokkaustiedot, muokkaustieto => {
                return {
                  ...muokkaustieto,
                  kohde: this.solveTapahtuma(muokkaustieto),
                };
              }),
            };
          }),
        };
      });
    }
  }

  solveTapahtuma(muokkaustieto) {
    if (this.julkaisu?.peruste?.toteutus === 'perusopetus') {
      if (muokkaustieto.kohde === 'oppiaine') {
        return 'perusopetusoppiaine';
      }
    }

    return muokkaustieto.kohde;
  }

  get yhteenvetoTapahtumat() {
    return ['termi'];
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables';

.muutostiedot {
  background-color: $blue-lighten-8;
  border: 1px solid $blue-lighten-4;
  padding: 15px;
}

ul.no-bullets {
  list-style-type: none;
}
</style>
