<template>
  <div v-b-modal.epversiomodaali>
    <slot>{{ $t('muokkaushistoria') }}</slot>
    <b-modal
      id="epversiomodaali"
      ref="epversiomodaali"
      size="lg"
      :title="$t('historia')"
      :hide-footer="true"
    >
      <b-table
        responsive
        striped
        :items="versionsFormatted"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
      >
        <template #cell(actions)="row">
          <div class="float-right">
            <div v-if="!row.item.valittu">
              <ep-button
                variant="link"
                icon="visibility"
                @click="changeVersion(row.item.index)"
              >
                {{ $t('katsele') }}
              </ep-button>
              <ep-button
                variant="link"
                icon="keyboard_return"
                @click="$emit('restore', { numero: row.item.numero, modal: epversiomodaali })"
              >
                {{ $t('palauta') }}
              </ep-button>
            </div>
            <ep-button
              v-else
              variant="link"
              disabled
            >
              {{ $t('valittu-versio') }}
            </ep-button>
          </div>
        </template>
      </b-table>
      <ep-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        align="center"
        aria-controls="epversiomodaali"
      />
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { Revision } from '../../tyypit';
import EpButton from '../../components/EpButton/EpButton.vue';
import EpFormContent from '../../components/forms/EpFormContent.vue';
import { parsiEsitysnimi } from '@shared/utils/kayttaja';
import EpPagination from '@shared/components/EpPagination/EpPagination.vue';

const props = defineProps({
  versions: {
    type: Array as () => Revision[],
    required: true,
  },
  current: {
    type: Object,
    required: true,
  },
  perPage: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(['restore']);

const currentPage = ref(1);
const epversiomodaali = useTemplateRef('epversiomodaali');
const router = useRouter();

const fields = computed(() => {
  return [{
    key: 'index',
    label: 'versio',
  }, {
    key: 'ajankohta',
    label: 'ajankohta',
  }, {
    key: 'muokkaaja',
    label: 'muokkaaja',
  }, {
    key: 'actions',
    label: '',
  }];
});

const currentIndex = computed(() => {
  return _.findIndex(props.versions, props.current);
});

const versionsFormatted = computed(() => {
  const versions = _.map(props.versions, (rev) => ({
    ...rev,
    muokkaaja: parsiEsitysnimi(rev.kayttajanTieto) || parsiEsitysnimi(rev),
    ajankohta: rev.pvm ? rev.pvm : '-', // Note: $sdt formatter needs to be handled differently
    kommentti: rev.kommentti || '-',
    valittu: false,
  }));

  if (versions.length > 0) {
    versions[currentIndex.value].valittu = true;
  }

  return versions;
});

const rows = computed(() => {
  return versionsFormatted.value.length;
});

const changeVersion = (versionumero) => {
  router.push({ query: { versionumero } }).catch(() => {});
};
</script>

<style scoped lang="scss">
</style>
