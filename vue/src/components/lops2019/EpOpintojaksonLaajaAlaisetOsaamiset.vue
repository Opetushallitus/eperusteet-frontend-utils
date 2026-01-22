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
            :model-value="oppiaine.laajaAlaisetOsaamiset.kuvaus"
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
            :model-value="laajalainenosaaminen.kuvaus"
          />
        </div>
      </div>
    </div>

    <div v-if="showEmptyAlert || modelValue.laajaAlainenOsaaminen.length > 0">
      <div class="moduuliotsikko">
        <h4>{{ $t('paikallinen-lisays-opintojakso-laaja-alainen') }}</h4>
      </div>
      <div
        v-for="(lo, idx) in modelValue.laajaAlainenOsaaminen"
        :key="idx + '-paikallinen'"
        class="paikallinen-laaja-alainen"
      >
        <div>
          <span v-if="laajaAlaisetKooditByUri[lo.koodi]">
            <h5 class="inline">{{ $kaanna(laajaAlaisetKooditByUri[lo.koodi].nimi) }}</h5>
            <ep-button
              v-if="isEditing"
              variant="link"
              @click.stop="poistaLaaja(lo)"
            >
              <EpMaterialIcon>close</EpMaterialIcon>
            </ep-button>
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
        v-if="!isEditing && modelValue.laajaAlainenOsaaminen.length === 0"
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
      v-for="(paikallinenOpintojakso, index) in modelValue.paikallisetOpintojaksot"
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
          <div class="moduuliotsikko">
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

<script setup lang="ts">
import { computed } from 'vue';
import _ from 'lodash';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpContent from '@shared/components/EpContent/EpContent.vue';

const props = defineProps({
  opetussuunnitelmaStore: {
    required: false,
  },
  modelValue: {
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
  laajaAlaistenKoodit: {
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

const emit = defineEmits(['update:modelValue']);

const laajaAlaisetKooditByUri = computed(() => {
  return _.keyBy(props.laajaAlaistenKoodit, 'koodi');
});

function poistaLaaja(lo: any) {
  const updatedValue = {
    ...props.modelValue,
    laajaAlainenOsaaminen: _.filter(props.modelValue.laajaAlainenOsaaminen, osaaminen => osaaminen !== lo),
  };
  emit('update:modelValue', updatedValue);
}

function addLaaja(laaja: any) {
  const updatedValue = {
    ...props.modelValue,
    laajaAlainenOsaaminen: [
      ...props.modelValue.laajaAlainenOsaaminen,
      {
        koodi: laaja.koodi,
      },
    ],
  };
  emit('update:modelValue', updatedValue);
}
</script>

<style lang="scss">
</style>
