<template>
  <EpInfoPopover
    class="ml-2"
    :class="popoverClass">
    <div class="ml-3">
      <!-- <template v-if="validoinnit?.ok && !validointiOk">
        <div
          v-for="ok in validoinnit.ok"
          :key="ok"
          class="pt-2 pb-1 row"
        >
          <div class="col-1">
            <EpMaterialIcon
              class="text-success"
              size="18px"
            >
              info
            </EpMaterialIcon>
          </div>
          <div class="col">
            <span>{{ $t(ok) }}</span>
          </div>
        </div>
      </template> -->
      <template v-if="validoinnit?.virheet">
        <div
          v-for="virhe in uniqueVirheet"
          :key="virhe"
          class="pt-2 pb-1 row"
        >
          <div class="col-1">
            <EpMaterialIcon
              class="text-danger"
              size="18px"
            >
              info
            </EpMaterialIcon>
          </div>
          <div class="col">
            <span>{{ $t(virhe) }}</span>
          </div>
        </div>
        <div
          v-if="validoinnit.virheet.length > 5"
          class="pt-2 pb-1 row"
        >
          <div class="col-1" />
          <div class="col">
            <EpButton
              class="p-0"
              variant="link"
              @click="toJulkaisuRoute"
              no-padding
            >
              {{ $t('yhteensa-kpl-virhetta', { kpl: validoinnit.virheet.length }) }}
            </EpButton>
          </div>
        </div>
      </template>
      <div
        v-if="validoinnit?.huomautukset && validoinnit.huomautukset.length > 0"
        class="pt-2 pb-1 row"
      >
        <div class="col-1">
          <EpMaterialIcon
            class="text-warning"
            size="18px"
          >
            info
          </EpMaterialIcon>
        </div>
        <div class="col">
          <span>{{ $t(huomautuksia) }}</span>
        </div>
      </div>

    </div>

    <hr/>

    <div class="text-center mb-2 mr-5">
      <EpButton
        variant="link"
        @click="validoi()"
        no-padding
        icon="refresh"
      >
        {{ $t('tarkista-virheet') }}
      </EpButton>
    </div>
  </EpInfoPopover>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import EpInfoPopover from '@shared/components/EpInfoPopover/EpInfoPopover.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import {
  ValidableObject,
  Validoinnit,
  ValidoitavatTilat,
  ValidoitavatTyypit,
} from '@shared/components/EpValidStatus/EpValidStatusTypes';
import EpButton from '../EpButton/EpButton.vue';

const props = defineProps({
  validoinnit: {
    type: Object as () => Validoinnit,
    required: false,
  },
  validoitava: {
    type: Object as () => ValidableObject,
    required: true,
  },
  julkaistava: {
    type: Boolean,
    required: true,
  },
  tyyppi: {
    type: String as () => ValidoitavatTyypit,
    required: true,
  },
  julkaisuRoute: {
    type: Object,
    required: false,
    default: () => ({ name: 'julkaise' }),
  },
  validoi: {
    type: Function,
    required: false,
    default: () => {},
  },
});

const router = useRouter();

const julkaistu = computed(() => {
  return props.validoitava?.tila === ValidoitavatTilat.JULKAISTU || !!props.validoitava?.viimeisinJulkaisuAika;
});

const arkistoitu = computed(() => {
  return props.validoitava?.tila === ValidoitavatTilat.POISTETTU;
});

const tila = computed(() => {
  if (julkaistu.value && !arkistoitu.value) {
    return ValidoitavatTilat.JULKAISTU;
  }

  return _.toLower(props.validoitava?.tila);
});

const luonnos = computed(() => {
  return tila.value === ValidoitavatTilat.LUONNOS;
});

const huomautuksia = computed(() => {
  if (props.tyyppi === ValidoitavatTyypit.PERUSTE) {
    return 'perusteessa-huomautuksia';
  }

  if (props.tyyppi === ValidoitavatTyypit.TOTEUTUSSUUNNITELMA) {
    return 'toteutussuunnitelmassa-huomautuksia';
  }

  if (props.tyyppi === ValidoitavatTyypit.OPETUSSUUNNITELMA) {
    return 'opetussuunnitelmassa-huomautuksia';
  }
  return '';
});

const uniqueVirheet = computed(() => {
  return _.slice(_.uniq(props.validoinnit?.virheet), 0, 5);
});

const validointiOk = computed(() => {
  return _.size(props.validoinnit?.virheet) === 0 && _.size(props.validoinnit?.huomautukset) === 0;
});

const popoverClass = computed(() => {

  if (props.validoinnit?.virheet?.length || 0 > 0 ) {
    return 'text-danger';
  }

  if (props.validoinnit?.huomautukset?.length || 0 > 0) {
    return 'text-warning';
  }

  return '';
});

function toJulkaisuRoute() {
  router.push(props.julkaisuRoute);
}
</script>
