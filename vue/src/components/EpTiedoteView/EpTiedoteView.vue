<template>
  <ep-main-view
    :container="true"
    class="mt-5"
  >
    <template #header>
      <div class="d-flex justify-content-between align-items-center flex-wrap">
        <h1>{{ $t('tiedotteet') }}</h1>
        <ep-button
          variant="link"
          icon="add"
        >
          <a
            v-oikeustarkastelu="{ oikeus: 'hallinta', kohde: 'pohja' }"
            :href="url"
          >
            <span class="ml-1 link-text">{{ $t('lisaa-tiedote') }}</span>
          </a>
        </ep-button>
      </div>
    </template>

    <div class="row align-items-end mb-4">
      <div class="col-4">
        <slot name="search" />
      </div>
    </div>

    <ep-spinner v-if="!tiedotteet" />
    <template v-else>
      <ep-content-read-more
        v-for="tiedote in tiedotteet"
        :key="tiedote.id"
        :content="tiedote.sisalto"
      >
        <template #preHeading>
          <p>{{ $sdt(tiedote.luotu) }}</p>
        </template>
        <template #heading>
          <h2 class="font-weight-normal">
            {{ $kaanna(tiedote.otsikko) }}
          </h2>
        </template>
      </ep-content-read-more>
      <slot name="pagination" />
    </template>
  </ep-main-view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import EpMainView from '../EpMainView/EpMainView.vue';
import EpContentReadMore from '../EpContentReadMore/EpContentReadMore.vue';
import EpLinkki from '../EpLinkki/EpLinkki.vue';
import { Kielet } from '../../stores/kieli';
import { TiedoteDto } from '../../tyypit';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';

const props = withDefaults(
  defineProps<{
    tiedotteet: TiedoteDto[] | null;
  }>(), {
    tiedotteet: null,
  });

const sisaltoKieli = computed(() => {
  return Kielet.getSisaltoKieli.value || null;
});

const url = computed(() => {
  return `/eperusteet-service/ui/#/${sisaltoKieli.value}/tiedotteet`;
});
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

:deep(.linkki a) {
  display: flex;
}

:deep(.fa-plussa) {
  height: 24px;
  width: 24px;
  border-radius: 100%;
  margin: 0;
  padding: .2rem;
  color: #fff;
  background-color: #3367E3;
}

.link-text {
  font-size: 1rem;
  color: $black;
}
</style>
