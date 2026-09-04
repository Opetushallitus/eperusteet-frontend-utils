<template>
  <slot v-if="validointiOk" />
  <EpDropdown
    v-else
    class="validation-dropdown"
    content-class="validation-dropdown-menu"
  >
    <template #button-content>
      <span class="validation-toggle no-underline p-0">
        <slot />
        <EpMaterialIcon
          class="validation-icon"
          icon-shape="outlined"
          size="22px"
        >
          expand_more
        </EpMaterialIcon>
      </span>
    </template>

    <div class="px-3">
      <template v-if="validoinnit?.virheet">
        <div
          v-for="virhe in uniqueVirheet"
          :key="virhe"
          class="flex gap-2 pt-2 pb-1 items-center"
        >
          <EpMaterialIcon
            class="text-danger shrink-0 "
            size="18px"
          >
            info
          </EpMaterialIcon>
          <span>{{ $t(virhe) }}</span>
        </div>
        <div
          v-if="validoinnit.virheet.length > 5"
          class="flex gap-2 pt-2 pb-1"
        >
          <span class="w-[18px] shrink-0" />
          <EpButton
            variant="link"
            @click="toJulkaisuRoute"
            no-padding
          >
            {{ $t('yhteensa-kpl-virhetta', { kpl: validoinnit.virheet.length }) }}
          </EpButton>
        </div>
      </template>
      <div
        v-if="validoinnit?.huomautukset && validoinnit.huomautukset.length > 0"
        class="flex gap-2 pt-2 pb-1 items-center"
      >
        <EpMaterialIcon
          class="text-warning shrink-0"
          size="18px"
        >
          info
        </EpMaterialIcon>
        <span>{{ $t(huomautuksia) }}</span>
      </div>

      <hr>

      <div class="mr-12 mb-2 text-center">
        <EpButton
          variant="link"
          @click="validoi()"
          no-padding
          icon="refresh"
        >
          {{ $t('tarkista-virheet') }}
        </EpButton>
      </div>
    </div>
  </EpDropdown>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import {
  ValidableObject,
  Validoinnit,
  ValidoitavatTyypit,
} from '@shared/components/EpValidStatus/EpValidStatusTypes';
import EpButton from '../EpButton/EpButton.vue';
import EpDropdown from '../EpDropdown/EpDropdown.vue';

const props = defineProps({
  validoinnit: {
    type: Object as () => Validoinnit,
    required: false,
  },
  validoitava: {
    type: Object as () => ValidableObject,
    required: true,
  },
  julkaistava: {
    type: Boolean,
    required: true,
  },
  tyyppi: {
    type: String as () => ValidoitavatTyypit,
    required: true,
  },
  julkaisuRoute: {
    type: Object,
    required: false,
    default: () => ({ name: 'julkaise' }),
  },
  validoi: {
    type: Function,
    required: false,
    default: () => {},
  },
});

const router = useRouter();

const hasVirheita = computed(() => {
  return (props.validoinnit?.virheet?.length || 0) > 0;
});

const hasHuomioita = computed(() => {
  return (props.validoinnit?.huomautukset?.length || 0) > 0;
});

const huomautuksia = computed(() => {
  if (props.tyyppi === ValidoitavatTyypit.PERUSTE) {
    return 'perusteessa-huomautuksia';
  }

  if (props.tyyppi === ValidoitavatTyypit.TOTEUTUSSUUNNITELMA) {
    return 'toteutussuunnitelmassa-huomautuksia';
  }

  if (props.tyyppi === ValidoitavatTyypit.OPETUSSUUNNITELMA) {
    return 'opetussuunnitelmassa-huomautuksia';
  }
  return '';
});

const uniqueVirheet = computed(() => {
  return _.slice(_.uniq(props.validoinnit?.virheet), 0, 5);
});

const iconClass = computed(() => {
  if (hasVirheita.value) {
    return 'text-danger';
  }

  if (hasHuomioita.value) {
    return 'text-warning';
  }

  return '';
});

const validointiOk = computed(() => {
  return _.size(props.validoinnit?.virheet) === 0 && _.size(props.validoinnit?.huomautukset) === 0;
});

function toJulkaisuRoute() {
  router.push(props.julkaisuRoute);
}
</script>

<style scoped lang="scss">
.validation-dropdown {
  margin-top: 0.25rem;
}

:deep(.validation-toggle) {
  color: inherit;

  &:hover,
  &:focus,
  &:active {
    color: inherit;
    box-shadow: none;
  }
}

.validation-trigger {
  text-decoration: underline;
}

.validation-icon {
  margin-left: 0.25rem;
  text-decoration: none;
}

:deep(.validation-dropdown-menu) {
  min-width: 20rem;
}
</style>
