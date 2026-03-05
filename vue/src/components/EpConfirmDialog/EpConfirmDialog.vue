<template>
  <EpModal
    ref="epConfirmDialogModal"
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
  </EpModal>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import EpModal from '@shared/components/EpModal/EpModal.vue';

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

function show() {
  epConfirmDialogModal.value?.show();
}

async function cancelSave() {
  await props.ctrls.cancel();
  props.redirect();
}

defineExpose({
  show,
});
</script>

<style scoped lang="scss">

</style>
