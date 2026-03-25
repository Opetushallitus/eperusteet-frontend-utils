<template>
  <div v-if="isEditing">
    <slot
      v-if="editable"
      name="default"
      :open="openDialog"
    >
      <ep-input-group>
        <ep-input
          :model-value="modelValue ? ($kaanna(modelValue.nimi) + ' (' + modelValue.arvo + ')') : ''"
          :is-editing="true"
          disabled
        />
        <template #append>
          <ep-button
            variant="primary"
            @click="openDialog"
          >
            {{ $t('hae-koodistosta') }}
          </ep-button>
        </template>
      </ep-input-group>
    </slot>
    <EpModal
      ref="editModal"
      size="md"
      @cancel="alusta"
    >
      <template #modal-title>
        <slot name="header">
          <h2>{{ $t('hae-koodistosta') }} ({{ usedKoodisto }})</h2>
        </slot>
      </template>

      <template #modal-footer>
        <ep-button
          v-if="multiselect"
          variant="primary"
          :disabled="innerModel.length === 0"
          @click="lisaaValitut"
        >
          {{ $t('lisaa-valitut') }}
        </ep-button>
        <ep-button
          variant="secondary"
          @click="editModal?.hide()"
        >
          {{ multiselect ? $t('peruuta') : $t('sulje') }}
        </ep-button>
      </template>

      <template #default>
        <div class="flex flex-row items-center">
          <div class="grow">
            <ep-search v-model="query" />
            <ep-toggle
              v-model="vanhentuneet"
              class="pt-3 pl-1"
              :is-s-witch="false"
            >
              {{ $t('nayta-myos-vanhentuneet') }}
            </ep-toggle>
          </div>
          <div>
            <ep-spinner v-if="isLoading" />
          </div>
        </div>
        <div v-if="items">
          <EpTable
            ref="koodistoTable"
            responsive
            borderless
            striped
            fixed
            hover
            :items="items"
            :fields="fields"
            select-mode="single"
            selected-variant=""
            @row-selected="onRowSelected"
          >
            <template #cell(nimi)="{ item }">
              <span v-if="multiple">
                <EpMaterialIcon
                  v-if="item.selected"
                  class="checked mr-2"
                  size="20px"
                >check_box</EpMaterialIcon>
                <EpMaterialIcon
                  v-else
                  class="checked mr-2"
                  size="20px"
                >check_box_outline_blank</EpMaterialIcon>
              </span>
              <span class="text-blue-600 hover:underline cursor-pointer">
                {{ $kaanna(item.nimi) }}
              </span>
            </template>

            <template #cell(arvo)="{ item }">
              <span class="font-bold">
                {{ item.koodiArvo }}
              </span>
            </template>

            <template #cell(versio)="{ item }">
              {{ item.versio }}
            </template>

            <template #cell(voimaantulo)="{ item }">
              {{ $sd(item.voimassaAlkuPvm) }}
            </template>

            <template #cell(paattyminen)="{ item }">
              <span v-if="item.voimassaLoppuPvm">{{ $ago(item.voimassaLoppuPvm) }}</span>
            </template>
          </EpTable>

          <EpBPagination
            v-if="raw"
            v-model="sivu"
            :total="raw.kokonaismäärä"
            :items-per-page="raw.sivukoko"
            aria-controls="koodistot"
          />

          <div v-if="multiselect && innerModel.length > 0">
            <h4>{{ $t('valittu') }} {{ innerModel.length }} {{ $t('kpl') }}</h4>
            <div
              v-for="(koodi, index) in innerModel"
              :key="'valitut'+index"
            >
              {{ $kaanna(koodi.nimi) }}
            </div>
          </div>
        </div>
        <ep-spinner v-else />
      </template>
    </EpModal>
  </div>
  <div v-else-if="modelValue && modelValue.arvo">
    {{ $kaanna(modelValue.nimi) }} <span v-if="naytaArvo">{{ modelValue.arvo }}</span>
  </div>
  <div
    v-else
    class="font-italic"
  >
    <slot name="empty">
      {{ $t('ei-asetettu') }}
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, useTemplateRef } from 'vue';
import EpButton from '../EpButton/EpButton.vue';
import EpModal from '../EpModal/EpModal.vue';
import EpToggle from '../forms/EpToggle.vue';
import EpSearch from '../forms/EpSearch.vue';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import { getKoodistoSivutettuna, KoodistoSelectStore } from './KoodistoSelectStore';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import _ from 'lodash';
import EpBPagination from '../EpBPagination/EpBPagination.vue';
import EpTable from '@shared/components/EpTable/EpTable.vue';
import { unref } from 'vue';
import { $t } from '@shared/utils/globals';
import { debounced } from '@shared/utils/delay';
import { onMounted } from 'vue';
import EpInputGroup from '@shared/components/EpInputGroup/EpInputGroup.vue';
import EpInput from '@shared/components/forms/EpInput.vue';

const props = defineProps({
  modelValue: {
    type: [Object, Array],
    default: null,
  },
  koodisto: {
    type: String,
    required: false,
  },
  store: {
    type: Object as () => KoodistoSelectStore,
    required: false,
  },
  isEditing: {
    type: Boolean,
    default: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  naytaArvo: {
    type: Boolean,
    default: true,
  },
  defaultFields: {
    type: Array as () => string[],
    default: () => ['nimi', 'arvo', 'voimaantulo'],
  },
  additionalFields: {
    type: Array,
    required: false,
  },
  editable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue', 'add']);

const isLoading = ref(false);
const query = ref('');
const vanhentuneet = ref(false);
const innerModel = ref<any[]>([]);
const editModal = useTemplateRef('editModal');
const koodistoStore = ref<KoodistoSelectStore | null>(null);

onMounted(() => {
  initStore();
});

const initStore = async () => {
  if (props.store) {
    koodistoStore.value = props.store;
  }

  if (props.koodisto) {
    koodistoStore.value = new KoodistoSelectStore({
      koodisto: props.koodisto,
      async query(query: string, sivu = 0, koodisto: string) {
        return await getKoodistoSivutettuna(koodisto, query, sivu) as any;
      },
    });
  }

  if (koodistoStore.value) {
    koodistoStore.value.clear();
  }
};

const selectedUris = computed(() => {
  return _.map(innerModel.value, 'uri');
});

const raw = computed(() => {
  if (!koodistoStore.value) {
    return null;
  }
  return unref(koodistoStore.value.data);
});

const items = computed(() => {
  if (!raw.value) {
    return null;
  }

  return _(raw.value?.data)
    .map(x => {
      const nimi = _.mapValues(_.keyBy(x.metadata, v => _.toLower(v.kieli)), v => v.nimi);
      const kuvaus = _.mapValues(_.keyBy(x.metadata, v => _.toLower(v.kieli)), v => v.kuvaus);
      return {
        ...x,
        nimi,
        kuvaus,
        selected: _.includes(selectedUris.value, x.koodiUri),
      };
    })
    .value();
});

const sivu = computed({
  get: () => {
    if (!raw.value) {
      return 1;
    }
    return raw.value.sivu + 1;
  },
  set: (value: number) => {
    koodistoStore.value?.query(query.value, _.max([value - 1, 0]));
  },
});

const multiselect = computed(() => {
  return _.isArray(props.modelValue) || props.multiple;
});

const usedKoodisto = computed(() => {
  return unref(koodistoStore.value?.koodisto);
});

const fields = computed(() => {
  return [
    ..._.filter([{
      key: 'nimi',
      label: $t('nimi'),
    }, {
      key: 'arvo',
      label: $t('arvo'),
      thStyle: { width: '6rem' },
    }, {
      key: 'voimaantulo',
      label: $t('voimaantulo'),
      thStyle: { width: '10rem' },
    }], field => _.includes(props.defaultFields, field.key)),
    ...(props.additionalFields ? props.additionalFields : []),
  ];
});

const initStoreQuery = debounced(async (queryVal: string, sivuVal: number, vanhentuneetVal: boolean) => {
  isLoading.value = true;
  await koodistoStore.value?.query(queryVal, _.max([sivuVal, 0]), !vanhentuneetVal);
  isLoading.value = false;
});

watch(() => query.value, async (newValue) => {
  if (newValue.length > 2 || newValue.length === 0) {
    await initStoreQuery(newValue, sivu.value - 1, vanhentuneet.value);
  }
});

watch(() => vanhentuneet.value, async (newValue) => {
  await initStoreQuery(query.value, sivu.value - 1, newValue);
});

const openDialog = async () => {
  await initStore();
  query.value = '';
  await initStoreQuery(query.value, sivu.value - 1, vanhentuneet.value);
  editModal.value?.show?.();
};

const onRowSelected = (items: any[]) => {
  if (!_.isEmpty(items)) {
    const row = {
      uri: items[0].koodiUri,
      arvo: items[0].koodiArvo,
      nimi: items[0].nimi,
      versio: items[0].versio,
      koodisto: items[0].koodisto?.koodistoUri || items[0].koodisto,
      ..._.pick(items[0], _.map(props.additionalFields || [], 'key')),
    };

    if (!multiselect.value) {
      emit('update:modelValue', row);
      emit('add', row, props.modelValue);
      editModal.value?.hide();
    }
    else {
      if (_.includes(selectedUris.value, row.uri)) {
        innerModel.value = _.filter(innerModel.value, koodi => koodi.uri !== row.uri);
      }
      else {
        innerModel.value = [
          ...innerModel.value,
          row,
        ];
      }
    }
  }
};

const lisaaValitut = () => {
  if (multiselect.value) {
    emit('update:modelValue', innerModel.value);
    emit('add', innerModel.value);
    editModal.value?.hide();
  }
};

const alusta = () => {
  innerModel.value = [];
};

defineExpose({
  openDialog,
});
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

  .checked {
    color: $paletti-blue;
  }
</style>
