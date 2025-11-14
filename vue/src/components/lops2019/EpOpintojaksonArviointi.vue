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
            :model-value="oppiaine.arviointi.kuvaus"
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
      v-model="arviointi"
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
          :model-value="paikallinenOpintojakso.arviointi"
          :opetussuunnitelma-store="opetussuunnitelmaStore"
          layout="normal"
          :is-editable="false"
          @update:model-value="updatePaikallinenOpintojakso(index, $event)"
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

const emit = defineEmits(['update:value']);

const arviointi = computed({
  get: () => props.value.arviointi,
  set: (newValue) => emit('update:value', { ...props.value, arviointi: newValue }),
});

const updatePaikallinenOpintojakso = (index: number, newArviointi: any) => {
  const updated = [...props.value.paikallisetOpintojaksot];
  updated[index] = { ...updated[index], arviointi: newArviointi };
  emit('update:value', { ...props.value, paikallisetOpintojaksot: updated });
};
</script>

<style lang="scss">
</style>
