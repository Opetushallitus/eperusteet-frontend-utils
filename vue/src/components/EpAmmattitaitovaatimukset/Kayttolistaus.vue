<template>
  <div>
    <b-button
      :id="id"
      variant="link"
    >
      <EpMaterialIcon
        icon-shape="outlined"
        size="20px"
      >
        info
      </EpMaterialIcon>
    </b-button>
    <b-popover
      ref="kaytossa"
      :target="id"
      :triggers="triggers"
      :title="$t('kaytossa-toisaalla')"
      @shown="shown"
    >
      <ep-spinner v-if="isLoading" />
      <div
        v-else-if="data && data.data.length > 0"
        class="listaus"
      >
        <div class="info">
          {{ $t('loytyi-tutkinnon-osaa', { amount: data.kokonaismäärä }) }}
        </div>
        <div
          v-for="(item, idx) in data.data"
          :key="idx"
          class="kaytetty"
        >
          <div>
            {{ $kaanna(item.peruste.nimi) }}:
          </div>
          <div>
            {{ $kaanna(item.tutkinnonOsa.nimi) }}
          </div>
        </div>
        <EpPagination
          :value="page"
          :per-page="perPage"
          :total-rows="data.kokonaismäärä"
          @update:model-value="fetch"
        />
      </div>
      <div
        v-else
        class="ei-hakutuloksia"
      >
        {{ $t('ei-hakutuloksia') }}
      </div>
    </b-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance } from 'vue';
import _ from 'lodash';
import EpPagination from '../EpPagination/EpPagination.vue';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { Ammattitaitovaatimukset } from '../../api/eperusteet';
import { $kaanna, $t } from '@shared/utils/globals';
import { nextTick } from 'vue';
import { useTemplateRef } from 'vue';

const props = defineProps({
  koodi: {
    type: Object,
    required: true,
  },
});

const isLoading = ref(true);
const data = ref(null);
const page = ref(1);
const perPage = ref(8);
const kaytossaRef = useTemplateRef('kaytossa');

const id = computed(() => _.uniqueId('koodidialogi_'));

const fetch = async (pageNumber = page.value) => {
  const res = await Ammattitaitovaatimukset.getTutkinnonOsatByAmmattitaitovaatimus(
    pageNumber - 1,
    perPage.value,
    props.koodi.uri,
    true,
  );
  page.value = pageNumber;
  data.value = res.data;
};

const shown = async () => {
  isLoading.value = true;
  data.value = null;
  try {
    if (props.koodi?.uri) {
      await fetch();
    }
  }
  finally {
    isLoading.value = false;
    (kaytossaRef.value as any).$forceUpdate();
  }
};

const triggers = computed(() => 'hover click blur');
</script>

<style scoped lang="scss">
.listaus {
  margin-top: 6px;

  .info {
    margin-bottom: 10px;
  }
}

.kaytetty {
  padding: 10px 6px 10px 2px;

  &:nth-child(odd) {
    background: #f5f5f5;
  }
}
</style>
