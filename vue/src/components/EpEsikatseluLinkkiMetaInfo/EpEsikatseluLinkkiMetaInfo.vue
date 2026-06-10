<template>
  <span class="ml-2 mr-2">|</span>
  <span
    :id="linkId"
    class="esikatselu-link d-inline"
  >
    <EpExternalLink
      v-if="model.esikatseltavissa"
      :url="esikatseluUrl"
      :only-top-level="false"
      icon-right
      class="d-inline"
    >
      <slot name="link-text">
        {{ $t(linkText) }}
      </slot>
    </EpExternalLink>
    <a
      v-else
      href="#"
      @click.prevent="popoverVisible = !popoverVisible"
    >
      <slot name="link-text">
        {{ $t(linkText) }}
      </slot>
      <EpMaterialIcon
        class="ml-1"
        size="18px"
        :alt="$t('avautuu-uuteen-valilehteen')"
      >
        launch
      </EpMaterialIcon>
    </a>
    <b-popover
      v-if="!model.esikatseltavissa"
      ref="popover"
      v-model:show="popoverVisible"
      :target="linkId"
      placement="bottom"
    >
      <p class="mb-3">
        <slot name="popover-text">
          {{ $t(salliEsikatseluText) }}
        </slot>
      </p>
      <div class="d-flex justify-content-end">
        <EpButton
          variant="link"
          class="mr-2"
          @click="popoverVisible = false"
        >
          {{ $t('peruuta') }}
        </EpButton>
        <EpButton
          :show-spinner="saving"
          @click="salliEsikatseluJaAvaa"
        >
          {{ $t('kylla') }}
        </EpButton>
      </div>
    </b-popover>
  </span>
  <span class="ml-2 mr-2">|</span>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import { PerusteDto } from '@shared/api/eperusteet';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { Kielet } from '@shared/stores/kieli';
import { $fail, $t } from '@shared/utils/globals';
import {
  buildEsikatseluUrl,
  buildPerusteEsikatseluUrl,
  buildToteutussuunnitelmaEsikatseluUrl,
} from '@shared/utils/esikatselu';
import { koulutustyyppiTheme } from '@shared/utils/perusteet';
import EpButton from '@shared/components/EpButton/EpButton.vue';

export type EsikatseluLinkkiTyyppi = 'peruste' | 'opetussuunnitelma' | 'toteutussuunnitelma' | 'opas';

export interface EsikatseluLinkkiModel {
  id: number;
  esikatseltavissa?: boolean;
  koulutustyyppi?: string;
  peruste?: PerusteDto;
}

const props = defineProps<{
  tyyppi: EsikatseluLinkkiTyyppi;
  model: EsikatseluLinkkiModel;
  salliEsikatselu: () => Promise<void>;
  toteutus?: string;
}>();

const popoverVisible = ref(false);
const saving = ref(false);
const popoverRef = useTemplateRef('popover');

watch(saving, async () => {
  await nextTick();
  (popoverRef.value as any)?.$forceUpdate();
});

const linkId = computed(() => `esikatselu-link-${props.tyyppi}-${props.model.id}`);

const linkText = computed(() => `esikatsele-${props.tyyppi}`);

const salliEsikatseluText = computed(() => `salli-esikatselu-${props.tyyppi}`);

const esikatseluUrl = computed(() => {
  if (props.tyyppi === 'peruste' && props.model.peruste) {
    return buildPerusteEsikatseluUrl(props.model.peruste);
  }

  if (props.tyyppi === 'opetussuunnitelma') {
    return buildEsikatseluUrl(
      Kielet.getSisaltoKieli.value,
      `/opetussuunnitelma/${props.model.id}`,
      `/${koulutustyyppiTheme(props.model.koulutustyyppi!)}/tiedot`,
    );
  }

  if (props.tyyppi === 'toteutussuunnitelma') {
    return buildToteutussuunnitelmaEsikatseluUrl(props.model, props.toteutus);
  }

  if (props.tyyppi === 'opas') {
    return buildEsikatseluUrl(Kielet.getSisaltoKieli.value, `/opas/${props.model.id}`);
  }

  return '';
});

const avaaEsikatselu = () => {
  window.open(esikatseluUrl.value, '_blank', 'noopener,noreferrer');
};

const salliEsikatseluJaAvaa = async () => {
  saving.value = true;
  try {
    await props.salliEsikatselu();
    popoverVisible.value = false;
    avaaEsikatselu();
  }
  catch {
    $fail($t('tallennus-epaonnistui'));
  }
  finally {
    saving.value = false;
  }
};
</script>

<style scoped lang="scss">
.esikatselu-link {
  :deep(a) {
    color: inherit;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
