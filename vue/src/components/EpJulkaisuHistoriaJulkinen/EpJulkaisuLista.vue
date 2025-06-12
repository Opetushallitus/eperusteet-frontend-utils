<template>
  <div class="mt-2">
    <div
      v-for="(julkaisu, index) in julkaisutMapped"
      :key="'julkaisu'+index"
      class="julkaisu taulukko-rivi-varitys pb-2 pt-2 px-2"
    >
      <div class="d-flex align-items-end justify-content-between">
        <div>
          <span class="font-bold font-size pr-4">{{ $t('julkaisu') }} {{ $sd(julkaisu.luotu) }}</span>
          <span
            v-if="versio === julkaisu.revision"
            class="pr-4"
          >
            <EpMaterialIcon
              size="18px"
              class="pr-1"
            >visibility</EpMaterialIcon>
            <span class="font-italic">{{ $t('katselet-tata-julkaisua') }}</span>
          </span>
          <router-link
            v-if="versio !== julkaisu.revision"
            :to="{ name: 'perusteTiedot', params: { perusteId: julkaisu.peruste.id, revision: julkaisu.revision } }"
          >
            {{ $t('siirry-julkaisuun') }}
          </router-link>
        </div>
        <div
          v-if="julkaisu.revision === uusinVoimassaolevaJulkaisu.revision"
          class="julkaistu"
        >
          {{ $t('voimassaoleva') }}
        </div>
        <div
          v-else-if="julkaisu.muutosmaarays"
          class="voimassaolo-alkaa text-right"
        >
          <span class="pl-2">{{ $t('voimassaolo-alkaa') }}</span>
          <span class="ml-1 font-bold">{{ $sd(julkaisu.muutosmaarays.voimassaoloAlkaa) }}</span>
        </div>
      </div>
      <div
        v-if="julkaisu.muutosmaarays"
        class="d-flex mt-2"
      >
        <div
          v-if="julkaisu.muutosmaarays.url"
          class="pdf-url"
        >
          <EpPdfLink :url="julkaisu.muutosmaarays.url">
            {{ $kaanna(julkaisu.muutosmaarays.nimi) }}
          </EpPdfLink>
        </div>
        <template v-if="julkaisu.liitteet && julkaisu.liitteet.length > 0">
          <div
            v-for="(liiteData, index) in julkaisu.liitteet"
            :key="'maarays'+index"
            class="pdf-url"
          >
            <EpPdfLink :url="liiteData.url">
              {{ $kaanna(liiteData.nimi) }}
            </EpPdfLink>
          </div>
        </template>
      </div>
      <div
        v-if="julkaisu.julkinenTiedote"
        class="my-1"
        v-html="$kaanna(julkaisu.julkinenTiedote)"
      />
      <EpCollapse
        :border-bottom="false"
        :expanded-by-default="false"
        :chevron-location="'right'"
        :use-padding="false"
      >
        <template #header="{ toggled }">
          <template v-if="!toggled">
            {{ $t('nayta-muutokset') }}
          </template>
          <template v-if="toggled">
            {{ $t('piilota-muutokset') }}
          </template>
        </template>
        <EpMuutosvertailu :julkaisu="julkaisu" />
      </EpCollapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpMuutosvertailu from '@shared/components/EpJulkaisuHistoriaJulkinen/EpMuutosvertailu.vue';
import { MaaraysLiiteDtoTyyppiEnum } from '@shared/generated/eperusteet';
import { MaarayksetParams, baseURL } from '@shared/api/eperusteet';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const props = defineProps({
  julkaisut: {
    type: Array,
    required: true,
  },
});

// Get instance to access global properties
const instance = getCurrentInstance();
const $t = instance?.appContext.config.globalProperties.$t;
const $sd = instance?.appContext.config.globalProperties.$sd;
const $kaanna = instance?.appContext.config.globalProperties.$kaanna;
const $slang = instance?.appContext.config.globalProperties.$slang;

// Get route
const route = useRoute();

// Computed properties
const julkaisutSorted = computed(() => {
  return _.sortBy(props.julkaisut, 'revision');
});

const julkaisutReversed = computed(() => {
  return _.clone(julkaisutSorted.value).reverse();
});

const ensimmainenTulevaMuutosmaarays = computed(() => {
  return _.find(julkaisutSorted.value, julkaisu => julkaisu.muutosmaarays && julkaisu.muutosmaarays.voimassaoloAlkaa > Date.now());
});

const uusinTulevaMuutosmaarays = computed(() => {
  return _.find(julkaisutReversed.value, julkaisu => julkaisu.muutosmaarays && julkaisu.muutosmaarays.voimassaoloAlkaa > Date.now());
});

const uusinVoimassaolevaJulkaisu = computed(() => {
  return _.find(julkaisutReversed.value, julkaisu => julkaisu.revision < ensimmainenTulevaMuutosmaarays.value?.revision) || _.first(julkaisutReversed.value);
});

const versio = computed(() => {
  return _.toNumber(route.params?.revision) || _.max(_.map(props.julkaisut, 'revision'));
});

// Methods
function muutosmaaraysUrl(muutosmaarays) {
  if (!_.find(muutosmaarays.liitteet[$slang.value].liitteet, liite => liite.tyyppi === MaaraysLiiteDtoTyyppiEnum.MAARAYSDOKUMENTTI)) {
    return null;
  }

  return baseURL + MaarayksetParams.getMaaraysLiite(_.toString(_.get(_.find(muutosmaarays.liitteet[$slang.value].liitteet, liite => liite.tyyppi === MaaraysLiiteDtoTyyppiEnum.MAARAYSDOKUMENTTI), 'id'))).url;
}

const julkaisutMapped = computed(() => {
  return _.chain(props.julkaisut)
    .map(julkaisu => {
      return {
        ...julkaisu,
        liitteet: _.filter(julkaisu.liitteet, liite => liite.kieli === Kielet.getSisaltoKieli.value),
        ...(!!julkaisu.muutosmaarays && {
          muutosmaarays: {
            ...julkaisu.muutosmaarays,
            url: muutosmaaraysUrl(julkaisu.muutosmaarays),
          },
        }),
      };
    })
    .map(julkaisu => {
      return {
        ...julkaisu,
        muutosmaarays: (!julkaisu.muutosmaarays && julkaisu.muutosmaaraysVoimaan && {
          voimassaoloAlkaa: julkaisu.muutosmaaraysVoimaan,
        }) || julkaisu.muutosmaarays,
      };
    })
    .value();
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables';

.julkaistu {
  border-radius: 25px;
  background-color: $green-1;
  padding: 1px 10px;
  margin-left: 10px;
  color: $white;

  &--kesken {
    background-color: $yellow-1;
    color: $black;
  }

  &--virhe {
    background-color: $red-lighten-1;
    color: $black;
  }
}

.font-bold {
  font-weight: 600 !important;
}

.font-size {
  font-size: 110%;
}

.julkinen {
  color: $green;
}

.maarayslinkit {
  display: inline;
  padding-right: 5px;
  width: 70%;
  margin-right: 15px;
  overflow: auto;
}

.pdf-url {
  width: 70%;
  word-break: break-word;
}

.voimassaolo-alkaa {
  width: 30%;
}

:deep(.ml-auto) {
  margin-left: 0 !important;
}

:deep(.ep-collapse) {
  overflow: auto;
  text-align: right;

  .collapse-button {
    display: inline-flex !important;
  }
}

:deep(.ep-collapse .header) {
  margin-left: auto !important;
  margin-right: 5px;
}
</style>
