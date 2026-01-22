<template>
  <div class="julkaisuhistoria">
    <h3>
      {{ $t('julkaisuhistoria') }}
    </h3>
    <EpSpinner v-if="!julkaisut" />
    <template v-else>
      <div
        v-if="julkaisut.length === 0"
        class="alert alert-info"
      >
        <slot name="empty">
          {{ $t('ei-julkaisuja') }}
        </slot>
      </div>
      <div v-else>
        <div
          v-for="(julkaisu, index) in julkaisutMapped"
          :key="'julkaisu'+index"
          class="julkaisu pb-2 ml-1 px-3"
        >
          <div class="flex justify-content-between items-center">
            <div>
              <span class="font-bold pr-1">{{ $t('julkaisu') }} {{ julkaisu.revision }}</span>
              <span
                v-if="latestJulkaisuRevision && latestJulkaisuRevision.revision === julkaisu.revision"
                class="julkaistu"
              >{{ $t('julkaistu-versio') }}</span>
              <span
                v-if="julkaisu.tila === 'KESKEN'"
                class="julkaistu julkaistu--kesken"
              >{{ $t('julkaisu-kesken') }}</span>
              <span
                v-if="julkaisu.tila === 'VIRHE'"
                class="julkaistu julkaistu--virhe"
              >{{ $t('julkaisu-epaonnistui') }}</span>
            </div>

            <div class="flex items-center">
              <slot
                v-if="julkaisu.tila !== 'VIRHE'"
                name="katsele"
                :julkaisu="julkaisu"
              />
              <EpButton
                v-if="latestJulkaisuRevision && latestJulkaisuRevision.revision !== julkaisu.revision && julkaisu.tila === 'JULKAISTU'"
                v-oikeustarkastelu="{ oikeus: 'muokkaus' }"
                icon="keyboard_return"
                class="ml-4"
                variant="link"
                :show-spinner="julkaisu.palautuksessa"
                @click="palautaConfirm(julkaisu)"
              >
                {{ $t('palauta') }}
              </EpButton>
            </div>
          </div>
          <div class="my-1">
            {{ $sdt(julkaisu.luotu) }} <span v-if="julkaisu.nimi">{{ julkaisu.nimi }}</span>
          </div>
          <div
            class="my-1"
            v-html="$kaanna(julkaisu.tiedote)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance } from 'vue';
import _ from 'lodash';
import { parsiEsitysnimi } from '@shared/utils/kayttaja';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { $t, $kaanna, $sdt, $bvModal } from '@shared/utils/globals';

interface Julkaisu {
  revision?: number;
  tiedote?: { [key: string]: string; };
  luotu?: Date;
  luoja?: string;
  kayttajanTieto?: any;
  tila?: 'JULKAISTU' | 'KESKEN' | 'VIRHE';
  palautuksessa?: boolean;
}

const props = defineProps({
  julkaisut: {
    type: Array as () => Julkaisu[],
    required: false,
  },
  palauta: {
    type: Function,
    required: false,
  },
});

const palautuksessa = ref<number | null>(null);

const julkaisutMapped = computed(() => {
  return _.chain(props.julkaisut)
    .map(julkaisu => {
      return {
        ...julkaisu,
        ...(julkaisu.kayttajanTieto && { nimi: parsiEsitysnimi(julkaisu.kayttajanTieto) }),
        tila: julkaisu.tila || 'JULKAISTU',
        palautuksessa: palautuksessa.value === julkaisu.revision,
      };
    })
    .sortBy('revision')
    .reverse()
    .value();
});

const latestJulkaisuRevision = computed(() => {
  return _.find(julkaisutMapped.value, julkaisu => julkaisu.tila === 'JULKAISTU');
});

const palautaConfirm = async (julkaisu: Julkaisu) => {
  if (await $bvModal.msgBoxConfirm(($t('toiminto-kopioi-ja-palauttaa-valitsemasi-version-julkiseksi') as any), {
    title: $t('palauta-versio-julkiseksi'),
    okVariant: 'primary',
    okTitle: $t('kylla') as any,
    cancelVariant: 'link',
    cancelTitle: $t('peruuta') as any,
    centered: true,
    ...{} as any,
  })) {
    palautuksessa.value = julkaisu.revision || null;
    if (props.palauta) {
      await props.palauta(julkaisu);
    }
    palautuksessa.value = null;
  }
};
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables';
.julkaisu:nth-of-type(even) {
  background-color: $gray-lighten-13;
}

.julkaistu {
  border-radius: 25px;
  background-color: $green-lighten-2;
  padding: 5px 10px;
  margin-left: 10px;
  color: $white;

  &--kesken {
    background-color: $yellow-1;
  }

  &--virhe {
    background-color: $red-lighten-1;
  }
}
</style>
