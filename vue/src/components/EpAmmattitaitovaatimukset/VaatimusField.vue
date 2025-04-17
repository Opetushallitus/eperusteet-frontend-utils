<template>
  <div>
    <ep-koodisto-select
      v-if="props.modelValue"
      v-model="props.modelValue.koodi"
      :store="props.koodisto"
    >
      <template #default="{ open }">
        <div class="d-flex flex-column">
          <div>
            <ep-error-wrapper :validation="props.validation">
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
                  @input="onInput"
                  @resize="onResize"
                  @focus="focused = true"
                  @blur="onBlur"
                />
                <b-form-input
                  v-if="props.modelValue.koodi"
                  class="vaatimus"
                  :value="($kaanna(props.modelValue.koodi.nimi) || vaatimus) + ' (' + koodiArvo + ')'"
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
            </ep-error-wrapper>
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
                <div
                  v-for="(item, idx) in koodit"
                  ref="datalist"
                  :key="'autocomplete-' + idx"
                  class="item"
                >
                  <div class="d-flex align-items-center">
                    <div
                      role="button"
                      @click="valitse(item)"
                    >
                      <span>{{ item.completion.left }}</span>
                      <span class="font-weight-bold">{{ item.completion.hit }}</span>
                      <span>{{ item.completion.right }}</span>
                    </div>
                    <div>
                      <Kayttolistaus :koodi="item" />
                    </div>
                  </div>
                </div>
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
import { delay } from '../../utils/delay';
import _ from 'lodash';
import Kayttolistaus from './Kayttolistaus.vue';

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
});

const emit = defineEmits(['update:modelValue']);

const instance = getCurrentInstance();
const $kaanna = instance?.appContext.config.globalProperties.$kaanna;
const $kaannaPlaceholder = instance?.appContext.config.globalProperties.$kaannaPlaceholder;
const $t = instance?.appContext.config.globalProperties.$t;
const $slang = instance?.appContext.config.globalProperties.$slang;

const input = ref(null);
const datalistContainer = ref(null);
const datalist = ref(null);

const focused = ref(false);
const hasChanged = ref(false);
const isLoading = ref(false);
const datalistId = _.uniqueId('datalist_');

const vaatimus = computed(() => {
  return props.modelValue?.vaatimus ? _.unescape($kaanna(props.modelValue.vaatimus)) : '';
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
      completion: {
        left: nimi.substring(0, idx),
        hit: vaatimus.value,
        right: nimi.substring(idx + vaatimus.value.length),
      },
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

async function onInput(ev: string) {
  emit('update:modelValue', {
    ...props.modelValue,
    vaatimus: {
      ...props.modelValue.vaatimus,
      [$slang.value]: _.escape(ev),
    },
  });
  await fetchKoodisto(ev);
}

function onResize() {
  // Kept for backward compatibility
}

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
}

onMounted(() => {
  // Component initialization logic
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
