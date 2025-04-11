<template>
  <div>
    <div v-if="showPerustesisalto">
      <div
        v-for="(oppiaine, idx) in opintojaksonOppiaineidenTiedot"
        :key="idx"
        class="perustesisalto"
      >
        <div v-if="oppiaine.laajaAlaisetOsaamiset && oppiaine.laajaAlaisetOsaamiset.kuvaus">
          <div class="moduuliotsikko">
            <h4 v-html="$kaanna(oppiaine.nimi)" />
          </div>
          <ep-content
            layout="normal"
            :opetussuunnitelma-store="opetussuunnitelmaStore"
            :value="oppiaine.laajaAlaisetOsaamiset.kuvaus"
            help="ohje-lyhyt-laaja-alainen"
          />
        </div>
        <div v-else-if="oppiaine.laajaAlainenOsaaminen">
          <div class="moduuliotsikko">
            <h4 v-html="$kaanna(oppiaine.nimi)" />
          </div>
          {{ oppiaine.laajaAlainenOsaaminen }}
          <ep-content
            v-for="(laajalainenosaaminen, idx) in oppiaine.laajaAlainenOsaaminen"
            :key="idx"
            layout="normal"
            :opetussuunnitelma-store="opetussuunnitelmaStore"
            :value="laajalainenosaaminen.kuvaus"
          />
        </div>
      </div>
    </div>

    <div v-if="showEmptyAlert || value.laajaAlainenOsaaminen.length > 0">
      <div class="moduuliotsikko">
        <h4>{{ $t('paikallinen-lisays-opintojakso-laaja-alainen') }}</h4>
      </div>
      <div
        v-for="(lo, idx) in value.laajaAlainenOsaaminen"
        :key="idx + '-paikallinen'"
        class="paikallinen-laaja-alainen"
      >
        <div slot="header">
          <span v-if="laajaAlaisetKooditByUri[lo.koodi]">
            <h5 class="d-inline">{{ $kaanna(laajaAlaisetKooditByUri[lo.koodi].nimi) }}</h5>
            <b-button
              v-if="isEditing"
              variant="link"
              @click.stop="poistaLaaja(lo)"
            >
              <EpMaterialIcon>close</EpMaterialIcon>
            </b-button>
          </span>
        </div>
        <ep-content
          v-if="lo.kuvaus"
          v-model="lo.kuvaus"
          layout="normal"
          :is-editable="isEditing"
        />
      </div>

      <div
        v-if="!isEditing && value.laajaAlainenOsaaminen.length === 0"
        class="alert alert-info"
      >
        {{ $t('ei-paikallista-tarkennusta') }}
      </div>
    </div>

    <b-dropdown
      v-if="isEditing"
      :text="$t('lisaa-laaja-alainen-osaaminen')"
      variant="primary"
      class="mb-4"
    >
      <b-dropdown-item-button
        v-for="(laaja, index) in laajaAlaistenKoodit"
        :key="index+'addlaaja'"
        :disabled="laaja.hasPaikallinenKuvaus"
        @click="addLaaja(laaja)"
      >
        {{ $kaanna(laaja.nimi) }}
      </b-dropdown-item-button>
    </b-dropdown>

    <div
      v-for="(paikallinenOpintojakso, index) in value.paikallisetOpintojaksot"
      :key="index+'laaja'"
    >
      <div v-if="paikallinenOpintojakso.laajaAlainenOsaaminen && paikallinenOpintojakso.laajaAlainenOsaaminen.length > 0">
        <div class="moduuliotsikko">
          <h4>{{ $kaanna(paikallinenOpintojakso.nimi) }}</h4>
        </div>
        <div
          v-for="(lo, index) in paikallinenOpintojakso.laajaAlainenOsaaminen"
          :key="index+'paik-laaja-osa'"
          class="paikallinen-laaja-alainen"
        >
          <div
            slot="header"
            class="moduuliotsikko"
          >
            <span v-if="laajaAlaisetKooditByUri[lo.koodi]">
              <h5>{{ $kaanna(laajaAlaisetKooditByUri[lo.koodi].nimi) }}</h5>
            </span>
          </div>
          <ep-content
            v-if="lo.kuvaus"
            v-model="lo.kuvaus"
            layout="normal"
            :is-editable="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpContent from '@shared/components/EpContent/EpContent.vue';

@Component({
  components: {
    EpContent,
    EpMaterialIcon,
  },
})
export default class EpOpintojaksonLaajaAlaisetOsaamiset extends Vue {
  @Prop({ required: false })
  private opetussuunnitelmaStore!: any;

  @Prop({ required: true })
  private value!: any;

  @Prop({ required: false, default: false })
  private isEditing!: boolean;

  @Prop({ required: true })
  private opintojaksonOppiaineidenTiedot!: any;

  @Prop({ required: true })
  private laajaAlaistenKoodit!: any;

  @Prop({ required: false, default: true })
  private showEmptyAlert!: boolean;

  @Prop({ required: false, default: true })
  private showPerustesisalto!: boolean;

  get laajaAlaisetKooditByUri() {
    return _.keyBy(this.laajaAlaistenKoodit, 'koodi');
  }
}
</script>

<style lang="scss">
</style>
