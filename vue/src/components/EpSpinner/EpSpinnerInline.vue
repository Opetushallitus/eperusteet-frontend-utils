<template>
  <div
    class="oph-spinner oph-spinner-in-button"
    :class="{'link' : link}"
  >
    <div class="oph-bounce oph-bounce1" />
    <div class="oph-bounce oph-bounce2" />
    <div class="oph-bounce oph-bounce3" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  link: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<style scoped lang="scss">
@import "./style.scss";

  .oph-spinner-in-button.oph-spinner-in-button.link .oph-bounce {
    background-color: #3367E3;
  }

.oph-spinner-in-button {
  margin-left: 15px;
}
</style>
