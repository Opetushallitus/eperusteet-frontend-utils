<template>
<div class="spinner">
  <div class="oph-spinner" aria-label="Ladataan">
    <div class="oph-bounce oph-bounce1" />
    <div class="oph-bounce oph-bounce2" />
    <div class="oph-bounce oph-bounce3" />
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class EpSpinner extends Vue {
}
</script>

<style scoped lang="scss">
@keyframes bounceDelay {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.oph-spinner {
  width: 100px;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}

.oph-spinner-in-button {
  display: inline-block;
  width: auto;
  margin-right: 0.5rem;
}

.oph-spinner .oph-bounce {
  width: 18px;
  height: 18px;
  border-radius: 100%;
  background-color: #159ecb;
  display: inline-block;
  animation: bounceDelay 1.4s infinite ease-in-out;

  /* Prevent first frame from flickering when animation starts */
  animation-fill-mode: both;
}

.oph-spinner-in-button .oph-bounce {
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  background-color: #fff;
}

.oph-spinner .oph-bounce1 {
  animation-delay: -0.32s;
}

.oph-spinner .oph-bounce2 {
  animation-delay: -0.16s;
}

.spinner {
  margin-top: 5px;
  .oph-bounce {
    background-color: #2E5FD1 !important;
  }
}
</style>
