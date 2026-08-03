<template>
  <span class="esikatselu-link inline">
    <EpExternalLink
      v-if="model.esikatseltavissa"
      :url="esikatseluUrl"
      :only-top-level="false"
      icon-right
      class="inline"
    >
      <slot name="link-text">
        {{ $t(linkText) }}
      </slot>
    </EpExternalLink>
    <EpPopover
      v-else
      ref="popover"
      :triggers="['click']"
    >
      <template #trigger>
        <a
          href="#"
          @click.prevent
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
      </template>
      <p class="mb-3">
        <slot name="popover-text">
          {{ $t(salliEsikatseluText) }}
        </slot>
      </p>
      <div class="flex justify-end items-center">
        <EpButton
          variant="link"
          class="mr-2"
          @click="hidePopover"
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
    </EpPopover>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
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
import EpPopover from '../EpPopover/EpPopover.vue';

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

const saving = ref(false);
const popoverRef = useTemplateRef('popover');

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

const hidePopover = () => {
  popoverRef.value?.hide();
};

const avaaEsikatselu = () => {
  window.open(esikatseluUrl.value, '_blank', 'noopener,noreferrer');
};

const salliEsikatseluJaAvaa = async () => {
  saving.value = true;
  try {
    await props.salliEsikatselu();
    hidePopover();
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
