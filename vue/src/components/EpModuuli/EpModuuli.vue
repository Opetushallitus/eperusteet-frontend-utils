<template>
  <div class="moduuli d-flex justify-content-between p-2">
    <div class="font-weight-bold">{{$kaanna(moduuli.nimi)}} <span v-if="moduuli.koodi">({{moduuli.koodi.arvo}})</span></div>
    <div class="d-flex align-items-center">
      <div class="pr-2 opintopiste" v-if="moduuli.laajuus">{{moduuli.laajuus}} {{$t('opintopiste')}}</div>
      <EpColorIndicator class="mt-1" :kind="moduuli.pakollinen ? 'pakollinen' : 'valinnainen'"/>
    </div>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import { KoodiDto } from '@shared/api/eperusteet';

interface Moduuli {
    nimi: { [key: string]: string; };
    pakollinen: boolean;
    koodi?: KoodiDto;
    laajuus?: number;
}

@Component({
  components: {
    EpColorIndicator,
  },
})
export default class EpModuuli extends Vue {
  @Prop({ required: true })
  moduuli!: Moduuli;
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
  .moduuli {
    background-color: #eaf6fe;
    border-radius: 5px;
    color: $blue-darken-1;

    &:hover {
      background-color: #C3EAFF;
    }

    .opintopiste {
      font-size: 0.85rem;
    }
  }
</style>
