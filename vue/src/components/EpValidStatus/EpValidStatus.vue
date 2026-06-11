<template>
  <div class="ep-valid-status d-flex flex-column align-items-center">
    <EpSpinner
      v-if="isValidating || julkaisemattomiaMuutoksia === undefined || julkaisemattomiaMuutoksia === null"
      color="#fff"
      class="mt-5"
    />

    <template v-else>

      <div class="d-flex align-items-center">
        <EpProgressArchived v-if="arkistoitu" />
        <EpProgressInProgress v-else-if="virheita" :slices="prosessi" />
        <EpProgressComplete v-else />
        <div class="ml-2 d-flex flex-column">
          <span>{{ $t(tila) }}</span><span v-if="muokattavissa">, {{ $t('muokattavissa') }}</span>
          <EpValidationPopover
            v-if="!validointiOk"
            :validoinnit="validoinnit"
            :validoitava="validoitava"
            :julkaistava="julkaistava"
            :tyyppi="tyyppi"
            :julkaisu-route="julkaisuRoute"
            :validoi="validoi"
          />
        </div>

      </div>

      <div class="validation-text pb-2 text-center" v-if="julkaisemattomiaMuutoksia">
        {{ $t(julkaisemattomiaTeksti) }}
      </div>

      <div class="navigation-buttons" :class="{ 'mt-3': !julkaisemattomiaMuutoksia }">
        <EpButton
          v-if="arkistoitu"
          @click="palauta"
        >
          {{ $t('palauta') }}
        </EpButton>
        <EpButton
          v-if="luonnos && !julkaistava"
          @click="asetaValmiiksi"
        >
          {{ $t('aseta-valmiiksi') }}
        </EpButton>
        <EpButton
          v-if="julkaistava"
          @click="toJulkaisuRoute"
        >
          {{ $t('siirry-julkaisunakymaan') }}
        </EpButton>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed, watch, nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import EpProgressPopover from '@shared/components/EpProgressPopover/EpProgressPopover.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { ValidableObject, Validoinnit, ValidoitavatTilat, ValidoitavatTyypit } from '@shared/components/EpValidStatus/EpValidStatusTypes';
import EpValidationPopover from '../EpValidationPopover/EpValidationPopover.vue';
import EpProgressArchived from '../EpProgressPopover/EpProgressArchived.vue';
import EpProgressInProgress from '../EpProgressPopover/EpProgressInProgress.vue';
import EpProgressComplete from '../EpProgressPopover/EpProgressComplete.vue';
import EpButton from '../EpButton/EpButton.vue';

const props = defineProps({
  validoitava: {
    type: Object as () => ValidableObject,
    required: true,
  },
  validoinnit: {
    type: Object as () => Validoinnit,
    required: false,
  },
  julkaisemattomiaMuutoksia: {
    type: Boolean,
    required: false,
  },
  julkaistava: {
    type: Boolean,
    required: true,
  },
  tyyppi: {
    type: String as () => ValidoitavatTyypit,
    required: true,
  },
  isValidating: {
    type: Boolean,
    required: false,
    default: false,
  },
  julkaisuRoute: {
    type: Object,
    required: false,
    default: () => ({ name: 'julkaise' }),
  },
});

const emit = defineEmits(['asetaValmiiksi', 'palauta', 'validoi']);
const router = useRouter();
const progresspopover = ref<InstanceType<typeof EpProgressPopover> | null>(null);

function asetaValmiiksi() {
  emit('asetaValmiiksi');
}

function palauta() {
  emit('palauta');
}

function validoi() {
  emit('validoi');
}

const prosessi = computed(() => {
  if (julkaistu.value) {
    return [0.3, 1, 1];
  }

  return [0.2, 0.5, 1];
});

const tila = computed(() => {
  if (julkaistu.value && !arkistoitu.value) {
    return ValidoitavatTilat.JULKAISTU;
  }

  return _.toLower(props.validoitava?.tila);
});

const julkaistu = computed(() => {
  return props.validoitava?.tila === ValidoitavatTilat.JULKAISTU || !!props.validoitava?.viimeisinJulkaisuAika;
});

const luonnos = computed(() => {
  return tila.value === ValidoitavatTilat.LUONNOS;
});

const muokattavissa = computed(() => {
  return julkaistu.value && props.validoitava?.tila === ValidoitavatTilat.LUONNOS;
});

const arkistoitu = computed(() => {
  return props.validoitava?.tila === ValidoitavatTilat.POISTETTU;
});

const julkaisemattomiaTeksti = computed(() => {
  if (props.tyyppi === ValidoitavatTyypit.PERUSTE) {
    return 'perusteessa-on-julkaisemattomia-muutoksia';
  }

  if (props.tyyppi === ValidoitavatTyypit.TOTEUTUSSUUNNITELMA) {
    return 'toteutussuunnitelmassa-on-julkaisemattomia-muutoksia';
  }

  if (props.tyyppi === ValidoitavatTyypit.OPETUSSUUNNITELMA) {
    return 'opetussuunnitelmassa-on-julkaisemattomia-muutoksia';
  }
  return '';
});

const validointiOk = computed(() => {
  return _.size(props.validoinnit?.virheet) === 0 && _.size(props.validoinnit?.huomautukset) === 0;
});

const virheita = computed(() => {
  return _.size(props.validoinnit?.virheet) > 0;
});

function toJulkaisuRoute() {
  router.push(props.julkaisuRoute);
}

watch(() => props.isValidating, async (newValue) => {
  await nextTick();
  progresspopover.value?.$forceUpdate();
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables';

.validation-text {
  font-size: 14px;
}

.julkaisemattomia-muutoksia {
  width: 15rem;
  line-height: 1.1rem;
}

:deep(.popover-body) {
  color: inherit;

  .slot-area {
    color: $black;
  }
}

.navigation-buttons {
  :deep(.btn) {
    padding: 0.2rem 0.5rem;
  }
}

</style>
