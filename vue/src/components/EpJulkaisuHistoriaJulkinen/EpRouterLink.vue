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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { NavigationNodeDto } from '@shared/tyypit';
import { NavigationNode, setPerusteData } from '@shared/utils/NavigationBuilder';

@Component({
  components: {
  },
})
export default class EpRouterLink extends Vue {
  @Prop({ required: true })
  private muokkaustieto!: any;

  private kohdeToAvain = {
    aipevaihe: 'vaiheId',
    aipeoppiaine: 'oppiaineId',
  };

  get location() {
    let node: NavigationNode = {
      type: this.muokkaustieto.kohde,
      children: [],
      path: [],
      location: undefined,
    };
    let navNode: NavigationNodeDto = {
      id: this.muokkaustieto.kohdeId,
      type: this.muokkaustieto.kohde,
      ...(this.muokkaustieto.lisaparametrit && { meta: this.lisaparaParametritToMeta(this.muokkaustieto.lisaparametrit) }),
    };
    setPerusteData(node, navNode);
    return node.location;
  }

  lisaparaParametritToMeta(lisaparametrit: any[]) {
    return lisaparametrit.reduce((acc, param) => {
      if (this.kohdeToAvain[param.kohde]) {
        acc[this.kohdeToAvain[param.kohde]] = param.kohdeId;
      }
      return acc;
    }, {});
  }
}
</script>

<style scoped lang="scss">

</style>
