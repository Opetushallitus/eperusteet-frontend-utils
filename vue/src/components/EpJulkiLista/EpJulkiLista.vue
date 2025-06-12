<template>
  <div
    ref="contentRef"
    class="content"
  >
    <ep-spinner v-if="!tiedot" />

    <div v-else>
      <div
        v-for="(tieto, index) in tiedotFiltered"
        :key="index"
        class="tieto p-2 pl-3"
        :class="{clickable: hasClickEvent}"
      >
        <div
          class="otsikko"
          :class="{'uusi': tieto.uusi}"
        >
          <a
            href="javascript:;"
            @click="avaaTieto(tieto)"
          >
            <slot
              name="otsikko"
              :item="tieto"
            >
              {{ $kaanna(tieto.otsikko) }} <span
                v-if="tieto.uusi"
                class="uusi"
              >{{ $t('uusi') }}</span>
            </slot>
          </a>
        </div>
        <div class="muokkausaika">
          <slot
            name="muokkausaika"
            :tieto="tieto"
          >
            <span
              v-if="tieto.muokattu"
              class="mr-2"
            >{{ $sd(tieto.muokattu) }}</span>
            <span
              v-if="tieto.koulutustyyppi"
              class="mr-2"
            >{{ tieto.koulutustyyppi }}</span>
            <span v-if="tieto.perusteNimi">{{ $kaanna(tieto.perusteNimi) }}</span>
          </slot>
        </div>
      </div>

      <div v-if="listausTyyppi === 'lisahaku'">
        <ep-button
          v-if="naytettavaTietoMaara < tiedotSize"
          variant="link"
          class="mt-2"
          @click="naytaLisaa"
        >
          <slot name="lisaaBtnText">
            {{ $t('katso-lisaa-tiedotteita') }}
          </slot>
        </ep-button>
        <span
          v-if="tiedotSize === 0"
          class="mt-2"
        >
          <slot name="eiTietoja">
            {{ $t('ei-tuloksia') }}
          </slot>
        </span>
      </div>
      <div v-else-if="listausTyyppi === 'none'" />
      <div v-else>
        <b-pagination
          v-model="sivu"
          align="center"
          no-local-sorting
          :per-page="naytettavaTietoMaara"
          :total-rows="tiedotSize"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance, nextTick } from 'vue';
import _ from 'lodash';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpButton from '../EpButton/EpButton.vue';
import { onkoUusi } from '@shared/utils/tiedote';
import { $kaanna } from '@shared/utils/globals';

export interface JulkiRivi {
  otsikko?: { [key: string]: string; } | string;
  uusi: boolean;
  muokattu?: Date;
  perusteNimi?: string;
  koulutustyyppi?: string;
}

const props = defineProps({
  tiedot: {
    type: Array as () => JulkiRivi[],
    required: true,
  },
  tietoMaara: {
    type: Number,
    default: null,
  },
  listausTyyppi: {
    type: String as () => 'sivutus' | 'lisahaku' | 'none',
    default: 'lisahaku',
  },
});

const emit = defineEmits(['avaaTieto']);

// Reactive state
const naytettavaTietoMaara = ref(3);
const sivu = ref(1);
const contentRef = ref(null);
// Computed properties
const hasClickEvent = computed(() => {
  return emit && emit.length > 0;
});

const tiedotSize = computed(() => {
  return _.size(props.tiedot);
});

const tiedotFiltered = computed(() => {
  if (props.tiedot) {
    return _.chain(props.tiedot)
      .map((tieto: JulkiRivi) => {
        return {
          ...tieto,
          uusi: onkoUusi((tieto as any).luotu),
        } as JulkiRivi;
      })
      .filter((tieto, index) => props.listausTyyppi === 'lisahaku' || index >= (sivu.value - 1) * naytettavaTietoMaara.value)
      .take(naytettavaTietoMaara.value)
      .value();
  }
  return [];
});

// Methods
function avaaTieto(tieto: JulkiRivi) {
  emit('avaaTieto', tieto);
}

async function naytaLisaa() {
  naytettavaTietoMaara.value += 3;
  await nextTick();
  const linkit = contentRef.value?.querySelectorAll('.otsikko a');
  if (linkit?.length >= naytettavaTietoMaara.value) {
    (linkit[naytettavaTietoMaara.value - 3] as any).focus();
  }
}

// Lifecycle hooks
onMounted(() => {
  if (props.tietoMaara) {
    naytettavaTietoMaara.value = props.tietoMaara;
  }
});
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";
  .content {
    .tieto:nth-of-type(even) {
      background-color: $table-even-row-bg-color;
    }
    .tieto:nth-of-type(odd) {
      background-color: $table-odd-row-bg-color;
    }
    .tieto {
      &.clickable:hover{
        background-color: $table-hover-row-bg-color;
        cursor: pointer;
      }
      .otsikko {
        &.uusi {
          font-weight: bold;
        }
        .uusi {
          background-color: $blue-lighten-3;
          border-radius: 5px;
          padding: 2px 4px;
          font-size: 0.7rem;
          margin-left: 5px;
        }
      }
      .muokkausaika {
        color: $gray-lighten-12;
        font-size: 90%;
      }
    }
    :deep(.btn) {
      padding: 0px;
    }
  }

</style>
