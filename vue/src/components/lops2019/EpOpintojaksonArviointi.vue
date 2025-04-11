<template>
  <div>
    <div v-if="showPerustesisalto">
      <div
        v-for="(oppiaine, idx) in opintojaksonOppiaineidenTiedot"
        :key="idx+'op-arviointi'"
        class="perustesisalto"
      >
        <div v-if="oppiaine.arviointi && oppiaine.arviointi.kuvaus">
          <div class="moduuliotsikko">
            <h4 v-html="$kaanna(oppiaine.nimi)" />
          </div>
          <ep-content
            layout="normal"
            :opetussuunnitelma-store="opetussuunnitelmaStore"
            :value="oppiaine.arviointi.kuvaus"
          />
        </div>
      </div>
      <div v-if="showEmptyAlert || value.arviointi">
        <div class="moduuliotsikko">
          <h4>{{ $t('paikallinen-lisays-opintojakso-arviointi') }}</h4>
        </div>
        <div
          v-if="!isEditing && !value.arviointi"
          class="alert alert-info"
        >
          {{ $t('ei-paikallista-tarkennusta') }}
        </div>
      </div>
    </div>
    <ep-content
      v-model="value.arviointi"
      :opetussuunnitelma-store="opetussuunnitelmaStore"
      layout="normal"
      :is-editable="isEditing"
    />

    <div
      v-for="(paikallinenOpintojakso, index) in value.paikallisetOpintojaksot"
      :key="index+'paik-arviointi'"
      class="mt-4"
    >
      <div v-if="paikallinenOpintojakso.arviointi">
        <div class="moduuliotsikko">
          <h4>{{ $kaanna(paikallinenOpintojakso.nimi) }}</h4>
        </div>
        <ep-content
          v-model="paikallinenOpintojakso.arviointi"
          :opetussuunnitelma-store="opetussuunnitelmaStore"
          layout="normal"
          :is-editable="false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';

import EpContent from '@shared/components/EpContent/EpContent.vue';

@Component({
  components: {
    EpContent,
  },
})
export default class EpOpintojaksonArviointi extends Vue {
  @Prop({ required: false })
  private opetussuunnitelmaStore!: any;

  @Prop({ required: true })
  private value!: any;

  @Prop({ required: false, default: false })
  private isEditing!: boolean;

  @Prop({ required: true })
  private opintojaksonOppiaineidenTiedot!: any;

  @Prop({ required: false, default: true })
  private showEmptyAlert!: boolean;

  @Prop({ required: false, default: true })
  private showPerustesisalto!: boolean;
}
</script>

<style lang="scss">
</style>
