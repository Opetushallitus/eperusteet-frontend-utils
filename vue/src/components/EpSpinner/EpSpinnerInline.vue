<template>
<div class="oph-spinner oph-spinner-in-button">
    <div class="oph-bounce.oph-bounce1"></div>
    <div class="oph-bounce.oph-bounce2"></div>
    <div class="oph-bounce.oph-bounce3"></div>
</div>
</template>

<style scoped lang="scss">
@import "../../styles/_variables.scss";
@import "../../../node_modules/oph-virkailija-style-guide/oph-styles";

.oph-spinner-in-button {
  margin-left: 15px;
  .oph-bounce {
    background-color: $light-blue !important;
  }
}
</style>
