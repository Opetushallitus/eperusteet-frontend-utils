<template>
  <div>
    <span class="material-icons-outlined default-icon clickable" id="infopopup">info</span>
    <b-popover
      target="infopopup"
      triggers="hover click blur">
      <slot/>
    </b-popover>
  </div>

</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class EpInfoPopover extends Vue {

}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
