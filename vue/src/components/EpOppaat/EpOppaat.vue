<template>
  <ep-main-view :container="true">
    <template #header>
      <h1>{{ $t('ohjeet-ja-materiaalit') }}</h1>
    </template>

    <div class="mb-4">
      <label>{{ $t('nimi') }}</label>
      <div class="d-flex justify-content-between">
        <ep-search
          v-model="query.nimi"
          :placeholder="$t('etsi-ohjeita')"
          class="w-50"
        />
        <KoulutustyyppiSelect
          v-model="query.koulutustyyppi"
          :is-editing="true"
          class="w-50"
          :koulutustyypit="koulutustyypit"
        />
      </div>

      <div class="d-flex mt-3">
        <EpToggle v-model="query.tuleva" :value="true" :label="$t('tulevat')" checkbox/>
        <EpToggle v-model="query.voimassaolo" :value="true" :label="$t('voimassaolevat')" checkbox/>
      </div>
    </div>

    <ep-spinner v-if="!oppaat" />

    <template v-else>
      <EpExternalLink
        v-for="opas in mappedOppaat"
        :key="opas.id"
        :show-icon="false"
        :url="opas.url"
        class="opas mb-2"
      >
        <div class="d-flex">
          <div class="icon mr-3">
            <EpMaterialIcon>menu_book</EpMaterialIcon>
          </div>
          <div class="pt-1 text">
            <div class="nimi">
              {{ $kaanna(opas.nimi) }}
            </div>
            <div v-if="opas.voimassaoloAlkaa">
              {{ $t('voimaantulo') }} {{ $sd(opas.voimassaoloAlkaa) }}
            </div>
          </div>
        </div>
      </EpExternalLink>

      <ep-pagination
        v-model="sivu"
        class="mt-3"
        :per-page="query.sivukoko"
        :total-rows="kokonaismaara"
      />
    </template>
  </ep-main-view>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed, watch } from 'vue';
import EpMainView from '@shared/components//EpMainView/EpMainView.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { OppaatStore } from '@shared/stores/OppaatStore';
import KoulutustyyppiSelect from '@shared/components/forms/EpKoulutustyyppiSelect.vue';
import { EperusteetKoulutustyypit } from '@shared/utils/perusteet';
import EpPagination from '@shared/components/EpPagination/EpPagination.vue';
import { OppaatQuery } from '@shared/api/eperusteet';
import { buildKatseluUrl } from '@shared/utils/esikatselu';
import { Kielet } from '@shared/stores/kieli';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';

const props = defineProps({
  koulutustyypit: {
    type: Array as () => string[],
    default: () => EperusteetKoulutustyypit,
  },
});

const store = new OppaatStore();

const query = ref({
  sivu: 0,
  sivukoko: 20,
  nimi: '',
  voimassaolo: true,
  tuleva: true,
  koulutustyyppi: [],
} as OppaatQuery);

const oppaat = computed(() => {
  if (store.oppaat.value) {
    return store.oppaat.value.data;
  }
});

const mappedOppaat = computed(() => {
  return _.map(oppaat.value, opas => {
    return {
      ...opas,
      url: buildKatseluUrl(Kielet.getSisaltoKieli.value, `/opas/${_.get(opas, 'id')}`),
    };
  });
});

const kokonaismaara = computed(() => {
  return store.oppaat.value?.kokonaismäärä;
});

const sivu = computed({
  get: () => query.value.sivu! + 1,
  set: (value: number) => {
    query.value.sivu = value - 1;
  },
});

watch(() => query.value, async () => {
  if (_.size(query.value.koulutustyyppi) === 0) {
    await store.fetch({
      ...query.value,
      koulutustyyppi: props.koulutustyypit,
    });
  }
  else {
    await store.fetch(query.value);
  }
}, { deep: true, immediate: true });
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .opas {
    color: $black;
    border: 1px solid $gray-lighten-8;
    padding: 0.3rem 0.5rem;
    border-radius: 0.2rem;

    .icon {
      font-size: 1.5rem;
      color: $blue-lighten-5;
    }

    .text {
      color: $black;

      .nimi {
        font-weight:600;
      }
    }

    &:hover {
      background-color: $gray-lighten-5;
      cursor: pointer;
    }
  }

</style>
