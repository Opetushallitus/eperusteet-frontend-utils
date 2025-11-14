<template>
  <div>
    <b-modal
      id="epConfirmDialog"
      ref="epConfirmDialogModal"
      v-model="visible"
      size="lg"
      @ok="cancelSave"
    >
      <template #modal-title>
        {{ $t('haluatko-poistua-tallentamatta') }}
      </template>

      <span>{{ $t('poistumisen-varmistusteksti-dialogi') }}</span>

      <template #modal-cancel>
        {{ $t('peruuta') }}
      </template>
      <template #modal-ok>
        {{ $t('poistu-tallentamatta') }}
      </template>
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import _ from 'lodash';

const props = defineProps({
  redirect: {
    type: Function,
    required: true,
  },
  ctrls: {
    type: Object,
    required: true,
  },
});

const epConfirmDialogModal = useTemplateRef('epConfirmDialogModal');
const visible = ref(false);

function setVisible() {
  visible.value = true;
}

async function cancelSave() {
  await props.ctrls.cancel();
  props.redirect();
}

// Expose methods to parent components
defineExpose({
  setVisible,
});
</script>

<style scoped lang="scss">

</style>
