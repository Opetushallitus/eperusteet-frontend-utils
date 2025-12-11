<template>
  <div>
    <ep-koodisto-select
      v-if="props.modelValue"
      ref="koodistoSelect"
      v-model="koodiValue"
      :store="props.koodisto"
      @add="koodistoAdd"
    >
      <template #default="{ open }">
        <div class="d-flex flex-column">
          <div>
            <b-input-group>
              <div class="handle text-muted">
                <EpMaterialIcon>drag_indicator</EpMaterialIcon>
              </div>
              <b-form-input
                v-if="!props.modelValue.koodi"
                ref="input"
                class="vaatimus"
                :class="{ 'placeholder': placeholder }"
                :value="vaatimus"
                :placeholder="placeholder"
                :state="isValid"
                @input="onInput"
                @focus="focused = true"
                @blur="onBlur"
              />
              <b-form-input
                v-if="props.modelValue.koodi"
                class="vaatimus"
                :value="koodiDisplayValue"
                disabled
              />
              <b-input-group-append>
                <b-button
                  variant="primary"
                  @click="open"
                >
                  {{ $t('hae-koodistosta') }}
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
          <div
            v-if="isDatalistVisible"
            class="datalist-wrapper"
          >
            <div
              ref="datalistContainer"
              class="datalist-container"
            >
              <div
                v-if="isLoading"
                class="m-2"
              >
                <ep-spinner />
              </div>
              <div
                v-else
                class="datalist"
              >
                <b-table
                  :items="koodit"
                  :fields="fields"
                >
                  <template #cell(nimi)="{ item }">
                    <div class="d-flex align-items-center">
                      <div
                        class="link-style"
                        role="button"
                        @click="valitse(item)"
                        v-html="highlight(item.nimi[$slang], vaatimus)"
                      />
                      <Kayttolistaus
                        v-if="haeKayttoLista"
                        :koodi="item"
                      />
                    </div>
                  </template>
                </b-table>
              </div>
            </div>
          </div>
        </div>
      </template>
    </ep-koodisto-select>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, getCurrentInstance } from 'vue';
import EpButton from '../EpButton/EpButton.vue';
import EpInput from '../forms/EpInput.vue';
import EpErrorWrapper from '../forms/EpErrorWrapper.vue';
import EpExternalLink from '../EpExternalLink/EpExternalLink.vue';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpKoodistoSelect from '../EpKoodistoSelect/EpKoodistoSelect.vue';
import { KoodistoSelectStore } from '@shared/components/EpKoodistoSelect/KoodistoSelectStore';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { metadataToLocalized } from '../../utils/perusteet';
import { debounced, delay } from '../../utils/delay';
import _ from 'lodash';
import Kayttolistaus from './Kayttolistaus.vue';
import { $kaanna, $kaannaPlaceholder, $t, $slang, $sd } from '@shared/utils/globals';
import { useRoute } from 'vue-router';
import { highlight } from '@shared/utils/kieli';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  koodisto: {
    type: Object as () => KoodistoSelectStore,
    required: true,
  },
  validation: {
    type: Object,
    default: null,
  },
  nimiKey: {
    type: String,
    default: 'vaatimus',
  },
});

const emit = defineEmits(['update:modelValue', 'add']);

const input = ref(null);
const datalistContainer = ref(null);
const datalist = ref(null);

const focused = ref(false);
const hasChanged = ref(false);
const isLoading = ref(false);
const datalistId = _.uniqueId('datalist_');
const route = useRoute();

const koodistoSelect = ref<InstanceType<typeof EpKoodistoSelect> | null>(null);
const vaatimus = computed(() => {
  return props.modelValue?.[props.nimiKey] ? _.unescape($kaanna(props.modelValue[props.nimiKey])) : '';
});

const koodiValue = computed({
  get: () => props.modelValue?.koodi,
  set: (value) => emit('update:modelValue', { ...props.modelValue, koodi: value }),
});

const koodiDisplayValue = computed(() => {
  return $kaanna(props.modelValue?.koodi?.nimi) + (koodiArvo.value ? ' (' + koodiArvo.value + ')' : '');
});

const isDatalistVisible = computed(() => {
  return focused.value
    && hasChanged.value
    && (isLoading.value || koodit.value.length > 0);
});

const koodit = computed(() => {
  const res = _.map(props.koodisto?.data.value?.data || [], koodi => {
    const localized = metadataToLocalized(koodi.metadata!, 'nimi');
    const nimi = localized[$slang.value] || '';
    const idx = nimi.indexOf(vaatimus.value);
    return {
      ...koodi,
      nimi: localized,
      uri: koodi.koodiUri,
    };
  });
  return res;
});

const koodiArvo = computed(() => {
  return _.size(props.modelValue.koodi.uri?.split('_')) === 2 ? props.modelValue.koodi.uri?.split('_')[1] : props.modelValue.koodi.arvo;
});

const placeholder = computed(() => {
  if (!focused.value && props.modelValue?.vaatimus) {
    return $kaannaPlaceholder(props.modelValue.vaatimus as any);
  }
  return undefined;
});

async function fetchKoodisto(query: string) {
  hasChanged.value = true;
  try {
    isLoading.value = true;
    await props.koodisto.query(query || '');
  }
  catch (err) {
    console.error(err);
  }
  finally {
    isLoading.value = false;
  }
}

const onInput = debounced(async (ev: string) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [props.nimiKey]: {
      ...props.modelValue[props.nimiKey],
      [$slang.value]: _.escape(ev),
    },
  });

  if (ev.length > 2) {
    await fetchKoodisto(ev);
  }
});

function onBlur() {
  setTimeout(() => {
    focused.value = false;
  }, 300);
}

async function valitse(koodi) {
  await delay(100);
  focused.value = false;
  emit('update:modelValue', {
    koodi: {
      uri: koodi.koodiUri,
      arvo: koodi.koodiArvo,
      nimi: koodi.nimi,
      versio: koodi.versio,
      koodisto: koodi.koodisto.koodistoUri,
    },
  });
  emit('add', koodi);
}

const fields = computed(() => {
  return [
    {
      key: 'nimi',
      label: $t('nimi'),
    },
    {
      key: 'koodiArvo',
      label: $t('arvo'),
    },
    {
      key: 'voimassaAlkuPvm',
      label: $t('voimaantulo'),
      formatter: (value: any, key: string, item: any) => {
        return $sd(value);
      },
    },

  ];
});

const haeKayttoLista = computed(() => {
  return !!route.params.projektiId;
});

const koodistoAdd = (koodi) => {
  emit('add', koodi);
};

const isValid = computed(() => {
  return !props.validation || !props.validation.$invalid;
});

defineExpose({
  openDialog: async () => await koodistoSelect.value?.openDialog(),
});
</script>

<style scoped lang="scss">

.vaatimus {
  padding-left: 2rem !important;
}

.handle {
  position: absolute;
  padding: 10px 0 0 0;
  left: 6px;
  z-index: 100;
}

.datalist-wrapper {
  width: 100%;
  position: relative;
  z-index: 1000;

  .datalist-container {
    margin:  -2px 0 0 2px;
    border-radius: 3px;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
    position: absolute;
    background: white;
    border: 1px solid #ddd;
    left: 0px;
    right: 0px;

    .datalist {
      .item {
        padding: 8px;
        cursor: pointer;

        &:hover {
          background: #eee;
        }
      }
    }
  }
}
</style>
