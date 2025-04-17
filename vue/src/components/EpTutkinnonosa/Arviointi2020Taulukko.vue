<template>
  <ep-form-content
    v-if="arviointi"
    class="col-md-12 mb-5"
  >
    <slot name="header" />
    <div>{{ $kaanna(arviointi.kohde) }}</div>
    <b-container
      fluid="lg"
      class="osaamistasot mt-3"
    >
      <b-row
        v-for="(osaamistaso, index) in osaamistasonKriteerit"
        :key="'osaamistasokriteeri'+index"
      >
        <b-col
          class="pt-3"
          md="12"
          lg="4"
        >
          <span>{{ $kaanna(osaamistaso.osaamistaso.otsikko) }}</span>
        </b-col>
        <b-col
          class="pt-3"
          md="12"
          lg="8"
        >
          <ul class="pl-3">
            <li
              v-for="(kriteeri, index) in osaamistaso.kriteerit"
              :key="'kriteeri'+index"
            >
              {{ $kaanna(kriteeri) }}
            </li>
          </ul>
        </b-col>
      </b-row>
    </b-container>
  </ep-form-content>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpAlert from '@shared/components/EpAlert/EpAlert.vue';
import * as _ from 'lodash';

const instance = getCurrentInstance();
const $t = instance?.appContext.config.globalProperties.$t;
const $kaanna = instance?.appContext.config.globalProperties.$kaanna;

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
