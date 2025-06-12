<template>
  <div v-if="!muokkaustieto.poistettu && location">
    <router-link :to="location">
      <span v-if="muokkaustieto.nimi">{{ $kaanna(muokkaustieto.nimi) }}</span>
      <span v-else>{{ $t('kohteen-nimea-ei-saatavilla') }}</span>
    </router-link>
  </div>
  <div v-else>
    {{ $kaanna(muokkaustieto.nimi) }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NavigationNodeDto } from '@shared/tyypit';
import { NavigationNode, setPerusteData } from '@shared/utils/NavigationBuilder';

const props = defineProps({
  muokkaustieto: {
    type: Object,
    required: true,
  },
});

const kohdeToAvain = {
  aipevaihe: 'vaiheId',
  aipeoppiaine: 'oppiaineId',
};

const location = computed(() => {
  let node: NavigationNode = {
    type: props.muokkaustieto.kohde,
    children: [],
    path: [],
    location: undefined,
  };
  let navNode: NavigationNodeDto = {
    id: props.muokkaustieto.kohdeId,
    type: props.muokkaustieto.kohde,
    ...(props.muokkaustieto.lisaparametrit && { meta: lisaparaParametritToMeta(props.muokkaustieto.lisaparametrit) }),
  };
  setPerusteData(node, navNode);
  return node.location;
});

function lisaparaParametritToMeta(lisaparametrit: any[]) {
  return lisaparametrit.reduce((acc, param) => {
    if (kohdeToAvain[param.kohde]) {
      acc[kohdeToAvain[param.kohde]] = param.kohdeId;
    }
    return acc;
  }, {});
}
</script>

<style scoped lang="scss">

</style>
