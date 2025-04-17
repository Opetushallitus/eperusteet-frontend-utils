<template>
  <div
    v-if="testiymparisto"
    class="testiymparisto"
  >
    {{ testiymparisto }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as _ from 'lodash';

const testiymparistot = {
  'testiopintopolku': 'QA',
  'untuvaopintopolku': 'Untuva',
  'hahtuvaopintopolku': 'Hahtuva',
  'localhost': 'kehittäjä',
};

const testiymparisto = computed(() => {
  return testiymparistot[_.find(_.keys(testiymparistot), ymparisto => _.includes(window.location.origin, ymparisto)) || ''];
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.testiymparisto {
    display: inline-block;
    position: fixed;
    top: 10px;
    left: -35px;
    width: 120px;
    padding: 5px;
    z-index: 5000;
    font-size: 12px;
    text-align: center;
    color: rgb(255, 255, 255);
    background-color: rgb(229, 57, 53);
    box-shadow: rgba(0, 0, 0, 0.176) 0px 6px 12px;
    transform: rotate(-45deg);
  }

</style>
