<template>
  <div v-if="isEditing">
    <ep-form-content name="termin-nimi">
      <ep-field
        v-model="muokattava.termi"
        help="termin-nimi"
        :validation="v$.muokattava.termi"
        :is-editing="true"
      />
    </ep-form-content>
    <ep-form-content name="termin-kuvaus">
      <ep-field
        v-model="muokattava.selitys"
        help="termin-kuvaus"
        :validation="v$.muokattava.selitys"
        :is-editing="true"
      />
    </ep-form-content>
    <ep-form-content
      v-if="alaviiteSupported"
      name="alaviitteessa"
    >
      <ep-toggle v-model="muokattava.alaviite">
        {{ $t('nayta-alaviitteessa') }}
      </ep-toggle>
    </ep-form-content>
    <ep-button
      id="tallenna-kasite"
      :disabled="v$.muokattava.$invalid"
      :show-spinner="isLoading"
      @click="tallenna"
    >
      {{ $t('tallenna') }}
    </ep-button>
    <ep-button
      class="ml-2"
      variant="warning"
      :show-spinner="isLoading"
      @click="peruuta"
    >
      {{ $t('peruuta') }}
    </ep-button>
  </div>
  <div v-else>
    <ep-spinner v-if="isLoading" />
    <div v-else>
      <vue-select
        :value="valittu"
        :filter-by="filterBy"
        :placeholder="$t('valitse-kasite')"
        label="avain"
        :options="kasitteet"
        @input="onSelect"
      >
        <template #selected-option="option">
          <span>{{ $kaanna(option.termi) }}</span>
        </template>
        <template #option="option">
          <div>
            <span>{{ $kaanna(option.termi) }}</span>
          </div>
          <div class="pl-3 small font-weight-light">
            <span v-html="$kaanna(option.selitys)" />
          </div>
        </template>
      </vue-select>
      <b-button
        v-if="valittu"
        id="muokkaa-termia"
        class="lisaa-painike"
        variant="primary"
        @click="muokkaa(valittu)"
      >
        {{ $t('muokkaa-kasitetta') }}
      </b-button>
      <b-button
        id="lisaa-uusi-termi"
        class="lisaa-painike"
        variant="primary"
        @click="muokkaa()"
      >
        {{ $t('lisaa-uusi-kasite') }}
      </b-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, getCurrentInstance } from 'vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { kasiteValidator } from '@shared/validators/kasite';
import VueSelect from 'vue-select';
import { IKasiteHandler, ITermi } from './KasiteHandler';
import _ from 'lodash';
import { useVuelidate } from '@vuelidate/core';

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  handler: {
    type: Object as () => IKasiteHandler,
    required: true,
  },
});

const emit = defineEmits(['input']);

// State variables
const kasitteet = ref<ITermi[]>([]);
const isLoading = ref(false);
const isEditing = ref(false);
const valittu = ref<ITermi | null>(null);
const muokattava = reactive<ITermi>({});

// Get instance for accessing global methods
const instance = getCurrentInstance();
const $kaanna = instance?.appContext.config.globalProperties.$kaanna;

// Setup validation
const rules = computed(() => {
  return {
    muokattava: kasiteValidator(),
  };
});

const v$ = useVuelidate(rules, { muokattava });

// Methods
const filterBy = (option, label, search) => {
  const k = $kaanna;
  const v = k(option.termi) + ' ' + k(option.selitys);
  return (v)
    .toLowerCase()
    .indexOf(search.toLowerCase()) > -1;
};

const peruuta = async () => {
  isEditing.value = false;
};

const tallenna = async () => {
  try {
    isLoading.value = true;
    const uusi = await props.handler.addOrUpdate(muokattava);
    if (!muokattava.avain) {
      kasitteet.value.unshift(uusi);
    }
  }
  finally {
    isLoading.value = false;
    isEditing.value = false;
  }
};

const muokkaa = (selected?) => {
  if (selected) {
    Object.assign(muokattava, selected);
  }
  else {
    Object.assign(muokattava, {
      alaviite: false,
    });
  }
  isEditing.value = true;
};

const onSelect = (selected) => {
  valittu.value = selected;
  if (valittu.value && valittu.value.avain) {
    emit('input', valittu.value.avain);
  }
};

const alaviiteSupported = computed(() => {
  return _.has(muokattava, 'alaviite');
});

// Lifecycle hooks
onMounted(async () => {
  try {
    isLoading.value = true;
    kasitteet.value = await props.handler.getAll();
    if (props.value) {
      valittu.value = _.find(kasitteet.value, (k) => k.avain === props.value) || null;
    }
  }
  catch (err) {
    throw err;
  }
  finally {
    isLoading.value = false;
  }
});
</script>

<style scoped lang="scss">
:deep(.vs__dropdown-menu) {
  overflow-x: hidden !important;
}

:deep(.vs__dropdown-option) {
  overflow-x: hidden !important;
  white-space: normal !important;
  i {
    font-size: small;
  }
}

.lisaa-painike {
  margin-top: 6px;
  width: 100%;
}
</style>
