<template>
  <b-form-group>
    <template #label>
      <div
        v-if="isEditing"
        class="mb-2"
      >
        {{ $t('tavoitealueen-otsikko') }}
      </div>
      <EpInput
        v-model="arvioinninKohdeAlue.otsikko"
        :is-editing="isEditing"
        :class="{'mb-3': isEditing }"
      />
    </template>
    <div
      v-for="(arvioinninKohde, arvindex) in arvioinninKohdeAlue.arvioinninKohteet"
      :key="'arvioinninKohde' + arvindex"
      class="ml-3"
    >
      <div class="mb-2">
        <div
          v-if="isEditing || !!$kaanna(arvioinninKohde.otsikko)"
          class="mb-1 font-weight-600"
        >
          {{ $t('arvioinnin-kohteen-otsikko') }}
        </div>
        <EpInput
          v-model="arvioinninKohde.otsikko"
          :is-editing="isEditing"
        />
      </div>
      <div class="mb-3">
        <div
          v-if="isEditing || !!$kaanna(arvioinninKohde.selite)"
          class="mb-1 font-weight-600"
        >
          {{ $t('arvioinnin-kohde') }}
        </div>
        <EpInput
          v-model="arvioinninKohde.selite"
          :is-editing="isEditing"
        />
      </div>

      <template v-if="!arvioinninKohde[arviointiasteikkoRef]">
        <div class="font-weight-600">
          {{ $t('arviointi-asteikon-valinta') }}
        </div>
        <b-form-radio-group
          v-model="arvioinninKohde[arviointiasteikkoRef]"
          stacked
          class="mt-2"
          @input="arviointiVaihdos(arvioinninKohde)"
        >
          <b-form-radio
            v-for="arviointiasteikko in arviointiasteikot"
            :key="'arviointiasteikko-' + arviointiasteikko.id"
            class="mt-2"
            name="arviointiasteikko"
            :value="arviointiasteikko.id"
          >
            <span
              v-for="(osaamistaso, index) in arviointiasteikko.osaamistasot"
              :key="'osaamistaso' + osaamistaso.id"
            >
              <span v-if="index > 0"> / </span>
              {{ $kaanna(osaamistaso.otsikko) }}
            </span>
          </b-form-radio>
        </b-form-radio-group>
      </template>

      <OsaamistasonKriteerit
        v-model="arvioinninKohde.osaamistasonKriteerit"
        :is-editing="isEditing"
        :arviointiasteikko="arviointiasteikotKeyById[arvioinninKohde[arviointiasteikkoRef]]"
      />

      <EpButton
        v-if="isEditing"
        class="mt-4 no-padding"
        variant="link"
        icon="delete"
        @click="poistaArvioinninKohde(arvioinninKohde)"
      >
        {{ $t('poista-arvioinnin-kohde') }}
      </EpButton>

      <hr v-if="isEditing || arvindex < arvioinninKohdeAlue.arvioinninKohteet.length -1">
    </div>

    <div class="d-flex justify-content-between">
      <EpButton
        v-if="isEditing"
        variant="outline"
        icon="add"
        @click="lisaaArvionninkohde"
      >
        {{ $t('lisaa-arvioinnin-kohdealueen-arvioinnin-kohde') }}
      </EpButton>
      <slot name="poisto" />
    </div>
  </b-form-group>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import * as _ from 'lodash';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import OsaamistasonKriteerit from '@shared/components/EpArviointi/OsaamistasonKriteerit.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  isEditing: {
    type: Boolean,
    required: true,
  },
  arviointiasteikot: {
    type: Array,
    required: true,
  },
  arviointiasteikkoRef: {
    type: String,
    required: false,
    default: '_arviointiasteikko',
  },
});

const emit = defineEmits(['update:modelValue']);

// Get instance for $t and $kaanna
const instance = getCurrentInstance();
const $t = instance?.appContext.config.globalProperties.$t;
const $kaanna = instance?.appContext.config.globalProperties.$kaanna;

const arvioinninKohdeAlue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
  },
});

const arviointiasteikotKeyById = computed(() => {
  return _.keyBy(_.map(props.arviointiasteikot, arviointiasteikko => {
    return {
      ...arviointiasteikko,
      osaamistasot: _.keyBy(arviointiasteikko.osaamistasot, 'id'),
    };
  }), 'id');
});

function lisaaArvionninkohde() {
  arvioinninKohdeAlue.value = {
    ...arvioinninKohdeAlue.value,
    arvioinninKohteet: [
      ...arvioinninKohdeAlue.value.arvioinninKohteet,
      {},
    ],
  };
}

function poistaArvioinninKohde(poistettavaKohde) {
  arvioinninKohdeAlue.value = {
    ...arvioinninKohdeAlue.value,
    arvioinninKohteet: _.filter(arvioinninKohdeAlue.value.arvioinninKohteet, arvioinninKohde => arvioinninKohde !== poistettavaKohde),
  };
}

function arviointiVaihdos(muokattavaArvioinninKohde) {
  arvioinninKohdeAlue.value = {
    ...arvioinninKohdeAlue.value,
    arvioinninKohteet: _.map(arvioinninKohdeAlue.value.arvioinninKohteet, arvioinninKohde => {
      if (arvioinninKohde === muokattavaArvioinninKohde) {
        const arviointiasteikko = arviointiasteikotKeyById.value[arvioinninKohde[props.arviointiasteikkoRef]];
        return {
          ...arvioinninKohde,
          osaamistasonKriteerit: _.map(arviointiasteikko.osaamistasot, osaamistaso => ({
            _osaamistaso: _.toString(osaamistaso.id),
            kriteerit: [],
          })),
        };
      }

      return arvioinninKohde;
    }),
  };
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
