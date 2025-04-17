<template>
  <div>
    <div
      v-for="(moduuli, idx) in value.moduulit"
      :key="idx + '-moduuli'"
      class="perustesisalto"
    >
      <div v-if="moduulitMap[moduuli.koodiUri]">
        <div class="moduuliotsikko">
          <h4>{{ $kaanna(moduulitMap[moduuli.koodiUri].nimi) }}</h4>
        </div>
        <ep-prefix-list
          :value="moduulitMap[moduuli.koodiUri].sisallot"
          kohde="kohde"
          arvot="sisallot"
        />
      </div>
    </div>

    <div
      v-for="(paikallinenOpintojakso, idx) in value.paikallisetOpintojaksot"
      :key="idx + 'opintojakso'"
    >
      <div
        v-if="paikallinenOpintojakso.keskeisetSisallot.length > 0"
        class="perustesisalto"
      >
        <div class="moduuliotsikko">
          <h4>{{ $kaanna(paikallinenOpintojakso.nimi) }}</h4>
        </div>
        <ep-list
          v-model="paikallinenOpintojakso.keskeisetSisallot"
          :is-editable="false"
          lisays="lisaa-tavoite"
          kentta="kuvaus"
        />
      </div>
    </div>

    <div
      v-if="value.keskeisetSisallot.length > 0 || showEmptyAlert"
      class="moduuliotsikko"
    >
      <h4>{{ $t('paikallinen-lisays-keskeiset-sisallot') }}</h4>
    </div>
    <div
      v-if="!isEditing && value.keskeisetSisallot && value.keskeisetSisallot.length === 0 && showEmptyAlert"
      class="alert alert-info"
    >
      {{ $t('ei-paikallista-tarkennusta') }}
    </div>
    <ep-list
      v-model="value.keskeisetSisallot"
      :is-editable="isEditing"
      lisays="lisaa-keskeinen-sisalto"
      kentta="kuvaus"
    />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import EpPrefixList from '@shared/components/EpPrefixList/EpPrefixList.vue';
import EpList from '@shared/components/forms/EpList.vue';

const props = defineProps({
  value: {
    required: true,
    type: Object,
  },
  isEditing: {
    required: false,
    default: false,
    type: Boolean,
  },
  moduulitMap: {
    required: true,
    type: Object,
  },
  showEmptyAlert: {
    required: false,
    default: true,
    type: Boolean,
  },
});
</script>

<style lang="scss">
</style>
