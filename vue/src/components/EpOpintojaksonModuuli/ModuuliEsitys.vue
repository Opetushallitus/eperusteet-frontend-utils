<template>
  <div>
    <div v-if="hasKuvaus">
      <ep-content-viewer
        v-if="moduuli.kuvaus"
        :value="$kaanna(moduuli.kuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />
    </div>
    <div class="d-lg-flex justify-content-between w-60 my-4">
      <div v-if="moduuli.koodi">
        <span class="font-weight-bold">{{ $t('koodi') }}</span>
        <p>{{ moduuli.koodi.arvo }}</p>
      </div>
      <div>
        <span class="font-weight-bold">{{ $t('tyyppi') }}</span>
        <p v-if="moduuli.pakollinen">
          {{ $t('pakollinen') }}
        </p>
        <p v-if="!moduuli.pakollinen">
          {{ $t('valinnainen') }}
        </p>
      </div>
      <div v-if="moduuli.laajuus">
        <span class="font-weight-bold">{{ $t('laajuus') }}</span>
        <p>{{ moduuli.laajuus }} {{ $t('opintopiste') }}</p>
      </div>
    </div>
    <div v-if="hasTavoitteet">
      <h3>{{ $t('yleiset-tavoitteet') }}</h3>
      <div v-if="tavoitteet.kohde">
        {{ $kaanna(tavoitteet.kohde) }}
      </div>
      <ul>
        <li
          v-for="(tavoite, idx) in tavoitteet.tavoitteet"
          :key="idx"
        >
          {{ $kaanna(tavoite) }}
        </li>
      </ul>
    </div>

    <div v-if="hasSisallot">
      <h3>{{ $t('keskeiset-sisallot') }}</h3>
      <div
        v-for="(sisalto, idx) in sisallot"
        :key="idx"
      >
        <div v-if="sisalto.kohde">
          {{ $kaanna(sisalto.kohde) }}
        </div>
        <ul>
          <li
            v-for="(osa, idx) in sisalto.sisallot"
            :key="idx"
          >
            {{ $kaanna(osa) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed } from 'vue';

import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';

const props = defineProps({
  isPerusteView: {
    type: Boolean,
    default: true,
  },
  moduuli: {
    type: Object,
    required: true,
  },
  termit: {
    type: Array,
    required: false,
    default: () => [],
  },
  kuvat: {
    type: Array,
    required: false,
    default: () => [],
  },
});

const koodi = computed(() => {
  return props.moduuli.koodi;
});

const hasKuvaus = computed(() => {
  if (props.moduuli) {
    return props.moduuli.kuvaus;
  }
  return undefined;
});

const tyyppi = computed(() => {
  if (props.moduuli) {
    return props.moduuli.pakollinen ? 'pakollinen' : 'valinnainen';
  }
  return undefined;
});

const tavoitteet = computed(() => {
  if (props.moduuli) {
    return props.moduuli.tavoitteet;
  }
  return undefined;
});

const hasTavoitteet = computed(() => {
  return !_.isEmpty(tavoitteet.value);
});

const sisallot = computed(() => {
  if (props.moduuli) {
    return props.moduuli.sisallot;
  }
  return undefined;
});

const hasSisallot = computed(() => {
  return !_.isEmpty(sisallot.value);
});
</script>

<style scoped lang="scss">
</style>
