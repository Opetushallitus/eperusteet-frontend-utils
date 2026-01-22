<template>
  <div>
    <template v-if="isEditing">
      <VueDraggable
        v-bind="defaultDragOptions"
        v-model="innerModel"
        tag="div"
      >
        <div
          v-for="(model, i) in innerModel"
          :key="group+i"
          class="pt-3 pb-2 px-3 mb-2 jarjestaja"
        >
          <div class="flex">
            <div class="order-handle mr-3 pt-1">
              <EpMaterialIcon>drag_indicator</EpMaterialIcon>
            </div>
            <div class="w-full">
              <b-input-group
                :label="$t('organisaation-nimi')"
                class="mb-4"
              >
                <b-form-input
                  :value="$kaanna(model.nimi)"
                  :disabled="true"
                />
                <b-input-group-append>
                  <ep-button
                    variant="primary"
                    @click="open(i)"
                  >
                    {{ $t('hae-organisaatio') }}
                  </ep-button>
                </b-input-group-append>
              </b-input-group>

              <EpFormGroup
                :label="$t('linkki-toteutussuunnitelmaan-tai-koulutuksen-jarjestajan-kotisivuille')"
                class="mb-4"
              >
                <ep-input
                  v-model="model.url"
                  :is-editing="isEditing"
                />
              </EpFormGroup>

              <EpFormGroup
                :label="$t('kaytannon-toteutus')"
                class="mb-0"
              >
                <ep-content
                  v-model="model.kuvaus"
                  layout="normal"
                  :is-editable="isEditing"
                />
              </EpFormGroup>
            </div>
          </div>

          <div class="text-right">
            <ep-button
              variant="link"
              icon="delete"
              @click="poista(i)"
            >
              {{ $t('poista-koulutuksen-jarjestaja') }}
            </ep-button>
          </div>
        </div>
      </VueDraggable>
      <EpButton
        v-if="isEditing"
        variant="outline"
        icon="add"
        @click="lisaa()"
      >
        <slot name="default">
          {{ $t('lisaa-koulutuksen-jarjestaja') }}
        </slot>
      </EpButton>

      <b-modal
        id="koulutuksenjarjestajaModal"
        ref="editModal"
        size="xl"
        :ok-title="$t('peruuta')"
        :ok-only="true"
      >
        <template #modal-header>
          <h2>{{ $t('valitse-koulutuksen-jarjestaja') }}</h2>
        </template>

        <template #default>
          <ep-spinner v-if="!koulutuksenJarjestajat" />
          <template v-else>
            <div class="flex flex-row items-center">
              <div class="grow">
                <ep-search v-model="query" />
              </div>
            </div>
            <div v-if="items">
              <EpTable
                responsive
                borderless
                striped
                fixed
                hover
                :items="items"
                :fields="fields"
                :selectable="true"
                select-mode="single"
                selected-variant=""
                :per-page="10"
                @row-selected="onRowSelected"
              >
                <template #cell(nimi)="{ item }">
                  <span class="text-blue-600 hover:underline cursor-pointer">
                    {{ $kaanna(item.nimi) }}
                  </span>
                </template>
              </EpTable>
            </div>
          </template>
        </template>
      </b-modal>
    </template>
    <template v-else-if="innerModel.length > 0">
      <div
        v-for="(model, i) in innerModel"
        :key="group+i"
        class="pt-3 pb-2 px-3 mb-2 jarjestaja"
      >
        <h3>{{ $kaanna(model.nimi) }}</h3>
        <EpFormGroup
          :label="$t('toteutussuunnitelman-tai-koulutuksen-jarjestajan-verkkosivut')"
          class="mb-4"
        >
          <EpLinkki :url="model.url[kieli]" />
        </EpFormGroup>

        <EpFormGroup
          :label="$t('kaytannon-toteutus')"
          class="mb-0"
        >
          <slot
            name="kuvaus"
            v-bind="{ model }"
          >
            <ep-content
              v-model="model.kuvaus"
              layout="normal"
              :is-editable="isEditing"
            />
          </slot>
        </EpFormGroup>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import _ from 'lodash';
import EpInput from '@shared/components/forms/EpInput.vue';
import { VueDraggable } from 'vue-draggable-plus';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import { Koulutustoimijat, KoulutuksenJarjestajaDto } from '@shared/api/amosaa';
import { Kielet } from '@shared/stores/kieli';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import EpLinkki from '@shared/components/EpLinkki/EpLinkki.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpTable from '@shared/components/EpTable/EpTable.vue';
import EpFormGroup from '@shared/components/forms/EpFormGroup.vue';

// Define props
const props = defineProps({
  modelValue: {
    type: Array as () => KoulutuksenJarjestajaDto[],
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  group: {
    type: String,
    required: false,
    default: 'koulutuksenjarjestajaSort',
  },
});

// Define emits
const emit = defineEmits(['update:modelValue']);

// Reactive state
const query = ref('');
const koulutuksenJarjestajat = ref<any[] | null>(null);
const sivu = ref(1);
const valittuIndex = ref(-1);
const editModal = ref(null);

// Lifecycle hooks
onMounted(async () => {
  koulutuksenJarjestajat.value = (await Koulutustoimijat.getKoulutuksenJarjestajat()).data;
});

// Computed properties
const innerModel = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

const kieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const defaultDragOptions = computed(() => {
  return {
    animation: 300,
    emptyInsertThreshold: 10,
    handle: '.order-handle',
    disabled: !props.isEditing,
    ghostClass: 'dragged',
    group: {
      name: props.group,
    },
  };
});

const koulutuksenjarjestajatSorted = computed(() => {
  return _.chain(koulutuksenJarjestajat.value)
    .filter(kt => _.includes(_.toLower(kt['nimi'][Kielet.getSisaltoKieli.value]), _.toLower(query.value)))
    .sortBy(kt => kt['nimi'][Kielet.getSisaltoKieli.value])
    .value();
});

const items = computed(() => {
  return _.slice(koulutuksenjarjestajatSorted.value, (sivu.value - 1) * 10, ((sivu.value - 1) * 10) + 10);
});

const kokonaismaara = computed(() => {
  return _.size(koulutuksenjarjestajatSorted.value);
});

const fields = computed(() => {
  return [
    {
      key: 'nimi',
      label: 'nimi', // Replace this.$t('nimi')
    },
  ];
});

// Methods
const open = (i: number) => {
  (editModal.value as any)?.show();
  valittuIndex.value = i;
};

const onRowSelected = (row: any) => {
  const newInnerModel = [...innerModel.value];
  newInnerModel.splice(valittuIndex.value, 1, {
    ...innerModel.value[valittuIndex.value],
    nimi: row[0].nimi,
  });
  emit('update:modelValue', newInnerModel);

  (editModal.value as any)?.hide();
};

const lisaa = () => {
  const newInnerModel = [
    ...innerModel.value,
    {},
  ];
  emit('update:modelValue', newInnerModel);
};

const poista = (poistettavaIndex: number) => {
  const newInnerModel = _.filter(innerModel.value, (teksti, index) => index !== poistettavaIndex);
  emit('update:modelValue', newInnerModel);
};
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

  .jarjestaja {
    border: 1px solid $gray-lighten-8;
    border-radius: 3px;
  }
</style>
