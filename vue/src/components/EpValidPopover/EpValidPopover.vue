<template>
  <div class="ep-valid-popover">
    <EpProgressPopover
      v-if="!isValidating && validoinnit"
      ref="progresspopover"
      :slices="prosessi"
      :popup-style="popupStyle"
    >
      <template #header>
        <div
          class="flex flex-col items-center"
          :class="tyyppi"
        >
          <span class="validation-text pb-2">
            {{ $t(tila) }}<span v-if="muokattavissa">, {{ $t('muokattavissa') }}</span>
          </span>

          <template v-if="!arkistoitu">
            <EpSpinner
              v-if="julkaisemattomiaMuutoksia === undefined || julkaisemattomiaMuutoksia === null"
              color="#fff"
              small
            />
            <template v-else>
              <div
                v-if="julkaisemattomiaMuutoksia"
                class="text-center julkaisemattomia-muutoksia font-size-08"
              >
                <EpMaterialIcon
                  icon-shape="outlined"
                  size="16px"
                >
                  info
                </EpMaterialIcon>
                {{ $t(julkaisemattomiaTeksti) }}
              </div>

              <ep-button
                v-if="luonnos && !julkaistava"
                class="px-3 py-1"
                variant="primary"
                @click="asetaValmiiksi"
              >
                {{ $t('aseta-valmiiksi') }}
              </ep-button>
              <ep-button
                v-else-if="julkaistava && luonnos && !julkaistu && !arkistoitu"
                class="px-3 py-1"
                variant="primary"
                @click="toJulkaisuRoute"
              >
                {{ $t('siirry-julkaisunakymaan') }}
              </ep-button>
            </template>
          </template>
        </div>
      </template>
      <EpSpinner
        v-if="isValidating"
        class="mt-4"
      />
      <div
        v-else
        class="flex flex-col items-center"
      >
        <ep-button
          v-if="arkistoitu"
          variant="primary"
          @click="palauta"
        >
          {{ $t('palauta') }}
        </ep-button>
        <template v-else>
          <ep-button
            v-if="(julkaistu || valmis) && julkaistava"
            variant="primary"
            @click="toJulkaisuRoute"
          >
            {{ $t('siirry-julkaisunakymaan') }}
          </ep-button>
          <div
            v-if="validointiOk"
            class="pl-3 pt-2 pb-1 grid grid-cols-12 gap-2"
          >
            <div class="col-span-1">
              <EpMaterialIcon
                class="text-green-600"
                size="18px"
              >
                check_circle
              </EpMaterialIcon>
            </div>
            <div class="col-span-11">
              {{ $t('ei-julkaisua-estavia-virheita') }}
            </div>
          </div>
          <div class="ml-3">
            <template v-if="validoinnit.ok && !validointiOk">
              <div
                v-for="ok in validoinnit.ok"
                :key="ok"
                class="pt-2 pb-1 grid grid-cols-12 gap-2"
              >
                <div class="col-span-1">
                  <EpMaterialIcon
                    class="text-green-600"
                    size="18px"
                  >
                    info
                  </EpMaterialIcon>
                </div>
                <div class="col-span-11">
                  <span>{{ $t(ok) }}</span>
                </div>
              </div>
            </template>
            <template v-if="validoinnit.virheet">
              <div
                v-for="virhe in uniqueVirheet"
                :key="virhe"
                class="pt-2 pb-1 grid grid-cols-12 gap-2"
              >
                <div class="col-span-1">
                  <EpMaterialIcon
                    class="text-red-600"
                    size="18px"
                  >
                    info
                  </EpMaterialIcon>
                </div>
                <div class="col-span-11">
                  <span>{{ $t(virhe) }}</span>
                </div>
              </div>
              <div
                v-if="validoinnit.virheet.length > 5 && julkaistava && luonnos && !julkaistu && !arkistoitu"
                class="pt-2 pb-1 row"
              >
                <div class="col-span-1" />
                <div class="col-span-11">
                  <ep-button
                    class="p-0"
                    variant="link"
                    @click="toJulkaisuRoute"
                  >
                    {{ $t('yhteensa-kpl-virhetta', { kpl: validoinnit.virheet.length }) }}
                  </ep-button>
                </div>
              </div>
            </template>
            <div
              v-if="validoinnit.huomautukset && validoinnit.huomautukset.length > 0"
              class="pt-2 pb-1 row"
            >
              <div class="col-1">
                <EpMaterialIcon
                  class="text-yellow-600"
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
        </template>
      </div>
      <template #bottom>
        <ep-button
          class="btn-tarkista"
          variant="link"
          @click="validoi"
        >
          <EpMaterialIcon
            class="icon"
            icon-shape="outlined"
          >
            refresh
          </EpMaterialIcon>
          <span> {{ $t('tarkista-virheet') }}</span>
        </ep-button>
      </template>
    </EpProgressPopover>
    <EpSpinner
      v-else
      class="mt-4"
      color="#fff"
    />
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed, watch, nextTick } from 'vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpProgressPopover from '@shared/components/EpProgressPopover/EpProgressPopover.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { tileBackgroundColor } from '@shared/utils/bannerIcons';
import { ValidableObject, Validoinnit, ValidoitavatTilat, ValidoitavatTyypit } from '@shared/components/EpValidPopover/EpValidPopoverTypes';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

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
  progresspopover.value!.tilaPopupVisible = false;
  emit('validoi');
}

const prosessi = computed(() => {
  if (arkistoitu.value) {
    return [0];
  }

  if (_.size(props.validoinnit?.virheet) > 0) {
    return [0.2, 0.5, 1];
  }

  return [1];
});

const tila = computed(() => {
  if (julkaistu.value && !arkistoitu.value) {
    return ValidoitavatTilat.JULKAISTU;
  }

  return _.toLower(props.validoitava?.tila);
});

const popupStyle = computed(() => {
  if (props.tyyppi === 'peruste') {
    return {
      background: '#1d7599',
    };
  }

  return tileBackgroundColor(props.validoitava?.peruste ? props.validoitava?.peruste?.koulutustyyppi : props.validoitava?.koulutustyyppi);
});

const julkaistu = computed(() => {
  return props.validoitava?.tila === ValidoitavatTilat.JULKAISTU || !!props.validoitava?.viimeisinJulkaisuAika;
});

const valmis = computed(() => {
  return props.validoitava?.tila === ValidoitavatTilat.VALMIS;
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

.btn-tarkista {
  text-decoration: none;
  display: flex;
  font-size: 1.125rem;
  font-weight: 500;
  padding: 0;
  align-items: center;
}

.icon {
  margin-right: 5px;
  font-size: 30px;
  align-self: center;
}

:deep(.popover-body) {
  color: inherit;

  .slot-area {
    color: $black;
  }
}

</style>
