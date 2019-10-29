<template>
<div class="oph-spinner oph-spinner-in-button">
    <div class="oph-bounce.oph-bounce1"></div>
    <div class="oph-bounce.oph-bounce2"></div>
    <div class="oph-bounce.oph-bounce3"></div>
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class EpSpinnerInline extends Vue {}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";
@import "./style.scss";

.oph-spinner-in-button {
  margin-left: 15px;
  .oph-bounce {
    background-color: $light-blue !important;
  }
}
</style>
