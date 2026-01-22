<template>
  <ep-form-content
    v-if="arviointi"
    class="col-md-12 mb-5"
  >
    <slot name="header" />
    <div>{{ $kaanna(arviointi.kohde) }}</div>
    <div
      class="w-full max-w-screen-lg osaamistasot mt-3"
    >
      <div
        v-for="(osaamistaso, index) in osaamistasonKriteerit"
        :key="'osaamistasokriteeri'+index"
        class="flex flex-wrap"
      >
        <div
          class="pt-3 w-full md:w-full lg:w-1/3"
        >
          <span>{{ $kaanna(osaamistaso.osaamistaso.otsikko) }}</span>
        </div>
        <div
          class="pt-3 w-full md:w-full lg:w-2/3"
        >
          <ul class="pl-3">
            <li
              v-for="(kriteeri, index) in osaamistaso.kriteerit"
              :key="'kriteeri'+index"
            >
              {{ $kaanna(kriteeri) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </ep-form-content>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpAlert from '@shared/components/EpAlert/EpAlert.vue';
import * as _ from 'lodash';
import { $t, $kaanna } from '@shared/utils/globals';

const props = defineProps({
  arviointi: {
    type: Object,
    required: true,
  },
});

const osaamistasonKriteerit = computed(() => {
  return _.sortBy(props.arviointi.osaamistasonKriteerit, otk => _.get(otk, 'osaamistaso.koodi.arvo'));
});

const osaamistasonKriteeritFields = computed(() => {
  return [{
    key: 'osaamistaso',
    label: $t('osaamistaso'),
    thStyle: { display: 'none' },
  }, {
    key: 'kriteerit',
    label: $t('kriteerit'),
    thStyle: { display: 'none' },
  }];
});
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

  .osaamistasot {
    .row:nth-of-type(even) {
      background-color: $table-even-row-bg-color;
    }
    .row:nth-of-type(odd) {
      background-color: $table-odd-row-bg-color;
    }
  }

</style>
