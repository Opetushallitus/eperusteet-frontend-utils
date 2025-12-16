<template>
  <div v-if="inner">
    <div v-if="isEditing">
      <b-form-group
        v-if="showKohde"
        :label="$t('otsikko')"
      >
        <ep-input
          v-model="inner.kohde"
          :is-editing="true"
          :validation="validation && validation.kohde"
          :warning="true"
        />
      </b-form-group>
      <b-form-group
        v-if="kohdealueettomat"
        :label="$t('vaatimukset')"
      >
        <VueDraggable
          v-bind="vaatimusOptions"
          v-model="inner.vaatimukset"
          tag="div"
        >
          <div
            v-for="(v, vaatimusIdx) in inner.vaatimukset"
            :key="vaatimusIdx"
            class="d-flex mt-1"
          >
            <div class="flex-grow-1">
              <vaatimus-field
                v-if="koodisto"
                ref="koodistoSelect"
                v-model="inner.vaatimukset[vaatimusIdx]"
                :koodisto="koodisto"
                :validation="props.validation?.vaatimukset?.$each?.$response.$data[vaatimusIdx]?.vaatimus"
              />
              <EpInput
                v-else
                v-model="v.vaatimus"
                :is-editing="isEditing"
              />
            </div>
            <div>
              <Kayttolistaus
                v-if="inner.vaatimukset[vaatimusIdx].koodi"
                :koodi="inner.vaatimukset[vaatimusIdx].koodi"
              />
            </div>
            <div>
              <b-button
                variant="link"
                @click="poistaVaatimus(inner, v)"
              >
                <EpMaterialIcon icon-shape="outlined">
                  delete
                </EpMaterialIcon>
              </b-button>
            </div>
          </div>
        </VueDraggable>
        <div class="mt-2">
          <ep-button
            variant="outline"
            icon="add"
            @click="lisaaVaatimus(inner)"
          >
            {{ $t('lisaa-ammattitaitovaatimus-ilman-kohdealuetta') }}
          </ep-button>
        </div>
      </b-form-group>
      <b-form-group :label="kaannokset.kohdealueet">
        <VueDraggable
          v-bind="kohdealueOptions"
          v-model="inner.kohdealueet"
          tag="div"
        >
          <div
            v-for="(kohdealue, kohdealueIdx) in inner.kohdealueet"
            :key="kohdealueIdx"
            class="kohdealue mt-2"
          >
            <b-form-group class="w-100">
              <template #label>
                <div>
                  <span class="handle-kohdealue text-muted">
                    <EpMaterialIcon size="20px">drag_indicator</EpMaterialIcon>
                  </span>
                  <span class="font-weight-bold">{{ kaannokset.kohdealue }}</span>
                </div>
              </template>
              <ep-input
                v-model="kohdealue.kuvaus"
                :is-editing="true"
                class="ml-3 mr-4"
                :validation="props.validation?.kohdealueet?.$each?.$response.$data[kohdealueIdx]?.kuvaus"
                />
            </b-form-group>
            <b-form-group
              :label="kaannokset.vaatimukset"
              class="ml-3"
            >
              <div class="otsikko font-italic">
                {{ $kaanna(inner.kohde) }}
              </div>
              <VueDraggable
                v-bind="vaatimusOptions"
                v-model="kohdealue.vaatimukset"
                tag="div"
              >
                <div
                  v-for="(v, vaatimusIdx) in kohdealue.vaatimukset"
                  :key="vaatimusIdx"
                  class="mt-1 d-flex align-items-center"
                >
                  <div class="flex-grow-1">
                    <vaatimus-field
                      v-if="koodisto"
                      ref="koodistoSelect"
                      v-model="kohdealue.vaatimukset[vaatimusIdx]"
                      :koodisto="koodisto"
                      :validation="props.validation?.kohdealueet?.$each?.$response.$data[kohdealueIdx]?.vaatimukset?.$each.$data[vaatimusIdx]?.vaatimus"
                      />
                    <EpInput
                      v-else
                      v-model="v.vaatimus"
                      :is-editing="isEditing"
                    />
                  </div>
                  <div>
                    <Kayttolistaus
                      v-if="koodisto && kohdealue.vaatimukset[vaatimusIdx].koodi"
                      :koodi="kohdealue.vaatimukset[vaatimusIdx].koodi"
                    />
                  </div>
                  <div>
                    <ep-button
                      variant="link"
                      icon="delete"
                      @click="poistaVaatimus(kohdealue, v)"
                    />
                  </div>
                </div>
              </VueDraggable>

              <div class="mt-2">
                <ep-button
                  variant="outline"
                  icon="add"
                  @click="lisaaKohdealueVaatimus(kohdealue)"
                >
                  {{ kaannokset.lisaaAmmattitaitovaatimus }}
                </ep-button>
              </div>
              <div class="float-right">
                <ep-button
                  variant="link"
                  icon="delete"
                  @click="poistaKohdealue(inner, kohdealue)"
                >
                  {{ $t('poista-kohdealue') }}
                </ep-button>
              </div>
            </b-form-group>
          </div>
        </VueDraggable>
        <div class="mt-2">
          <ep-button
            variant="outline"
            icon="add"
            @click="lisaaKohdealue(inner)"
          >
            {{ kaannokset.lisaaKohdealue }}
          </ep-button>
        </div>
      </b-form-group>
    </div>
    <div v-else>
      <div
        v-if="inner.vaatimukset && inner.vaatimukset.length > 0 && showKohde"
        class="otsikko font-weight-bold"
      >
        {{ $kaanna(innerKohde) }}
      </div>
      <ul v-if="inner.vaatimukset && inner.vaatimukset.length > 0">
        <li
          v-for="(v, vidx) in inner.vaatimukset"
          :key="vidx"
        >
          <span v-if="v.koodi">
            <slot
              name="koodi"
              :koodi="v.koodi"
            >
              <span>{{ $kaanna(v.koodi.nimi) || $kaanna(v.vaatimus) }}</span>
              <span class="ml-1">
                (<a
                  :href="koodistoPalveluUrl(v.koodi.uri)"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >{{ v.koodi.uri.split('_')[1] }}</a>)
              </span>
            </slot>
          </span>
          <span v-else>
            <span>{{ $kaanna(v.vaatimus) }}</span>
            <span class="ml-2" />
          </span>
        </li>
      </ul>
      <div>
        <div
          v-for="(kohdealue, kaIdx) in inner.kohdealueet"
          :key="kaIdx"
          :class="{'mt-3' : showKohde || kohdealueettomat}"
        >
          <div class="otsikko font-weight-bold">
            {{ $kaanna(kohdealue.kuvaus) }}
          </div>
          <div
            v-if="showKohde"
            class="otsikko"
          >
            {{ $kaanna(innerKohde) }}
          </div>
          <div
            v-if="kaannosKohde"
            class="otsikko"
          >
            {{ kaannosKohde }}
          </div>
          <ul>
            <li
              v-for="(v, kvIdx) in kohdealue.vaatimukset"
              :key="kvIdx"
            >
              <span v-if="v.koodi">
                <slot
                  name="koodi"
                  :koodi="v.koodi"
                >
                  <span>{{ $kaanna(v.koodi.nimi) || $kaanna(v.vaatimus) }}</span>
                  <span
                    v-if="showKoodiArvo"
                    class="ml-1"
                  >
                    (<a
                      :href="koodistoPalveluUrl(v.koodi.uri)"
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                    >{{ v.koodi.uri.split('_')[1] }}</a>)
                  </span>
                </slot>
              </span>
              <span v-else>
                <span>{{ $kaanna(v.vaatimus) }}</span>
                <span class="ml-2" />
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import _ from 'lodash';
import EpButton from '../EpButton/EpButton.vue';
import EpInput from '../forms/EpInput.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import Kayttolistaus from './Kayttolistaus.vue';
import VaatimusField from './VaatimusField.vue';
import { KoodistoSelectStore } from '@shared/components/EpKoodistoSelect/KoodistoSelectStore';
import { Koodisto } from '../../api/eperusteet';
import { $kaanna, $t, $vahvista } from '@shared/utils/globals';
import { nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  tavoitekoodisto: {
    type: String,
    default: 'ammattitaitovaatimukset',
  },
  kaannosKohdealueet: String,
  kaannosLisaaAmmattitaitovaatimus: String,
  kaannosLisaaKohdealue: String,
  kaannosVaatimukset: String,
  kaannosKohdealue: String,
  kaannosKohde: String,
  kohdealueettomat: {
    type: Boolean,
    default: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  kohde: {
    type: Object,
    default: null,
  },
  validation: {
    type: Object,
    default: null,
  },
  showKohde: {
    type: Boolean,
    default: true,
  },
  showKoodiArvo: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const koodistoSelect = ref<InstanceType<typeof VaatimusField>[]>([]);

const inner = computed({
  get: () => props.modelValue || { kohde: null, vaatimukset: [], kohdealueet: [] },
  set: (value) => emit('update:modelValue', value),
});

const kaannokset = computed(() => ({
  kohdealueet: props.kaannosKohdealueet || $t('ammattitaito-kohdealueet'),
  lisaaKohdealue: props.kaannosLisaaKohdealue || $t('lisaa-kohdealue'),
  lisaaAmmattitaitovaatimus: props.kaannosLisaaAmmattitaitovaatimus || $t('lisaa-ammattitaitovaatimus'),
  kohdealue: props.kaannosKohdealue || $t('kohdealueen-otsikko'),
  vaatimukset: props.kaannosVaatimukset || $t('vaatimukset'),
}));

const koodisto = new KoodistoSelectStore({
    koodisto: props.tavoitekoodisto,
    async query(query, sivu = 0, koodisto) {
      return (await Koodisto.kaikkiSivutettuna(koodisto, query, {
        params: { sivu, sivukoko: 10 },
      })).data;
    },
  });

const vaatimusOptions = computed(() => ({
  animation: 300,
  emptyInsertThreshold: 10,
  handle: '.handle',
  group: { name: 'vaatimukset' },
  disabled: !props.isEditing,
  ghostClass: 'dragged',
}));

const kohdealueOptions = computed(() => ({
  animation: 300,
  emptyInsertThreshold: 10,
  handle: '.handle-kohdealue',
  group: { name: 'kohdealueet-drag-list' },
  disabled: !props.isEditing,
  ghostClass: 'dragged',
}));

const poistaKohdealue = async (value, el) => {
  if (await $vahvista($t('poista-kohdealue'), $t('poista-kohdealue-kuvaus'))) {
    value.kohdealueet = _.without(value.kohdealueet, el);
  }
};

const poistaVaatimus = async (value, el) => {
  if (await $vahvista($t('poista-vaatimus'), $t('poista-vaatimus-kuvaus'))) {
    value.vaatimukset = _.without(value.vaatimukset, el);
  }
};

const lisaaKohdealue = (value) => {
  inner.value = {
    ...inner.value,
    kohdealueet: [...(inner.value.kohdealueet || []), { kuvaus: null, vaatimukset: [] }],
  };
};

const lisaaKohdealueVaatimus = async (kohdealue) => {
  kohdealue.vaatimukset = [...(kohdealue.vaatimukset || []), { vaatimus: null, koodi: null }];
  await nextTick();
  await koodistoSelect.value?.[koodistoSelect.value?.length - 1]?.openDialog();
};

const lisaaVaatimus = async () => {
  inner.value.vaatimukset = [...(inner.value.vaatimukset || []), { vaatimus: null, koodi: null }];
  await nextTick();
  await koodistoSelect.value?.[koodistoSelect.value?.length - 1]?.openDialog();
};

const koodistoPalveluUrl = (uri) => `${window.location.origin}/koodisto-app/koodi/view/${uri}/1`;

const innerKohde = computed(() => {
  return inner?.value?.kohde;
});
</script>

<style scoped lang="scss">
.kohdealue {
  padding: 0px 8px 8px 8px;
  border: 1px solid #eee;
}

.dragged {
  background: white;
}
</style>
