<template>
  <b-row>
    <b-col cols="3">
      {{ $kaanna(arviointiasteikko.osaamistasot[osaamistasonkriteeri._osaamistaso].otsikko) }}
    </b-col>
    <b-col class="d-flex flex-column">
      <template v-if="!isEditing">
        <ul>
          <li
            v-for="(kriteeri, kriteeriIndex) in osaamistasonkriteeri.kriteerit"
            :key="'kriteeri'+kriteeriIndex"
          >
            {{ $kaanna(osaamistasonkriteeri.kriteerit[kriteeriIndex]) }}
          </li>
        </ul>
      </template>

      <template v-else>
        <div
          v-for="(kriteeri, kriteeriIndex) in osaamistasonkriteeri.kriteerit"
          :key="'kriteeri'+kriteeriIndex"
          class="mb-2"
        >
          <div class="d-flex">
            <EpInput
              v-model="osaamistasonkriteeri.kriteerit[kriteeriIndex]"
              class="w-100"
              :is-editing="isEditing"
            />
            <EpButton
              v-if="isEditing"
              variant="link"
              icon="delete"
              @click="poistaKriteeri(kriteeri)"
            />
          </div>
        </div>
        <EpButton
          v-if="isEditing"
          :paddingx="false"
          class="mb-3"
          variant="link"
          icon="add"
          @click="lisaaKriteeri()"
        >
          {{ $t('lisaa-kriteeri') }}
        </EpButton>
      </template>
    </b-col>
  </b-row>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import * as _ from 'lodash';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import { $t, $kaanna } from '@shared/utils/globals';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  isEditing: {
    type: Boolean,
    required: true,
  },
  arviointiasteikko: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const osaamistasonkriteeri = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
  },
});

async function lisaaKriteeri() {
  osaamistasonkriteeri.value.kriteerit = [
    ...osaamistasonkriteeri.value.kriteerit,
    {},
  ];
}

async function poistaKriteeri(poistettavaKriteeri) {
  osaamistasonkriteeri.value.kriteerit = _.filter(osaamistasonkriteeri.value.kriteerit, kriteeri => kriteeri !== poistettavaKriteeri);
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
