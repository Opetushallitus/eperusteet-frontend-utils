<template>
  <div class="paikallinen-tarkennus-alue">
    <div class="otsikko">{{ $t('paikallinen-teksti') }}</div>
    <slot/>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EpPaikallinenTarkennus extends Vue {

}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.paikallinen-tarkennus-alue {
  border-radius: 1rem;
  background-color: $ylops-paikallinen-color;
  padding: 0.8rem;

  .otsikko {
    font-weight: 600;
    margin-bottom: 8px;
  }
}

</style>
