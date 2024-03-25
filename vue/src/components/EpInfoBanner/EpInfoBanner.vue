<template>
  <div class="ep-info-banner d-flex p-3">
    <EpMaterialIcon class="icon mr-2">info</EpMaterialIcon>
    <div><slot/></div>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EpInfoBanner extends Vue {
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

 .ep-info-banner {
  background-color: $blue-lighten-4;
  border-radius: 5px;
 }

 .icon {
  color: $gray-lighten-12;
 }

</style>
