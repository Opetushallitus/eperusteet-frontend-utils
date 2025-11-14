<template>
  <ep-button
    class="mt-3"
    :show-spinner="julkaistaan || julkaisuKesken"
    :disabled="disabled"
    @click="suoritaJulkaisu()"
  >
    {{ $t('julkaise') }}
  </ep-button>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import { $t, $bvModal } from '@shared/utils/globals';

const props = defineProps({
  julkaise: {
    type: Function,
    required: true,
  },
  julkaisuKesken: {
    type: Boolean,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const julkaistaan = ref(false);

const suoritaJulkaisu = async () => {
  // Access the modal through instance's appContext
  if (await $bvModal.msgBoxConfirm($t('julkaisu-varmistus-modal-teksti') as any, {
    title: $t('vahvista-julkaisu'),
    okVariant: 'primary',
    okTitle: $t('julkaise') as any,
    cancelVariant: 'link',
    cancelTitle: $t('peruuta') as any,
    centered: true,
    ...{} as any,
  })) {
    julkaistaan.value = true;
    await props.julkaise();
    julkaistaan.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables.scss';

</style>
