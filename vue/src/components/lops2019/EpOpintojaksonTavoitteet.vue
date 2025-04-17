<template>
  <div>
    <div
      v-for="(moduuli, idx) in modelValue.moduulit"
      :key="idx + '-moduuli'"
      class="perustesisalto"
    >
      <div v-if="moduuli && moduulitMap[moduuli.koodiUri]">
        <div class="moduuliotsikko">
          <h4>{{ $kaanna(moduulitMap[moduuli.koodiUri].nimi) }} {{ moduulitMap[moduuli.koodiUri].laajuus }} {{ $t('op') }}</h4>
        </div>
        <ep-prefix-list
          :value="moduulitMap[moduuli.koodiUri].tavoitteet"
          kohde="kohde"
          arvot="tavoitteet"
        />
      </div>
    </div>

    <div
      v-for="(paikallinenOpintojakso, idx) in modelValue.paikallisetOpintojaksot"
      :key="idx + '-opintojakso'"
    >
      <div
        v-if="paikallinenOpintojakso.tavoitteet.length > 0"
        class="perustesisalto"
      >
        <div class="moduuliotsikko">
          <h4>{{ $kaanna(paikallinenOpintojakso.nimi) }}</h4>
        </div>
        <ep-list
          v-model="paikallinenOpintojakso.tavoitteet"
          :is-editable="false"
          lisays="lisaa-tavoite"
          kentta="kuvaus"
        />
      </div>
    </div>

    <div
      v-if="modelValue.tavoitteet.length > 0 || showEmptyAlert"
      class="moduuliotsikko"
    >
      <h4>{{ $t('paikallinen-lisays-tavoitteet') }}</h4>
    </div>
    <div
      v-if="!isEditing && modelValue.tavoitteet && modelValue.tavoitteet.length === 0 && showEmptyAlert"
      class="alert alert-info"
    >
      {{ $t('ei-paikallista-tarkennusta') }}
    </div>
    <ep-list
      v-model="modelValue.tavoitteet"
      :is-editable="isEditing"
      lisays="lisaa-tavoite"
      kentta="kuvaus"
    />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import EpPrefixList from '@shared/components/EpPrefixList/EpPrefixList.vue';
import EpList from '@shared/components/forms/EpList.vue';

const props = defineProps({
  modelValue: {
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
