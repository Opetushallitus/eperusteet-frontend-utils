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

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import EpContent from '@shared/components/EpContent/EpContent.vue';

const props = defineProps({
  opetussuunnitelmaStore: {
    required: false,
    type: Object,
  },
  value: {
    required: true,
    type: Object,
  },
  isEditing: {
    required: false,
    default: false,
    type: Boolean,
  },
  opintojaksonOppiaineidenTiedot: {
    required: true,
    type: Array,
  },
  showEmptyAlert: {
    required: false,
    default: true,
    type: Boolean,
  },
  showPerustesisalto: {
    required: false,
    default: true,
    type: Boolean,
  },
});
</script>

<style lang="scss">
</style>
