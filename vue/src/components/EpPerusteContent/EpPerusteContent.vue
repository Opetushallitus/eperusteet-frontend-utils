<template>
  <div class="mt-4">
    <slot
      v-if="perusteObject"
      name="header"
    >
      <h3>{{ $kaanna(perusteObject[otsikko]) }}</h3>
    </slot>
    <ep-collapse
      v-if="perusteObject && perusteObject[teksti]"
      tyyppi="perusteteksti"
      :border-bottom="false"
      :border-top="false"
      :expanded-by-default="perusteTekstiAvattu"
    >
      <template #header>
        <h4>{{ $t('perusteen-teksti') }}</h4>
      </template>
      <ep-content-viewer
        :value="$kaanna(perusteObject[teksti])"
        :kuvat="kuvat"
        :termit="termit"
      />
    </ep-collapse>

    <ep-collapse
      v-if="pohjaObject && pohjaObject[teksti]"
      class="mb-4"
      :use-padding="false"
      tyyppi="pohjateksti"
      :border-bottom="false"
      :border-top="false"
      :expanded-by-default="perusteTekstiAvattu"
    >
      <template #header>
        <h4>{{ $kaanna(pohjaNimi) }}</h4>
      </template>
      <span v-html="$kaanna(pohjaObject[teksti])" />
    </ep-collapse>

    <div v-if="object && (naytaSisaltoTyhjana || hasContent)">
      <slot name="otsikko" />
      <template v-if="isEditing">
        <h4>{{ $t('paikallinen-teksti') }}</h4>
        <ep-content
          v-if="isEditing || hasContent"
          v-model="objectTeksti"
          layout="normal"
          :is-editable="isEditing"
        />
      </template>

      <EpPaikallinenTarkennus
        v-if="!isEditing"
        headerh4
      >
        <ep-content-viewer
          v-if="hasContent"
          :value="$kaanna(object[teksti])"
          :kuvat="kuvat"
          :termit="termit"
        />
      </EpPaikallinenTarkennus>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import EpAlert from '@shared/components/EpAlert/EpAlert.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpPaikallinenTarkennus from '@shared/components/EpPaikallinenTarkennus/EpPaikallinenTarkennus.vue';

const props = defineProps({
  perusteObject: {
    type: Object,
    required: false,
  },
  pohjaObject: {
    type: Object,
    required: false,
  },
  object: {
    type: Object,
    required: false,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  otsikko: {
    type: String,
    default: 'otsikko',
  },
  teksti: {
    type: String,
    default: 'teksti',
  },
  perusteTekstiAvattu: {
    type: Boolean,
    default: false,
  },
  naytaSisaltoTyhjana: {
    type: Boolean,
    default: false,
  },
  kuvat: {
    type: Array,
    required: false,
  },
  termit: {
    type: Array,
    required: false,
  },
});

const emit = defineEmits(['update:object']);

// Inject opetussuunnitelma
const opetussuunnitelma = inject('opetussuunnitelma');

const objectTeksti = computed({
  get: () => props.object?.[props.teksti],
  set: (value) => emit('update:object', { ...props.object, [props.teksti]: value }),
});

const hasContent = computed(() => {
  return props.object != null && props.object[props.teksti] != null;
});

const pohjaNimi = computed(() => {
  return opetussuunnitelma?.pohja?.nimi;
});
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

</style>
