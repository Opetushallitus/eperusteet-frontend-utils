<template>
  <div v-if="inner">
    <EpFormGroup
      v-if="showLaajuus"
      :label="$t('laajuus')"
    >
      <ep-laajuus-input
        v-model="inner.laajuus"
        :is-editing="isEditing"
      />
    </EpFormGroup>
    <EpFormGroup class="m-0 p-0">
      <slot name="osaamistavoitteet">
        <h4>{{ $t('osaamistavoitteet') }}</h4>
      </slot>
      <EpAmmattitaitovaatimukset
        v-model="tavoitteet"
        :kohdealueettomat="false"
        :kaannos-tavoiteet="$t('tavoitteet')"
        :kaannos-lisaa-kohdealue="$t('lisaa-tavoiteryhma')"
        :kaannos-lisaa-ammattitaitovaatimus="$t('lisaa-tavoite')"
        kaannos-kohdealueet=""
        :kaannos-kohdealue="$t('tavoitteiden-otsikko')"
        :kaannos-vaatimukset="$t('tavoitteet')"
        :kohde="{ fi: $t('opiskelija') }"
        :tavoitekoodisto="'osaamistavoitteet'"
        :show-kohde="true"
        :is-editing="isEditing"
        :show-koodi-arvo="showKoodiArvo"
      />
    </EpFormGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EpLaajuusInput from '@shared/components/forms/EpLaajuusInput.vue';
import EpAmmattitaitovaatimukset from '@shared/components/EpAmmattitaitovaatimukset/EpAmmattitaitovaatimukset.vue';
import _ from 'lodash';
import EpFormGroup from '@shared/components/forms/EpFormGroup.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  isValinnainen: {
    type: Boolean,
    required: true,
  },
  showLaajuus: {
    type: Boolean,
    default: true,
  },
  showKoodiArvo: {
    type: Boolean,
    default: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  validation: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const inner = computed({
  get: () => props.modelValue || {
    laajuus: 0,
    tavoitteet: {},
  },
  set: (v) => emit('update:modelValue', v),
});

const tavoitteet = computed({
  get: () => inner.value.tavoitteet || null,
  set: (tavoitteet) => emit('update:modelValue', {
    ...inner.value,
    tavoitteet,
  }),
});
</script>

<style lang="scss" scoped>
</style>
