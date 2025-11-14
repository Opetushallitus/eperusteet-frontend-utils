<template>
  <div class="content">
    <ep-spinner v-if="!tiedotteet" />

    <div v-else>
      <div
        v-for="(tiedote, index) in tiedotteetFiltered"
        :key="index"
        class="tiedote p-2 pl-3"
        @click="avaaTiedote(tiedote)"
      >
        <div
          class="otsikko"
          :class="{'uusi': tiedote.uusi}"
        >
          {{ $kaanna(tiedote.otsikko) }} <span
            v-if="tiedote.uusi"
            class="uusi"
          >{{ $t('uusi') }}</span>
        </div>
        <div class="muokkausaika">
          {{ $sdt(tiedote.muokattu) }}
        </div>
      </div>

      <div>
        <ep-button
          v-if="naytettavaTiedoteMaara < tiedotteetSize"
          variant="link"
          @click="naytettavaTiedoteMaara += 3"
        >
          <slot name="lisaaBtnText">
            {{ $t('katso-lisaa-tiedotteita') }}
          </slot>
        </ep-button>
        <span v-if="tiedotteetSize === 0">{{ $t('ei-tiedotteita') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance } from 'vue';
import _ from 'lodash';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpButton from '../EpButton/EpButton.vue';
import { TiedoteDto } from '../../api/eperusteet';
import { onkoUusi } from '@shared/utils/tiedote';

interface ListaTiedote extends TiedoteDto {
  uusi: boolean;
}

// Define props
const props = defineProps({
  tiedotteet: {
    type: Array as () => TiedoteDto[],
    required: true,
  },
  tiedoteMaara: {
    type: Number,
    required: false,
  },
});

// Define emits
const emit = defineEmits(['avaaTiedote']);

// Reactive state
const naytettavaTiedoteMaara = ref(3);

// Lifecycle hooks
onMounted(() => {
  if (props.tiedoteMaara) {
    naytettavaTiedoteMaara.value = props.tiedoteMaara;
  }
});

// Computed properties
const tiedotteetSize = computed(() => {
  return _.size(props.tiedotteet);
});

const tiedotteetFiltered = computed(() => {
  if (props.tiedotteet) {
    return _.chain(props.tiedotteet)
      .map((tiedote: TiedoteDto) => {
        return {
          ...tiedote,
          uusi: onkoUusi((tiedote as any).luotu),
        } as ListaTiedote;
      })
      .take(naytettavaTiedoteMaara.value)
      .value();
  }
  return [];
});

// Methods
const avaaTiedote = (tiedote: TiedoteDto) => {
  emit('avaaTiedote', tiedote);
};
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";
  .content {
    .tiedote:nth-of-type(even) {
      background-color: $table-even-row-bg-color;
    }
    .tiedote:nth-of-type(odd) {
      background-color: $table-odd-row-bg-color;
    }
    .tiedote {
      &:hover{
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
        color: $gray-lighten-1;
      }
    }
    :deep(.btn) {
      padding: 0px;
    }
  }
</style>
