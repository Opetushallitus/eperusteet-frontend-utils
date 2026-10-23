<template>
  <EpModal
    ref="modalRef"
    size="md"
    position="top"
    style="min-height: 860px; margin-top: 3rem"
    @cancel="reset"
  >
    <template #modal-title>
      <slot name="header">
        <h2>{{ $t('hae-tiedote') }}</h2>
      </slot>
    </template>

    <EpSearch
      v-model="query"
      class="my-2"
    />

    <EpSpinner v-if="isLoading" />
    <template v-else-if="page">
      <EpTable
        v-model:current-page="sivu"
        responsive
        borderless
        striped
        fixed
        hover
        :items="items"
        :fields="fields"
        :per-page="page.sivukoko"
        :total-rows="page.kokonaismäärä"
        select-mode="single"
        selected-variant=""
        @row-selected="selectRow"
      >
        <template #cell(otsikko)="{ item }">
          <span class="link-style clickable hover:underline">
            {{ $kaanna(item.otsikko) }}
          </span>
        </template>
      </EpTable>
    </template>

    <template #modal-footer>
      <EpButton
        variant="link"
        @click="close"
      >
        {{ $t('sulje') }}
      </EpButton>
    </template>
  </EpModal>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import type { TiedoteDto, TiedoteKevytDto } from '@shared/api/eperusteet';
import type { Page } from '@shared/tyypit';
import EpModal from '@shared/components/EpModal/EpModal.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpTable from '@shared/components/EpTable/EpTable.vue';
import { $fail, $kaanna, $sdt, $t } from '@shared/utils/globals';
import { julkaisupaikkaSort } from '@shared/utils/tiedote';
import { debounced } from '@shared/utils/delay';
import _ from 'lodash';

const props = defineProps<{
  hae: (query: string, sivu: number) => Promise<Page<TiedoteDto>>;
  excludedIds: number[];
}>();

const emit = defineEmits<{
  select: [tiedote: TiedoteKevytDto];
}>();

const modalRef = ref<InstanceType<typeof EpModal> | null>(null);
const query = ref('');
const page = ref<Page<TiedoteDto> | null>(null);
const isLoading = ref(false);
const isOpen = ref(false);

const fields = computed(() => {
  return [
    {
      key: 'otsikko',
      label: $t('tiedote'),
      sortable: false,
      thStyle: { width: '35%' },
      formatter: (value: any) => $kaanna(value),
    },
    {
      key: 'luotu',
      label: $t('julkaistu'),
      sortable: false,
      formatter: (value: any) => $sdt(value),
    },
    {
      key: 'julkaisupaikat',
      label: $t('tiedote-julkaistu'),
      sortable: false,
      thStyle: { width: '40%' },
      formatter: (value: any, _key: any, item: TiedoteDto) => {
        return _.join(
          [
            ..._.chain(value)
              .sortBy((julkaisupaikka) => julkaisupaikkaSort[julkaisupaikka])
              .map((julkaisupaikka) =>
                $t('tiedote-julkaisupaikka-' + julkaisupaikka),
              )
              .value(),
            ..._.map(item.koulutustyypit, (kt) => $t(kt)),
          ],
          ', ',
        );
      },
    },
  ];
});

const items = computed(() => {
  const excluded = new Set(props.excludedIds);
  return (page.value?.data ?? []).filter(
    (tiedote) => tiedote.id != null && !excluded.has(tiedote.id),
  );
});

// The API uses zero-based pages; pagination uses one-based pages.
const sivu = computed({
  get: () => (page.value?.sivu ?? 0) + 1,
  set: (value: number) => {
    search.cancel();
    void fetchPage(Math.max(value - 1, 0));
  },
});

const search = debounced(() => void fetchPage(0), 300);

async function fetchPage(sivu: number) {
  isLoading.value = true;
  page.value = null;

  try {
    page.value = await props.hae(query.value, sivu);
  }
  catch {
    $fail($t('tiedotteiden-haku-epaonnistui'));
  }
  finally {
    isLoading.value = false;
  }
}

watch(
  query,
  () => {
    if (!isOpen.value) {
      return;
    }

    search();
  },
  { flush: 'sync' },
);

function openDialog() {
  reset();
  query.value = '';
  isOpen.value = true;
  modalRef.value?.show();
  void fetchPage(0);
}

function reset() {
  isOpen.value = false;
  search.cancel();
  isLoading.value = false;
  page.value = null;
}

function close() {
  reset();
  modalRef.value?.hide();
}

function selectRow(rows: TiedoteDto[]) {
  const tiedote = rows[0];
  if (
    !isOpen.value
    || isLoading.value
    || tiedote?.id == null
    || props.excludedIds.includes(tiedote.id)
  ) {
    return;
  }

  emit('select', { id: tiedote.id, otsikko: tiedote.otsikko });
  close();
}

onBeforeUnmount(reset);
defineExpose({ openDialog, close });
</script>
