<template>
  <EpInfoPopover class="validation-popover">
    <template #trigger>
      <router-link
        :to="julkaisuRoute"
        class="validation-link"
      >
        {{ $t(summaryTextKey) }}
      </router-link>
      <EpMaterialIcon
        class="validation-icon"
        :class="iconClass"
        icon-shape="outlined"
      >
        info
      </EpMaterialIcon>
    </template>

    <div class="ml-3">
      <!-- <template v-if="validoinnit?.ok && !validointiOk">
        <div
          v-for="ok in validoinnit.ok"
          :key="ok"
          class="pt-2 pb-1 row"
        >
          <div class="col-1">
            <EpMaterialIcon
              class="text-success"
              size="18px"
            >
              info
            </EpMaterialIcon>
          </div>
          <div class="col">
            <span>{{ $t(ok) }}</span>
          </div>
        </div>
      </template> -->
      <template v-if="validoinnit?.virheet">
        <div
          v-for="virhe in uniqueVirheet"
          :key="virhe"
          class="pt-2 pb-1 row"
        >
          <div class="col-1">
            <EpMaterialIcon
              class="text-danger"
              size="18px"
            >
              info
            </EpMaterialIcon>
          </div>
          <div class="col">
            <span>{{ $t(virhe) }}</span>
          </div>
        </div>
        <div
          v-if="validoinnit.virheet.length > 5"
          class="pt-2 pb-1 row"
        >
          <div class="col-1" />
          <div class="col">
            <EpButton
              class="p-0"
              variant="link"
              @click="toJulkaisuRoute"
              no-padding
            >
              {{ $t('yhteensa-kpl-virhetta', { kpl: validoinnit.virheet.length }) }}
            </EpButton>
          </div>
        </div>
      </template>
      <div
        v-if="validoinnit?.huomautukset && validoinnit.huomautukset.length > 0"
        class="pt-2 pb-1 row"
      >
        <div class="col-1">
          <EpMaterialIcon
            class="text-warning"
            size="18px"
          >
            info
          </EpMaterialIcon>
        </div>
        <div class="col">
          <span>{{ $t(huomautuksia) }}</span>
        </div>
      </div>

    </div>

    <hr/>

    <div class="text-center mb-2 mr-5">
      <EpButton
        variant="link"
        @click="validoi()"
        no-padding
        icon="refresh"
      >
        {{ $t('tarkista-virheet') }}
      </EpButton>
    </div>
  </EpInfoPopover>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import EpInfoPopover from '@shared/components/EpInfoPopover/EpInfoPopover.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import {
  ValidableObject,
  Validoinnit,
  ValidoitavatTyypit,
} from '@shared/components/EpValidStatus/EpValidStatusTypes';
import EpButton from '../EpButton/EpButton.vue';

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

const summaryTextKey = computed(() => {
  const isPeruste = props.tyyppi === ValidoitavatTyypit.PERUSTE;

  if (hasVirheita.value) {
    return isPeruste ? 'perusteessa-virheita' : 'suunnitelmassa-virheita';
  }

  if (hasHuomioita.value) {
    return isPeruste ? 'perusteessa-huomioita' : 'suunnitelmassa-huomioita';
  }

  return '';
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

function toJulkaisuRoute() {
  router.push(props.julkaisuRoute);
}
</script>

<style scoped lang="scss">
.validation-popover {
  margin-top: 0.25rem;
}

.validation-link {
  color: inherit;
  text-decoration: underline;

  &:hover {
    color: inherit;
  }
}

.validation-icon {
  margin-left: 0.25rem;
}
</style>
