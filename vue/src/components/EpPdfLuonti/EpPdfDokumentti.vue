<template>
  <div>
    <ep-spinner v-if="dokumenttiLataa" />
    <div v-else>
      <div
        class="row pdf-box align-items-center justify-content-between"
        :class="{'luotu': dokumenttiLuotu, 'ei-luotu': !dokumenttiLuotu, 'polling': polling, 'epaonnistui': dokumenttiEpaonnistui}"
      >
        <div class="col col-auto ikoni">
          <EpMaterialIcon size="48px">
            picture_as_pdf
          </EpMaterialIcon>
        </div>
        <div class="col-lg teksti">
          <span v-if="dokumenttiLuotu">
            {{ pdfnimi }}.pdf
          </span>
          <span v-else-if="dokumenttiEpaonnistui">
            <span v-if="dokumentti.julkaisuDokumentti">
              {{ $t('julkaisu-pdf-tiedosto-luonti-epaonnistui') }}
            </span>
            <span v-else>
              {{ $t('pdf-tiedosto-luonti-epaonnistui') }}
            </span>
          </span>
          <span v-else>
            {{ $t('pdf-tiedostoa-ei-ole-viela-luotu') }}
          </span>
        </div>
        <div
          v-if="dokumenttiLuotu && !polling"
          class="col-sm-3 text-left luomisaika"
        >
          <span class="luontitiedot">{{ $t('luotu') }}: {{ $sdt(dokumentti.valmistumisaika) }}</span>
          <span
            v-if="dokumentti.julkaisuDokumentti || isKvLiite"
            class="luontitiedot"
          >{{ $t('julkaistu') }}</span>
          <span
            v-else
            class="luontitiedot"
          >{{ $t('tyoversio') }}</span>
        </div>
        <div
          v-if="dokumenttiLuotu"
          class="col-sm-2 text-left"
        >
          <a
            class="btn btn-link pl-0"
            :href="dokumenttiHref"
            target="_blank"
            rel="noopener noreferrer"
            variant="link"
          >
            <EpMaterialIcon
              class="mr-1"
              icon-shape="outlined"
              size="18px"
            >visibility</EpMaterialIcon>
            <span>{{ $t('esikatsele-ja-lataa') }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const props = defineProps({
  dokumentti: {
    type: Object,
    required: true,
  },
  dokumenttiHref: {
    type: String,
    required: true,
  },
  polling: {
    type: Boolean,
    required: false,
    default: false,
  },
  pdfnimi: {
    type: String,
    required: true,
  },
});

const dokumenttiLuotu = computed(() => {
  return props.dokumentti != null && props.dokumenttiHref != null && props.dokumentti.tila === 'valmis';
});

const dokumenttiEpaonnistui = computed(() => {
  return props.dokumentti && props.dokumentti.tila === 'epaonnistui';
});

const dokumenttiLataa = computed(() => {
  return !props.dokumentti || (props.dokumentti.tila === 'valmis' && !props.dokumenttiHref);
});

const isKvLiite = computed(() => {
  return props.dokumentti.generatorVersion === 'kvliite';
});
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

.luontitiedot {
  display: block;
}

.pdf-box {
  margin: 25px 0;
  width: 100%;
  border-radius: 2px;
  padding: 25px;

  &.luotu {
    background-color: $gray-lighten-10;

    .ikoni {
      color: $blue-lighten-6;
    }

    @media(max-width: 575px) {

      .ikoni {
        display: none;
      }
    }

    .teksti {
      font-weight: 600;
    }
  }

  &.ei-luotu {
    border: 1px solid $gray-lighten-9;
    color: $gray-lighten-2;
    font-style: italic;
  }

  &.epaonnistui {
    border-color: $red;
    color: $red;
    font-style: normal;
  }

  .polling {
    opacity: 0.5;
  }
}
</style>
