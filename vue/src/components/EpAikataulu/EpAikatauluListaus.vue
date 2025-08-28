<template>
  <div>
    <ep-aikataulu
      :aikataulut="kaikkiAikataulut"
      class="pt-3"
      :show-popover="false"
    >
      <template #luomispaiva-topic>
        <slot name="luomispaiva-topic" />
      </template>
      <template #julkaisupaiva-topic>
        <slot name="julkaisupaiva-topic" />
      </template>
    </ep-aikataulu>

    <div class="pt-5">
      <div
        v-for="(aikataulu, i) in paatavoitteet"
        :key="'paatavoite'+i"
        class="row paatavoite"
      >
        <div class="col">
          <ep-form-content class="mb-3">
            <label v-if="aikataulu.tapahtuma !== 'julkaisu'">{{ $kaanna(aikataulu.tavoite) }}</label>
            <slot
              v-else
              name="aikataululistaus-julkaisu-header"
            >
              <label>{{ $t('suunniteltu-julkaisupaiva') }}</label>
            </slot>
            <ep-datepicker
              v-model="aikataulu.tapahtumapaiva"
              :is-editing="true"
              :show-valid-validation="true"
            />
            <ep-toggle
              v-if="julkinenValinta"
              v-model="aikataulu.julkinen"
              class="mb-2"
            >
              {{ $t('julkinen') }}
            </ep-toggle>
          </ep-form-content>
        </div>
        <div class="col" />
        <div class="col-1" />
      </div>

      <hr class="mb-4">

      <div
        v-for="(aikataulu, i) in yleistavoitteet"
        :key="'yleistavoite'+i"
        class="row yleistavoite"
      >
        <div class="col">
          <ep-form-content class="mb-3">
            <label>{{ $t('tavoitteen-paivamaara') }}</label>
            <ep-datepicker
              v-model="aikataulu.tapahtumapaiva"
              :is-editing="true"
              :show-valid-validation="true"
            />
            <ep-toggle
              v-if="julkinenValinta"
              v-model="aikataulu.julkinen"
              class="mb-2"
            >
              {{ $t('julkinen') }}
            </ep-toggle>
          </ep-form-content>
        </div>
        <div class="col">
          <div>
            <ep-form-content name="tavoitteen-kuvaus">
              <ep-field
                v-model="aikataulu.tavoite"
                :is-editing="true"
                :show-valid-validation="false"
              />
            </ep-form-content>
          </div>
        </div>
        <div class="col-1 text-center pt-4">
          <div class="pt-2">
            <ep-button
              variant="link"
              icon="delete"
              @click="poistaTavoite(aikataulu)"
            />
          </div>
        </div>
      </div>
    </div>

    <ep-button
      variant="outline-primary"
      icon="add"
      @click="lisaaTavoite"
    >
      {{ $t('lisaa-tavoite') }}
    </ep-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch} from 'vue';
import _ from 'lodash';
import EpAikataulu from './EpAikataulu.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpDatepicker from '@shared/components/forms/EpDatepicker.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import { Kielet } from '@shared/stores/kieli';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import { aikataulutapahtuma, aikatauluTapahtumaSort, aikatauluTapahtumapaivaSort } from '@shared/utils/aikataulu';

const props = defineProps({
  aikataulutProp: {
    type: Array,
    required: true,
  },
  immutableAikataulut: {
    type: Array,
    required: false,
  },
  julkinenValinta: {
    type: Boolean,
    default: false,
  },
  pakollisetTapahtumat: {
    type: Array,
    default: () => ['julkaisu', 'tavoite'],
  },
});

const emit = defineEmits(['setInvalid']);

const aikataulut = ref([]);

const kaikkiAikataulut = computed(() => [
  ..._.toArray(props.immutableAikataulut),
  ...aikataulut.value,
]);

const paatavoitteet = computed(() =>
  _.chain(aikataulut.value)
    .filter((aikataulu) => aikataulu.tapahtuma !== aikataulutapahtuma.luominen)
    .filter((aikataulu) => aikataulu.tapahtuma !== aikataulutapahtuma.tavoite)
    .value()
);

const yleistavoitteet = computed(() =>
  _.chain(aikataulut.value)
    .filter((aikataulu) => aikataulu.tapahtuma === aikataulutapahtuma.tavoite)
    .value()
);

function lisaaTavoite() {
  aikataulut.value = [
    ...aikataulut.value,
    {
      tapahtuma: aikataulutapahtuma.tavoite,
      tapahtumapaiva: null,
      tavoite: {},
      julkinen: false,
    },
  ];
}

function poistaTavoite(poistettavaAikataulu) {
  aikataulut.value = _.filter(aikataulut.value, (aikataulu) => aikataulu !== poistettavaAikataulu);
}

function getAikataulu() {
  return aikataulut.value;
}

watch(
  () => aikataulut.value,
  (val) => {
    emit('setInvalid', false); // Replace with actual validation logic if needed
  },
  { deep: true }
);

// Initialize aikataulut on mount
watch(
  () => props.aikataulutProp,
  (newVal) => {
    aikataulut.value = _.chain(newVal)
      .sortBy([aikatauluTapahtumaSort, aikatauluTapahtumapaivaSort])
      .value();
  },
  { immediate: true }
);

// Expose methods to parent components
defineExpose({
  getAikataulu,
});
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

.roskalaatikko {
  color: $blue;
}
</style>
