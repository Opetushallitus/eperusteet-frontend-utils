<template>
  <div class="ml-3 mr-3">
    <template v-if="virheita">
      <VirheHuomautukset
        :virhehuomautukset="validointi.virheet"
        tyyppi="virhe"
      />
    </template>

    <template v-if="huomautuksia">
      <div class="font-bold mt-3 mb-3">
        {{ $t('huomautukset') }}
      </div>
      <VirheHuomautukset
        :virhehuomautukset="validointi.huomautukset"
        tyyppi="huomautus"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed } from 'vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import VirheHuomautukset from './VirheHuomautukset.vue';
import { NavigationNodeDto } from '@shared/tyypit';

export interface VirheHuomautus {
  kuvaus: string;
  nimi: { [key: string]: string; };
  route: any;
  navigationNode: NavigationNodeDto;
}

export interface Validointi {
  kategoria: string;
  virheet: VirheHuomautus[];
  huomautukset: VirheHuomautus[];
}

const props = defineProps({
  validointi: {
    type: Object as () => Validointi,
    required: true,
  },
});

const virheita = computed(() => {
  return !_.isEmpty(props.validointi.virheet);
});

const huomautuksia = computed(() => {
  return !_.isEmpty(props.validointi.huomautukset);
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
