<template>
  <div class="kielivalinta">
    <label
      v-if="!julkinen"
      class="kieli-label"
    >{{ $t("kieli-sisalto") }}:</label>
    <EpMaterialIcon v-if="julkinen">
      language
    </EpMaterialIcon>
    <Select
      v-model="sisaltoKieliModel"
      :options="kieliOptions"
      option-label="label"
      option-value="value"
      class="kieli-select"
      :class="{ '!border-none !shadow-none': julkinen }"
      @change="onKieliChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Kielet, UiKielet } from '@shared/stores/kieli';
import { Kieli } from '@shared/tyypit';
import Select from 'primevue/select';
import { $t } from '@shared/utils/globals';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const props = defineProps<{
  julkinen: boolean
}>();

const emit = defineEmits<{
  change: [kieli: Kieli]
}>();

const sisaltoKieliModel = computed({
  get: () => Kielet.getSisaltoKieli.value,
  set: (kieli: Kieli) => Kielet.setSisaltoKieli(kieli),
});

const kieliOptions = computed(() => {
  return UiKielet.map(kieli => ({
    value: kieli,
    label: $t(kieli),
  }));
});

function onKieliChange(event: any) {
  emit('change', event.value);
}
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

.kielivalinta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kieli-label {
  margin: 0;
  font-size: 0.875rem;
}

.julkinen {
  margin-left: 10px;
}

</style>
