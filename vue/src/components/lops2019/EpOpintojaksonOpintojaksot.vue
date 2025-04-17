<template>
  <div>
    <div class="oppiaineet">
      <div v-if="isEditing">
        <div
          v-for="(oppiaineOpintojakso, idx) in paikallistenOppiaineidenOpintojaksot"
          :key="idx"
        >
          <div v-if="oppiaineetMap[oppiaineOpintojakso.oppiaine.koodi]">
            {{ $kaanna(oppiaineetMap[oppiaineOpintojakso.oppiaine.koodi].nimi) }}
            <ep-opintojakso-select
              v-model="value.paikallisetOpintojaksot"
              :options="oppiaineOpintojakso.opintojaksot"
              :is-editing="isEditing"
            />
          </div>
        </div>
      </div>
      <div v-else>
        <div
          v-for="(oppiaineOpintojakso, idx) in esitettavaPaikallistenOppiaineidenOpintojaksot"
          :key="idx"
        >
          <div v-if="oppiaineetMap[oppiaineOpintojakso.oppiaine.koodi]">
            {{ $kaanna(oppiaineetMap[oppiaineOpintojakso.oppiaine.koodi].nimi) }}
            <ep-opintojakso-select
              v-model="oppiaineOpintojakso.opintojaksot"
              :is-editing="isEditing"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { koodiSorters } from '@shared/utils/perusteet';
import EpOpintojaksoSelect from './EpOpintojaksoSelect.vue';

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
  opintojaksot: {
    required: true,
    type: Array,
  },
  oppiaineetMap: {
    required: true,
    type: Object,
  },
  oppiaineetJaOppimaarat: {
    required: true,
    type: Array,
  },
  oppiaineet: {
    required: true,
    type: Array,
  },
});

const oppiaineidenModuulit = computed(() => {
  return _.chain(props.oppiaineetJaOppimaarat)
    .map((oa: any) => {
      if (oa.perusteenOppiaineUri) {
        return {
          ...oa,
          moduulit: props.oppiaineetMap[oa.perusteenOppiaineUri].moduulit,
        };
      }
      else {
        return oa;
      }
    })
    .value();
});

const oppiaineetJoiltaValittuModuuli = computed(() => {
  return _.chain(oppiaineidenModuulit.value)
    .filter(oppiaineMod => _.some(_.map(oppiaineMod.moduulit, 'koodi.uri'), (oppainemoduri) => _.includes(_.map(props.value!.moduulit, 'koodiUri'), oppainemoduri)))
    .map('koodi.uri')
    .value();
});

const editoitavaOpintojaksoValittuToisessaOpintojaksossa = computed(() => {
  return !_.isEmpty(_.filter(props.opintojaksot, opintojakso => _.includes(_.map(opintojakso.paikallisetOpintojaksot, 'koodi'), props.value!.koodi)));
});

const paikallistenOppiaineidenOpintojaksot = computed(() => {
  if (editoitavaOpintojaksoValittuToisessaOpintojaksossa.value) {
    return [];
  }

  return _.chain(props.oppiaineet)
    .filter('isPaikallinenOppiaine')
    .map((oppiaine) => {
      return {
        oppiaine,
        opintojaksot: _.chain(props.opintojaksot)
          // valittavalla ei saa olla paikallisia opintojaksoja (ei saa olla parentti)
          .filter((opintojakso) => _.isEmpty(opintojakso.paikallisetOpintojaksot))
          // valittavassa opintojaksossa on editoitavan opintojakson oppiaine
          .filter((opintojakso) => _.includes(_.map(opintojakso.oppiaineet, 'koodi'), oppiaine.koodi))
          // valittava ei ole editoitava itse
          .filter((opintojakso) => opintojakso.koodi !== props.value!.koodi)
          .value(),
      };
    })
    .filter(oppiaine => !_.isEmpty(oppiaine.opintojaksot))
    .reject(oppiaine => _.includes(oppiaineetJoiltaValittuModuuli.value, oppiaine.oppiaine.koodi))
    .sortBy(...koodiSorters())
    .value();
});

const esitettavaPaikallistenOppiaineidenOpintojaksot = computed(() => {
  return _.chain(props.oppiaineet)
    .filter('isPaikallinenOppiaine')
    .map((oppiaine) => {
      return {
        oppiaine,
        opintojaksot: _.filter(props.value!.paikallisetOpintojaksot, (paikallinenOpintojakso) => _.includes(_.map(paikallinenOpintojakso.oppiaineet, 'koodi'), oppiaine.koodi)),
      };
    })
    .filter(oppiaineOpintojakso => !_.isEmpty(oppiaineOpintojakso.opintojaksot))
    .sortBy(...koodiSorters())
    .value();
});
</script>

<style lang="scss">
</style>
