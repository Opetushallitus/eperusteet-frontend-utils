<template>
  <div>
    <ep-button
      v-if="props.aikataulut && props.aikataulut.length > 0"
      v-oikeustarkastelu="{ oikeus: 'muokkaus' }"
      button-class="pr-1"
      variant="link"
      icon="edit"
      @click="openModal"
    >
      {{ $t('muokkaa') }}
    </ep-button>

    <b-modal
      id="aikataulumodal"
      ref="aikataulumodal"
      size="lg"
      :hide-header-close="true"
      :ok-disabled="invalid"
      @ok="tallenna"
    >
      <template #modal-title>
        {{ props.aikataulut && props.aikataulut.length > 0 ? $t('muokkaa-aikataulua') : $t('ota-aikataulu-kayttoon') }}
      </template>

      <slot name="selite" />

      <ep-aikataulu-listaus
        ref="epAikatauluListaus"
        :aikataulut-prop="aikataulutClone"
        :immutable-aikataulut="props.immutableAikataulut"
        :root-model="props.rootModel"
        :julkinen-valinta="props.julkinenValinta"
        :pakolliset-tapahtumat="props.pakollisetTapahtumat"
        @setInvalid="setInvalid"
      >
        <template #luomispaiva-topic>
          <slot name="luomispaiva-topic" />
        </template>
        <template #julkaisupaiva-topic>
          <slot name="julkaisupaiva-topic" />
        </template>
        <template #aikataululistaus-julkaisu-header>
          <slot name="aikataululistaus-julkaisu-header" />
        </template>
      </ep-aikataulu-listaus>

      <template #modal-cancel>
        {{ $t('peruuta') }}
      </template>
      <template #modal-ok>
        {{ $t('tallenna') }}
      </template>
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, useTemplateRef } from 'vue';
import _ from 'lodash';
import { aikataulutapahtuma, AikatauluRootModel, Tapahtuma } from '../../utils/aikataulu';
import EpAikatauluListaus from './EpAikatauluListaus.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpDatepicker from '@shared/components/forms/EpDatepicker.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import { Kielet } from '@shared/stores/kieli';
import { $t } from '@shared/utils/globals';

const props = defineProps({
  rootModel: Object as () => AikatauluRootModel,
  aikataulut: {
    type: Array,
    required: true,
  },
  immutableAikataulut: Array,
  julkinenValinta: {
    type: Boolean,
    default: false,
  },
  pakollisetTapahtumat: Array,
});

const emit = defineEmits(['tallenna']);

const invalid = ref(false);
const aikataulutClone = ref<Tapahtuma[]>([]);

// Template refs should be declared at the top level
const aikataulumodal = useTemplateRef('aikataulumodal');
const epAikatauluListaus = useTemplateRef('epAikatauluListaus');

function openModal() {
  if (_.size(props.aikataulut) === 0) {
    setInvalid(true);

    aikataulutClone.value = [
      {
        tapahtuma: aikataulutapahtuma.luominen,
        tapahtumapaiva: props.rootModel?.luotu,
        tavoite: {
          [Kielet.getSisaltoKieli.value]: $t('luomispaiva'),
        },
      },
      {
        tapahtuma: aikataulutapahtuma.julkaisu,
        tapahtumapaiva: null,
        tavoite: {
          [Kielet.getSisaltoKieli.value]: $t('suunniteltu-julkaisupaiva'),
        },
      },
    ];
  } else {
    aikataulutClone.value = _.cloneDeep(props.aikataulut);
  }

  aikataulumodal.value?.show();
}

function tallenna() {
  emit('tallenna', epAikatauluListaus.value?.getAikataulu());
}

function setInvalid(value: boolean) {
  invalid.value = value;
}

// Expose methods to parent components
defineExpose({
  openModal,
});
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";
</style>
