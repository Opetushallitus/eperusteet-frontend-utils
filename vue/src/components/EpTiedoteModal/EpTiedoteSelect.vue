<template>
  <EpModal
    ref="modalRef"
    size="md"
    position="top"
    style="min-height: 860px; margin-top: 3rem;"
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
        responsive
        borderless
        striped
        fixed
        hover
        :items="items"
        :fields="fields"
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

      <EpBPagination
        v-model="sivu"
        :total="page.kokonaismäärä"
        :items-per-page="page.sivukoko"
      />
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
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import { $t, $kaanna, $fail } from '@shared/utils/globals';

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
let requestVersion = 0;
let searchTimer: ReturnType<typeof setTimeout> | undefined;

const fields = computed(() => [
  { key: 'otsikko', label: $t('tiedotteen-otsikko') },
]);

const items = computed(() => {
  const excluded = new Set(props.excludedIds);
  return (page.value?.data ?? []).filter(tiedote =>
    tiedote.id != null && !excluded.has(tiedote.id));
});

// The API uses zero-based pages; EpBPagination uses one-based pages.
const sivu = computed({
  get: () => (page.value?.sivu ?? 0) + 1,
  set: (value: number) => {
    cancelSearch();
    void fetchPage(Math.max(value - 1, 0));
  },
});

function cancelSearch() {
  clearTimeout(searchTimer);
  searchTimer = undefined;
}

async function fetchPage(sivu: number) {
  const version = ++requestVersion;
  isLoading.value = true;
  page.value = null;

  try {
    const result = await props.hae(query.value, sivu);
    if (version === requestVersion && isOpen.value) {
      page.value = result;
    }
  }
  catch {
    if (version === requestVersion && isOpen.value) {
      $fail($t('tiedotteiden-haku-epaonnistui'));
    }
  }
  finally {
    if (version === requestVersion) {
      isLoading.value = false;
    }
  }
}

watch(query, () => {
  if (!isOpen.value) {
    return;
  }

  cancelSearch();
  // Ignore responses and hide rows from the previous search immediately.
  requestVersion++;
  page.value = null;
  isLoading.value = true;
  searchTimer = setTimeout(() => void fetchPage(0), 300);
}, { flush: 'sync' });

function openDialog() {
  reset();
  query.value = '';
  isOpen.value = true;
  modalRef.value?.show();
  void fetchPage(0);
}

function reset() {
  isOpen.value = false;
  cancelSearch();
  requestVersion++;
  isLoading.value = false;
  page.value = null;
}

function close() {
  reset();
  modalRef.value?.hide();
}

function selectRow(rows: TiedoteDto[]) {
  const tiedote = rows[0];
  if (!isOpen.value || isLoading.value || tiedote?.id == null
    || props.excludedIds.includes(tiedote.id)) {
    return;
  }

  emit('select', { id: tiedote.id, otsikko: tiedote.otsikko });
  close();
}

onBeforeUnmount(reset);
defineExpose({ openDialog, close });
</script>
