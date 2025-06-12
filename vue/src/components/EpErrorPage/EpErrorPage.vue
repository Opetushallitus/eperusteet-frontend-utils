<template>
  <div class="container my-5">
    <div class="text-left">
      <div class="my-5">
        <h2>{{ $t('virhe-nakyma-otsikko') }}</h2>
        <h3>{{ $t(virhe.alt) }}</h3>
        <div v-if="kohde">
          {{ $t(kohde + '-esikatselu-ei-mahdollista') }}
        </div>
      </div>
      <div class="virhekuva">
        <img
          :src="virhe.img"
          :alt="$t(virhe.alt)"
        >
      </div>
      <div class="d-flex flex-row-reverse">
        <div class="align-self-center">
          <router-link :to="paluuroute">
            {{ $t('palaa-etusivulle') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import _ from 'lodash';
import eiLoydyImage from '@assets/img/images/404.svg';
import virhekuva from '@assets/img/images/virhe.png';
import { useHead  } from '@unhead/vue';

const props = defineProps({
  virhekoodi: {
    type: String,
    default: '404',
  },
  kohdeUrl: {
    type: String,
    required: false,
  },
  paluukohde: {
    type: String,
    default: 'root',
  },
});

useHead({
  meta: [
    {
      vmid: 'robots',
      name: 'robots',
      content: 'none',
    },
  ],
});

const virheImage = {
  '500': {
    img: virhekuva,
    alt: 'virhe-palvelu-virhe',
  },
  '401': {
    img: eiLoydyImage,
    alt: 'virhe-sivua-ei-loytynyt',
  },
  '404': {
    img: eiLoydyImage,
    alt: 'virhe-sivua-ei-loytynyt',
  },
};

const virhe = computed(() => {
  return (props.virhekoodi && virheImage[props.virhekoodi]) || virheImage['500'];
});

const paluuroute = computed(() => {
  return { name: props.paluukohde };
});

const kohde = computed(() => {
  if (props.kohdeUrl && props.virhekoodi === '401') {
    if (_.includes(props.kohdeUrl, 'peruste')) {
      return 'peruste';
    }
    if (_.includes(props.kohdeUrl, 'opetussuunnitelma')) {
      return 'opetussuunnitelma';
    }
  }
  return undefined;
});
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

.virhekuva {
  img {
    width: 100%;
  }
  padding: 0 10% 0 10%;
}
</style>
