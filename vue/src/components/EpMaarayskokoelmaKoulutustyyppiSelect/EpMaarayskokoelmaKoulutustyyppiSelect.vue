<template>
  <KoulutustyyppiSelect
    v-model="model"
    :koulutustyypit="koulutustyyppiVaihtoehdot"
    :koulutustyyppiryhmat="koulutustyyppiryhmat"
    :is-editing="isEditing"
  >
    <template #colorindicator="{ koulutustyyppi }">
      <EpColorIndicator
        :size="10"
        :kind="koulutustyyppiColors[koulutustyyppi] || koulutustyyppi"
      />
    </template>
  </KoulutustyyppiSelect>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed } from 'vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import { EperusteetKoulutustyypit, EperusteetKoulutustyyppiRyhmat, Toteutus } from '@shared/utils/perusteet';
import KoulutustyyppiSelect from '@shared/components/forms/EpKoulutustyyppiSelect.vue';

const props = defineProps({
  modelValue: {
    type: [String, Array],
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  koulutustyypit: {
    type: Array,
    required: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
  },
});

const koulutustyyppiVaihtoehdot = computed(() => {
  if (props.koulutustyypit) {
    return props.koulutustyypit;
  }

  return [
    ...EperusteetKoulutustyypit,
    'opistovuosi-oppivelvollisille',
    'muu-ammatillinen-koulutus',
    'kotoutumiskoulutus',
  ];
});

const koulutustyyppiColors = computed(() => {
  return {
    'opistovuosi-oppivelvollisille': 'vapaasivistystyo',
    'muu-ammatillinen-koulutus': 'ammatillinen',
    'kotoutumiskoulutus': 'kotoutumiskoulutus',
  };
});

const koulutustyyppiryhmat = computed(() => {
  return {
    ...EperusteetKoulutustyyppiRyhmat,
    [Toteutus.AMMATILLINEN]: [
      ...EperusteetKoulutustyyppiRyhmat[Toteutus.AMMATILLINEN],
      'muu-ammatillinen-koulutus',
    ],
    [Toteutus.VAPAASIVISTYSTYO]: [
      ...EperusteetKoulutustyyppiRyhmat[Toteutus.VAPAASIVISTYSTYO],
      'opistovuosi-oppivelvollisille',
    ],
    [Toteutus.KOTOUTUMISKOULUTUS]: [
      ...EperusteetKoulutustyyppiRyhmat[Toteutus.KOTOUTUMISKOULUTUS],
      'kotoutumiskoulutus',
    ],
  };
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
