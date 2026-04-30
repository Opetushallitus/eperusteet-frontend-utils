<template>
  <div class="imageselector">
    <ep-spinner v-if="isLoading" />

    <div v-else>
      <h4>{{ $t('kuvalisays-modal-selite') }}</h4>

      <div v-if="!selectedValue || imageData">
        <ep-button
          v-if="!uusiKuva && options.length > 0"
          variant="link"
          no-padding
          class="mt-4 mb-4"
          @click="uusiKuva = true"
        >
          {{ $t('lisaa-uusi-kuva') }}
        </ep-button>

        <ep-kuva-lataus
          v-if="uusiKuva || options.length === 0"
          v-model="imageData"
          class="mt-4"
          :saved="imageSaved"
          @cancel="peruuta"
        >
          <template #header="{ file }">
            <h4 v-if="file" />
            <div
              v-if="!file"
              class="flex items-center mb-2"
            >
              <h4>
                {{ $t('lataa-uusi-kuva') }}
              </h4>
              <ep-button
                v-if="options.length > 0"
                class="ml-2 mb-1"
                variant="link"
                @click="peruuta"
              >
                {{ $t('peruuta') }}
              </ep-button>
            </div>
          </template>
        </ep-kuva-lataus>
      </div>

      <div>
        <div
          v-if="selectedValue && !imageData"
          class="imgselect valittu-kuva-alue mt-5"
        >
          <div class="flex items-start flex-col">
            <img
              :key="selectedValue.id"
              class="valittu-kuva"
              :src="selectedValue.src"
              decoding="async"
              alt=""
              @load="onValittuKuvaLoad"
            >
            <div class="text-muted">
              {{ $t('fu-valittu-tiedosto') }}: {{ selectedValue.nimi }}
            </div>
            <div
              v-if="valittuKuvaMitat"
              class="text-muted text-sm mt-1"
            >
              {{ $t('kuvan-leveys') }} {{ valittuKuvaMitat.width }} px <br>
              {{ $t('kuvan-korkeus') }} {{ valittuKuvaMitat.height }} px
            </div>
            <ep-button
              class="mt-2"
              variant="link"
              no-padding
              @click="clearKuvaValinta"
            >
              {{ $t('valitse-toinen-kuva') }}
            </ep-button>
          </div>
        </div>

        <div
          v-else-if="!selectedValue && !imageData && !uusiKuva && options.length > 0"
          class="imgselect"
        >
          <ep-form-content name="valitse-kuva">
            <ep-input
              v-model="searchKuva"
              :placeholder="$t('kuva-modaali-haku-placeholder')"
              class="mb-1"
              :is-editing="true"
            />
            <div
              id="image-modal-kuva-grid"
              class="kuva-grid"
              role="listbox"
              :aria-label="$t('valitse-kuva')"
            >
              <button
                v-for="option in paginatedOptions"
                :key="option.id"
                type="button"
                class="kuva-grid-item"
                :class="{ 'kuva-grid-item--selected': option.id === modelValue.value }"
                role="option"
                :aria-selected="option.id === modelValue.value"
                :title="option.nimi"
                @click="selectKuva(option)"
              >
                <div class="kuva-grid-item__media">
                  <ep-intersect-lazy-img
                    :src="option.previewUrl"
                    img-class="kuva-grid-thumb"
                  />
                </div>
                <div class="kuva-grid-item__label text-muted small">
                  {{ option.nimi }}
                </div>
              </button>
            </div>
            <EpBPagination
              v-if="totalKuvat > ITEMS_PER_PAGE"
              v-model="kuvaGridSivu"
              :total="totalKuvat"
              :items-per-page="ITEMS_PER_PAGE"
              aria-controls="image-modal-kuva-grid"
            />
          </ep-form-content>
        </div>

        <div v-if="selectedValue || imageData" class="mt-4">
          <ep-form-content
            name="kuvateksti"
            class="mt-5"
          >
            <ep-field
              v-model="kuvateksti"
              :is-editing="true"
              :validation="v$.kuvateksti"
              :help="'teksti-naytetaan-kuvan-alla'"
              @update:model-value="onKuvatekstiChange"
            />
          </ep-form-content>

          <ep-form-content class="mt-3">
            <template #header>
              <label>{{ $t('kuvan-vaihtoehtoinen-teksti') }} *</label>
            </template>
            <ep-field
              v-model="vaihtoehtoinenteksti"
              :is-editing="true"
              :validation="v$.vaihtoehtoinenteksti"
              :help="'teksti-naytetaan-ruudunlukijalaitteelle'"
              @update:model-value="onVaihtoehtoinentekstiChange"
            />
          </ep-form-content>
        </div>
      </div>
    </div>

    <div class="flex justify-end items-center mt-3">
      <ep-button
        class="mr-3"
        variant="link"
        @click="close(false)"
      >
        {{ $t('peruuta') }}
      </ep-button>
      <ep-button
        variant="primary"
        :disabled="invalid"
        @click="close(true)"
      >
        {{ $t('lisaa-kuva') }}
      </ep-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed, onMounted, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { Kielet } from '@shared/stores/kieli';
import EpKuvaLataus, { ImageData } from '@shared/components/EpTiedosto/EpKuvaLataus.vue';
import { IKuvaHandler, ILiite } from './KuvaHandler';
import { $t, $success, $fail } from '@shared/utils/globals';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpIntersectLazyImg from '@shared/components/EpContent/EpIntersectLazyImg.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpInput from '@shared/components/forms/EpInput.vue';

const props = defineProps({
  loader: {
    type: Object as () => IKuvaHandler,
    required: true,
  },
  modelValue: {
    type: Object as () => { value?: string },
    required: true,
  },
  kuvatekstiProp: {
    type: Object,
    required: true,
  },
  vaihtoehtotekstiProp: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'onClose', 'onKuvatekstiChange', 'onVaihtoehtoinentekstiChange']);

const ITEMS_PER_PAGE = 4;

// State variables
const imageSaved = ref(false);
const imageData = ref<ImageData | null>(null);
const isLoading = ref(true);
const files = ref<ILiite[]>([]);
const kuvateksti = ref<any>({});
const vaihtoehtoinenteksti = ref<any>({});
const uusiKuva = ref<boolean>(false);
const searchKuva = ref<string>('');
const valittuKuvaMitat = ref<{ width: number; height: number } | null>(null);

const options = computed(() => {
  return _.map(files.value, f => ({
    ...f,
    previewUrl: props.loader.previewUrl?.(f.id) || f.src,
  }));
});

const filteredOptions = computed(() => {
  return _.filter(options.value, f => f.nimi.toLowerCase().includes(searchKuva.value.toLowerCase()));
});

const kuvaGridSivu = ref(1);

const totalKuvat = computed(() => filteredOptions.value.length);

const paginatedOptions = computed(() => {
  const start = (kuvaGridSivu.value - 1) * ITEMS_PER_PAGE;
  return filteredOptions.value.slice(start, start + ITEMS_PER_PAGE);
});

watch(
  () => ({ opts: options.value, mv: props.modelValue.value }),
  ({ opts, mv }) => {
    if (!opts.length) {
      kuvaGridSivu.value = 1;
      return;
    }
    const maxPage = Math.max(1, Math.ceil(opts.length / ITEMS_PER_PAGE));
    if (kuvaGridSivu.value > maxPage) {
      kuvaGridSivu.value = maxPage;
    }
    if (mv) {
      const idx = opts.findIndex(o => o.id === mv);
      if (idx >= 0) {
        kuvaGridSivu.value = Math.floor(idx / ITEMS_PER_PAGE) + 1;
      }
    }
  },
  { flush: 'post' },
);

const selectedValue = computed({
  get: () => {
    const it = _.findIndex(files.value, f => f.id === props.modelValue.value);
    if (it >= 0) {
      return files.value[it];
    }
    return undefined;
  },
  set: (liite: any) => {
    if (liite) {
      emit('update:modelValue', liite.id);
      v$.value.$touch();
    }
    else {
      emit('update:modelValue', null);
    }
  },
});

watch(
  () => props.modelValue.value,
  () => {
    valittuKuvaMitat.value = null;
  },
);

const kuvaValittu = computed(() => {
  return selectedValue.value || imageData.value;
});

// Setup vuelidate
const rules = computed(() => ({
  vaihtoehtoinenteksti: {
    [Kielet.getSisaltoKieli.value]: {
      required,
    },
  },
  kuvaValittu: {
    required,
  },
}));

const v$ = useVuelidate(rules, { vaihtoehtoinenteksti, kuvaValittu });

const invalid = computed(() => {
  return v$.value.$invalid;
});

// Methods
async function close(save: boolean) {
  if (save && !imageSaved.value) {
    await saveImage();
  }

  emit('onClose', save);
}

function selectKuva(option: (typeof options.value)[number]) {
  selectedValue.value = option;
}

function onValittuKuvaLoad(ev: Event) {
  const el = ev.target as HTMLImageElement | null;
  if (!el?.naturalWidth) {
    return;
  }
  valittuKuvaMitat.value = {
    width: el.naturalWidth,
    height: el.naturalHeight,
  };
}

function clearKuvaValinta() {
  selectedValue.value = null;
}

async function saveImage() {
  if (imageData.value) {
    const formData = new FormData();
    formData.append('file', imageData.value.file);
    formData.append('nimi', imageData.value.file.name);
    formData.append('width', _.toString(imageData.value.width));
    formData.append('height', _.toString(imageData.value.height));
    try {
      const tallenettuId = await props.loader.api().post(props.loader.endpoint(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      imageSaved.value = true;
      files.value = await props.loader.hae();
      const newFile = files.value.find((f: ILiite) => f.id === tallenettuId.data);
      selectedValue.value = newFile ?? null;

      $success($t('kuva-tallennettu-onnistuneesti'));
    }
    catch (err) {
      console.error(err);
      $fail($t('kuva-lisays-epaonnistui'));
    }
  }
}

function onKuvatekstiChange(value: any) {
  emit('onKuvatekstiChange', value[Kielet.getSisaltoKieli.value]);
}

function onVaihtoehtoinentekstiChange(value: any) {
  emit('onVaihtoehtoinentekstiChange', value[Kielet.getSisaltoKieli.value]);
}

function peruuta() {
  imageData.value = null;
  selectedValue.value = null;
  imageSaved.value = false;
  uusiKuva.value = false;
}

// Lifecycle hooks
onMounted(async () => {
  kuvateksti.value = {
    [Kielet.getSisaltoKieli.value]: props.kuvatekstiProp || props.vaihtoehtotekstiProp,
  };

  vaihtoehtoinenteksti.value = {
    [Kielet.getSisaltoKieli.value]: props.vaihtoehtotekstiProp,
  };

  try {
    isLoading.value = true;
    files.value = await props.loader.hae();
  }
  finally {
    isLoading.value = false;
  }

  if (props.modelValue.value) {
    selectedValue.value = files.value.find(f => f.id === props.modelValue.value);
  }

  emit('onKuvatekstiChange', kuvateksti.value[Kielet.getSisaltoKieli.value]);
  emit('onVaihtoehtoinentekstiChange', vaihtoehtoinenteksti.value[Kielet.getSisaltoKieli.value]);
});
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.imageselector {
  .imgselect {
    margin-bottom: 20px;
  }

  label.uploadbtn {
    width: 100%;
  }

  .kuva-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
  }

  .kuva-grid-item {
    aspect-ratio: 1;
    padding: 0.25rem;
    margin: 0;
    border: 2px solid $gray-lighten-3;
    border-radius: 4px;
    background: $white;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    min-height: 0;

    &:hover {
      border-color: $gray-lighten-2;
    }

    &:focus-visible {
      outline: 2px solid $blue;
      outline-offset: 2px;
    }
  }

  .kuva-grid-item__media {
    flex: 1 1 0;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .kuva-grid-item__label {
    flex: 0 0 auto;
    max-height: 2.5em;
    min-height: 1.25em;
    line-height: 1.2;
    margin-top: 0.2rem;
    text-align: center;
    word-break: break-word;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    -webkit-line-clamp: 2;
  }

  .kuva-grid-item--selected {
    border-color: $blue;
    box-shadow: 0 0 0 1px $blue;
  }

  :deep(.kuva-grid-thumb) {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    margin: 0 auto;
  }

  .valittu-kuva-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .valittu-kuva {
    display: block;
    max-width: 100%;
    max-height: min(50vh, 360px);
    width: auto;
    height: auto;
    object-fit: contain;
    border: 3px solid $gray-lighten-3;
    border-radius: 4px;
  }

  img.esikatselukuva {
    width: 100%;
    margin-bottom: 10px;
    border: 3px solid #eee;
  }

  input {
    margin-bottom: 10px;
  }

  .buttons {
    width: 100%;
  }

  :deep(#fileInput) {
    display: none;
  }
}
</style>
