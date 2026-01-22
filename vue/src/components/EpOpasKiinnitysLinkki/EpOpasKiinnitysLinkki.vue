<template>
  <div
    v-if="oppaat && oppaat.length > 0"
    class="mt-5"
  >
    <hr>
    <h2 class="mb-4 mt-4">
      {{ $t('ohjeet-ja-materiaalit') }}
    </h2>

    <router-link
      v-for="opas in oppaat"
      :key="opas.id"
      class="flex opas mb-2"
      :to="{name: 'peruste', params: {koulutustyyppi: 'opas', perusteId: opas.id}}"
    >
      <div class="icon mr-3">
        <EpMaterialIcon size="18px">
          menu_book
        </EpMaterialIcon>
      </div>
      <div class="nimi pt-1">
        {{ $kaanna(opas.nimi) }}
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { PerusteDto, Perusteet } from '@shared/api/eperusteet';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const props = defineProps({
  koodiUri: {
    type: String,
    required: false,
  },
});

const oppaat = ref<PerusteDto[] | null>(null);

onMounted(async () => {
  if (props.koodiUri) {
    oppaat.value = (await Perusteet.getOpasKiinnitettyKoodi(props.koodiUri)).data;
  }
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.opas {

  border: 1px solid $gray-lighten-8;
  padding: 0.7rem;
  border-radius: 0.2rem;

  .icon {
    color: $blue-lighten-5;
  }

  .nimi {
    font-weight:600;
    color: $black;
  }

  &:hover {
    background-color: $gray-lighten-5;
  }
}
</style>
