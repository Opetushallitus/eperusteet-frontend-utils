<template>
<div class="spinner">
  <div class="oph-spinner" aria-label="Ladataan">
    <div class="oph-bounce oph-bounce1"></div>
    <div class="oph-bounce oph-bounce2"></div>
    <div class="oph-bounce oph-bounce3"></div>
  </div>
</div>
</template>

<style scoped lang="scss">
@import "../../styles/_variables.scss";
@import "../../../node_modules/oph-virkailija-style-guide/oph-styles";

.spinner {
  margin-top: 5px;
  .oph-bounce {
    background-color: $light-blue !important;
  }
}
</style>
