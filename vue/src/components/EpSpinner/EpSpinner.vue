<template>
<div class="spinner">
  <div class="oph-spinner">
    <div class="oph-bounce oph-bounce1"></div>
    <div class="oph-bounce oph-bounce2"></div>
    <div class="oph-bounce oph-bounce3"></div>
  </div>
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class EpSpinner extends Vue {}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";
@import "./style.scss";

.spinner {
  margin-top: 5px;
  .oph-bounce {
    background-color: $light-blue !important;
  }
}
</style>
