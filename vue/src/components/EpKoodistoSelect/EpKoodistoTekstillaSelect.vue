<template>
  <div v-if="koodit">
    <div
      v-for="(koodi, index) in innerModel"
      :key="'lao'+index"
      class="mb-4"
    >
      <div
        v-if="kooditByUri[koodi.koodiUri]"
        class="d-flex w-100 justify-content-between align-items-center"
      >
        <div class="font-weight-bold">
          {{ $kaanna(kooditByUri[koodi.koodiUri].nimi) }}
        </div>
        <div v-if="isEditing">
          <ep-button
            variant="link"
            icon="delete"
            @click="poistaKoodi(koodi)"
          >
            {{ $t('poista') }}
          </ep-button>
        </div>
      </div>

      <slot
        name="lisateksti"
        :item="koodi"
      />

      <EpContent
        v-model="koodi[tekstiField]"
        layout="normal"
        :is-editable="isEditing"
      />
    </div>

    <b-dropdown
      v-if="isEditing"
      variant="primary"
      class="mb-4"
    >
      <template #button-content>
        <slot name="default">
          Painike puuttuu
        </slot>
      </template>
      <b-dropdown-item-button
        v-for="(koodi, index) in koodit"
        :key="index+'addKoodiTekstilla'"
        @click="addKoodi(koodi)"
      >
        {{ $kaanna(koodi.nimi) }}
      </b-dropdown-item-button>
    </b-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import EpButton from '../EpButton/EpButton.vue';
import { KoodistoSelectStore } from './KoodistoSelectStore';
import _ from 'lodash';
import EpKoodistoSelect from '@shared/components/EpKoodistoSelect/EpKoodistoSelect.vue';
import EpContent from '@shared/components/EpContent/EpContent.vue';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  store: {
    type: Object as () => KoodistoSelectStore,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  tekstiField: {
    type: String,
    required: false,
    default: 'teksti',
  },
});

const emit = defineEmits(['update:modelValue']);

onMounted(async () => {
  await props.store.query();
});

const innerModel = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

function addKoodi(koodi) {
  innerModel.value = [
    ...innerModel.value,
    {
      koodiUri: koodi.koodiUri,
      [props.tekstiField]: null,
    },
  ];
}

function poistaKoodi(poistettava) {
  innerModel.value = _.filter(innerModel.value, koodi => koodi.koodiUri !== poistettava.koodiUri);
}

const koodit = computed(() => {
  return _(props.store?.data.value?.data)
    .map(koodi => {
      const nimi = _.mapValues(_.keyBy(koodi.metadata, v => _.toLower(v.kieli)), v => v.nimi);
      return {
        ...koodi,
        nimi,
      };
    })
    .value();
});

const kooditByUri = computed(() => {
  return _.keyBy(koodit.value, 'koodiUri');
});
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

</style>
