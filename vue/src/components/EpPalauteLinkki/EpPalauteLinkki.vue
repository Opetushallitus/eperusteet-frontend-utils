<template>
  <div
    v-if="yllapitoValue"
    class="d-flex"
  >
    <EpMaterialIcon>chevron_right</EpMaterialIcon>
    <EpExternalLink
      :url="url"
      icon-right
    >
      {{ $t('anna-palautetta') }}
    </EpExternalLink>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import * as _ from 'lodash';
import { Maintenance } from '@shared/api/eperusteet';
import { BrowserStore } from '@shared/stores/BrowserStore';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';

const props = defineProps({
  yllapitoAvain: {
    type: String,
    required: true,
  },
});

const yllapitoValue = ref<string | null>(null);

onMounted(async () => {
  try {
    if (window.location.hostname === 'localhost') {
      return;
    }

    yllapitoValue.value = (await Maintenance.getYllapito(props.yllapitoAvain)).data;
  }
  catch (e) {
    yllapitoValue.value = null;
  }
});

const browserLocationHref = computed(() => {
  return BrowserStore.location.href;
});

const url = computed(() => {
  return yllapitoValue.value + '/?ref=' + encodeURIComponent(browserLocationHref.value);
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
