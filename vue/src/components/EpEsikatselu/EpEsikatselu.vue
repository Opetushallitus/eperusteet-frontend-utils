<template>
  <div>
    <label class="font-semibold">
      <slot name="header">
        {{ $t(header) }}
      </slot>
    </label>
    <ep-toggle
      v-if="isEditing"
      v-model="model.esikatseltavissa"
      :is-editing="isEditing"
      :class="{'disabled-events': model.tila === 'poistettu'}"
    >
      <slot name="toggle-text">
        {{ $t(toggleText) }}
      </slot>
    </ep-toggle>
    <ep-external-link
      v-if="!isEditing && model.esikatseltavissa"
      :url="externalUrl"
    />
    <div v-if="!isEditing && !model.esikatseltavissa">
      {{ $t('et-ole-sallinut-esikatselua') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed } from 'vue';
import { Kielet } from '@shared/stores/kieli';
import { PerusteDto } from '@shared/api/eperusteet';
import { koulutustyyppiTheme } from '@shared/utils/perusteet';
import { buildPerusteEsikatseluUrl, buildEsikatseluUrl, buildToteutussuunnitelmaEsikatseluUrl } from '@shared/utils/esikatselu';
import { useRoute } from 'vue-router';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';

interface Esikatseltavissa {
  id: number;
  esikatseltavissa: boolean;
  koulutustyyppi: string;
  tyyppi: string;
  tila: string;
  jotpatyyppi?: string;
  peruste?: PerusteDto
}

const props = defineProps({
  modelValue: {
    type: Object as () => Esikatseltavissa,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  peruste: {
    type: Boolean,
    default: false,
  },
  opetussuunnitelma: {
    type: Boolean,
    default: false,
  },
  toteutussuunnitelma: {
    type: Boolean,
    default: false,
  },
  opas: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const route = useRoute();

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const type = computed(() => {
  if (props.peruste) {
    return 'peruste';
  }
  else if (props.opetussuunnitelma) {
    return 'opetussuunnitelma';
  }
  else if (props.toteutussuunnitelma) {
    return 'toteutussuunnitelma';
  }
  else if (props.opas) {
    return 'opas';
  }
  return 'peruste';
});

const header = computed(() => {
  return 'esikatsele-' + type.value;
});

const toggleText = computed(() => {
  return 'salli-esikatselu-' + type.value;
});

const amosaaToteutustyyppi = computed(() => {
  return route.params.toteutus;
});

const externalUrl = computed(() => {
  if (props.peruste) {
    return buildPerusteEsikatseluUrl(model.value.peruste);
  }

  if (props.opas) {
    return buildEsikatseluUrl(Kielet.getSisaltoKieli.value, `/opas/${model.value.id}`);
  }

  if (props.opetussuunnitelma) {
    return buildEsikatseluUrl(Kielet.getSisaltoKieli.value, `/opetussuunnitelma/${model.value.id}`, `/${koulutustyyppiTheme(model.value.koulutustyyppi!)}/tiedot`);
  }

  if (props.toteutussuunnitelma) {
    return buildToteutussuunnitelmaEsikatseluUrl(model.value, amosaaToteutustyyppi.value);
  }

  return '';
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
