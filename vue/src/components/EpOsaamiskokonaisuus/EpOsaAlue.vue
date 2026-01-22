<template>
  <div class="osa-alue">
    <div v-if="isEditing">
      <EpFormGroup>
        <template #label>
          <div class="flex justify-content-between">
            <div>{{ $t('osa-alueen-nimi') }}</div>
            <slot name="poisto" />
          </div>
        </template>
        <ep-input
          v-model="osaAlue"
          :is-editing="isEditing"
        />
      </EpFormGroup>

      <hr>

      <EpFormGroup
        v-for="(tasokuvaus, index) in osaAlue.tasokuvaukset"
        :key="'tasokuvaus' + index"
        class="tasokuvaus"
        :label="$t('osa-alue-otsiko-' + tasokuvaus.taso.toLowerCase())"
      >
        <template v-if="tasokuvaus.taso === 'ESIOPETUS' || tasokuvaus.taso === 'VUOSILUOKKA_12' || tasokuvaus.taso === 'VUOSILUOKKA_3456' || tasokuvaus.taso === 'VUOSILUOKKA_789'">
          <div class="mt-3 mb-2 edelleen-kehittyva-osaaminen">
            {{ $t('edelleen-kehittyva-osaaminen') }}
          </div>
          <EpOsaAlueSisalto
            v-model="tasokuvaus.edelleenKehittyvatOsaamiset"
            :is-editing="isEditing"
          />
        </template>

        <div class="mt-3 mb-2 osaaminen">
          {{ $t('osaaminen') }}
        </div>
        <EpOsaAlueSisalto
          v-model="tasokuvaus.osaamiset"
          :is-editing="isEditing"
        />

        <template v-if="tasokuvaus.taso === 'VUOSILUOKKA_12' || tasokuvaus.taso === 'VUOSILUOKKA_3456' || tasokuvaus.taso === 'VUOSILUOKKA_789'">
          <div class="mt-3 mb-2 edistynyt-osaaminen">
            {{ $t('edistynyt-osaaminen') }}
          </div>
          <EpOsaAlueSisalto
            v-model="tasokuvaus.edistynytOsaaminenKuvaukset"
            :is-editing="isEditing"
          />
        </template>

        <hr>
      </EpFormGroup>
    </div>

    <div v-else>
      <slot name="nimi">
        <h3>{{ $kaanna(osaAlue.nimi) }}</h3>
      </slot>

      <div
        v-for="(tasokuvaus, index) in osaAlue.tasokuvaukset"
        :key="'tasokuvaus' + index"
        class="tasokuvaus"
      >
        <EpFormGroup
          v-if="otsikkoLkm(tasokuvaus) > 0"
          class="mt-3 mb-0 p-0"
          :label="$t('osa-alue-otsiko-' + tasokuvaus.taso.toLowerCase())"
        >
          <div
            v-if="tasokuvaus.edelleenKehittyvatOsaamiset && tasokuvaus.edelleenKehittyvatOsaamiset.length > 0"
            class="mt-3 edelleen-kehittyva-osaaminen"
          >
            <div class="ml-3 otsikko">
              {{ $t('edelleen-kehittyva-osaaminen') }}
            </div>
            <ul class="mb-0 sisalto">
              <li
                v-for="(edKehOsaaminen, edKehOsaamisetIndex) in tasokuvaus.edelleenKehittyvatOsaamiset"
                :key="'edKehOsaaminen' + index + edKehOsaamisetIndex"
              >
                {{ $kaanna(edKehOsaaminen) }}
              </li>
            </ul>
          </div>

          <div
            v-if="tasokuvaus.osaamiset && tasokuvaus.osaamiset.length > 0"
            class="mt-3 osaaminen"
          >
            <div
              v-if="tasokuvaus.edelleenKehittyvatOsaamiset && tasokuvaus.edelleenKehittyvatOsaamiset.length > 0"
              class="ml-3 otsikko"
            >
              {{ $t('osaaminen') }}
            </div>
            <ul class="mb-0 sisalto">
              <li
                v-for="(osaaminen, osaamisetIndex) in tasokuvaus.osaamiset"
                :key="'osaamiset' + index + osaamisetIndex"
              >
                {{ $kaanna(osaaminen) }}
              </li>
            </ul>
          </div>

          <div
            v-if="tasokuvaus.edistynytOsaaminenKuvaukset && tasokuvaus.edistynytOsaaminenKuvaukset.length > 0"
            class="mt-3 edistynyt-osaaminen"
          >
            <div class="ml-3 otsikko">
              {{ $t('edistynyt-osaaminen') }}
            </div>
            <ul class="mb-0 sisalto">
              <li
                v-for="(edistynytKuvaus, kuvausIndex) in tasokuvaus.edistynytOsaaminenKuvaukset"
                :key="'edistynytkuvaus' + index + kuvausIndex"
              >
                {{ $kaanna(edistynytKuvaus) }}
              </li>
            </ul>
          </div>
        </EpFormGroup>

        <slot name="tasokuvaus-postfix" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed } from 'vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import { Kielet } from '@shared/stores/kieli';
import { VueDraggable } from 'vue-draggable-plus';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpOsaAlueSisalto from './EpOsaAlueSisalto.vue';
import EpFormGroup from '@shared/components/forms/EpFormGroup.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const osaAlue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

function otsikkoLkm(tasokuvaus) {
  return (tasokuvaus.osaamiset?.length > 0 ? 1 : 0)
         + (tasokuvaus.edelleenKehittyvatOsaamiset?.length > 0 ? 1 : 0)
         + (tasokuvaus.edistynytOsaaminenKuvaukset?.length > 0 ? 1 : 0);
}

const defaultDragOptions = computed(() => {
  return {
    animation: 300,
    emptyInsertThreshold: 10,
    handle: '.order-handle',
    disabled: !props.isEditing,
    ghostClass: 'dragged',
    group: {
      name: 'kuvaukset',
    },
  };
});

const sisaltokieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

function poistaKuvaus(listaKentta, kuvaus, taso) {
  emit('update:modelValue', {
    ...osaAlue.value,
    tasokuvaukset: _.map(osaAlue.value.tasokuvaukset, tasokuvaus =>
      tasokuvaus.taso === taso
        ? {
          ...tasokuvaus,
          [listaKentta]: _.filter(tasokuvaus[listaKentta], tkuvaus => tkuvaus !== kuvaus),
        }
        : tasokuvaus),
  });
}

function lisaaKuvaus(listaKentta, taso) {
  emit('update:modelValue', {
    ...osaAlue.value,
    tasokuvaukset: _.map(osaAlue.value.tasokuvaukset, tasokuvaus =>
      tasokuvaus.taso === taso
        ? {
          ...tasokuvaus,
          [listaKentta]: [...tasokuvaus[listaKentta], {}],
        }
        : tasokuvaus),
  });
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
