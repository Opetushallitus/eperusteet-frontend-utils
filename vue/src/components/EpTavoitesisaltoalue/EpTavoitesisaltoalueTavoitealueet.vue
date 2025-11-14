<template>
  <div>
    <div v-if="isEditing">
      <VueDraggable
        v-bind="tavoitealueOptions"
        v-model="tavoitealueet"
        tag="div"
      >
        <div
          v-for="(tavoitealue, tavoitealueIndex) in tavoitealueet"
          :key="'tavoite'+tavoitealueIndex"
          class="pb-2 tavoitealue editing"
        >
          <div
            v-if="tavoitealue.tavoiteAlueTyyppi === 'OTSIKKO'"
            class="m-2"
          >
            <div
              class="order-handle m-2"
            >
              <EpMaterialIcon>drag_indicator</EpMaterialIcon>
              <span class="otsikko"> {{ $t('tavoitealueen-otsikko') }}</span>
            </div>
            <b-row>
              <b-col cols="11">
                <ep-koodisto-select
                  v-model="tavoitealue.otsikko"
                  :store="tavoitealueetKoodisto"
                  :is-editing="isEditing"
                  :nayta-arvo="false"
                >
                  <template #default="{ open }">
                    <b-input-group>
                      <b-form-input
                        :value="tavoitealue.otsikko ? $kaanna(tavoitealue.otsikko.nimi) : ''"
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
                  </template>
                </ep-koodisto-select>
              </b-col>
              <b-col cols="1">
                <div
                  class="default-icon clickable mt-2"
                  @click="poistaTavoitealue(tavoitealue)"
                >
                  <EpMaterialIcon
                    icon-shape="outlined"
                    :color="'inherit'"
                  >
                    delete
                  </EpMaterialIcon>
                </div>
              </b-col>
            </b-row>
          </div>

          <div
            v-if="tavoitealue.tavoiteAlueTyyppi === 'TAVOITESISALTOALUE'"
            class="m-2 tavoitesisaltoalue"
          >
            <div
              class="order-handle m-2"
            >
              <EpMaterialIcon>drag_indicator</EpMaterialIcon>
              <span class="otsikko pl-1"> {{ $t('tavoitteet') }}</span>
            </div>
            <div class="ml-4">
              <EpTavoitealueTavoitteet v-model="tavoitealue.tavoitteet" />
            </div>
            <div class="mt-3 ml-4">
              <div class="otsikko mb-2">
                {{ $t('keskeiset-sisaltoalueet') }}
              </div>
              <EpTavoitealueKeskeisetSisaltoalueet v-model="tavoitealue.keskeisetSisaltoalueet" />
            </div>
            <div class="text-right">
              <ep-button
                variant="link"
                icon="delete"
                @click="poistaTavoitealue(tavoitealue)"
              >
                {{ $t('poista-tavoitteet-ja-sisaltoalueet') }}
              </ep-button>
            </div>
          </div>
        </div>
      </VueDraggable>

      <div class="d-flex flex-column">
        <ep-button
          variant="outline"
          icon="add"
          @click="lisaaTavoitealue('OTSIKKO')"
        >
          {{ $t('lisaa-tavoitealueen-otsikko') }}
        </ep-button>
        <ep-button
          variant="outline"
          icon="add"
          @click="lisaaTavoitealue('TAVOITESISALTOALUE')"
        >
          {{ $t('lisaa-tavoitteet-ja-sisaltoalueet') }}
        </ep-button>
      </div>
    </div>

    <div v-if="!isEditing">
      <div
        v-for="(tavoitealue, tavoitealueIndex) in tavoitealueet"
        :key="'tavoite'+tavoitealueIndex"
        class="tavoitealue"
      >
        <template v-if="tavoitealue.tavoiteAlueTyyppi === 'OTSIKKO'">
          <hr
            v-if="tavoitealueIndex > 0"
            class="mt-0 mb-5"
          >
          <div class="otsikko mb-3">
            {{ $kaanna(tavoitealue.otsikko.nimi) }}
          </div>
        </template>

        <div
          v-if="tavoitealue.tavoiteAlueTyyppi === 'TAVOITESISALTOALUE'"
          class="tavoitesisaltoalue mb-5"
        >
          <div
            v-if="tavoitealue.tavoitteet && tavoitealue.tavoitteet.length > 0"
            class="mb-45"
          >
            <div class="tavoitteet mb-2">
              {{ $t('tavoitteet') }}
            </div>
            <div
              v-for="(tavoite, index) in tavoitealue.tavoitteet"
              :key="tavoitealueIndex+'tavoitealue'+index"
              class="tavoite mb-3"
            >
              {{ $kaanna(tavoite.nimi) }}
            </div>
          </div>

          <div v-if="tavoitealue.keskeisetSisaltoalueet && tavoitealue.keskeisetSisaltoalueet.length > 0">
            <div class="tavoitteet mb-2">
              {{ $t('keskeiset-sisaltoalueet') }}
            </div>
            <div
              v-for="(keskeisetSisaltoalueet, index) in tavoitealue.keskeisetSisaltoalueet"
              :key="tavoitealueIndex+'tavoitealue'+index"
              class="keskeinensisaltoalue p-2"
            >
              {{ $kaanna(keskeisetSisaltoalueet) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import _ from 'lodash';
import { KoodistoSelectStore } from '../EpKoodistoSelect/KoodistoSelectStore';
import { Koodisto } from '@shared/api/eperusteet';
import { VueDraggable } from 'vue-draggable-plus';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpKoodistoSelect from '@shared/components/EpKoodistoSelect/EpKoodistoSelect.vue';
import EpTavoitealueKeskeisetSisaltoalueet from './EpTavoitealueKeskeisetSisaltoalueet.vue';
import EpTavoitealueTavoitteet from './EpTavoitealueTavoitteet.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { $t, $kaanna } from '@shared/utils/globals';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  isEditing: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const tavoitealueet = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const tavoitealueetKoodisto = new KoodistoSelectStore({
  koodisto: 'tavoitealueet',
  async query(query: string, sivu = 0, koodisto: string) {
    const { data } = (await Koodisto.kaikkiSivutettuna(koodisto, query, {
      params: {
        sivu,
        sivukoko: 10,
      },
    }));
    return data as any;
  },
});

const lisaaTavoitealue = (tyyppi: 'OTSIKKO' | 'TAVOITESISALTOALUE') => {
  tavoitealueet.value = [
    ...tavoitealueet.value,
    {
      tavoiteAlueTyyppi: tyyppi,
      ...(tyyppi === 'TAVOITESISALTOALUE' && { tavoitteet: [] }),
      ...(tyyppi === 'TAVOITESISALTOALUE' && { keskeisetSisaltoalueet: [] }),
    },
  ];
};

const poistaTavoitealue = (tavoitealue: any) => {
  tavoitealueet.value = _.filter(tavoitealueet.value, rivi => rivi !== tavoitealue);
};

const defaultDragOptions = computed(() => {
  return {
    animation: 300,
    emptyInsertThreshold: 10,
    handle: '.order-handle',
    disabled: !props.isEditing,
    ghostClass: 'dragged',
  };
});

const tavoitealueOptions = computed(() => {
  return {
    ...defaultDragOptions.value,
    group: {
      name: 'tavoitealue',
    },
  };
});

const tavoitteetOptions = computed(() => {
  return {
    ...defaultDragOptions.value,
    group: {
      name: 'tavoitteet',
    },
  };
});

const keskeisetSisaltoalueetOptions = computed(() => {
  return {
    ...defaultDragOptions.value,
    group: {
      name: 'keskeisetsisaltoalueet',
    },
  };
});
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

  .tavoitealue {
    &.editing {
      .tavoitesisaltoalue {
        border: 1px solid $gray-lighten-8;
        border-radius: 3px;

        .otsikko {
          color: $black;
        }
      }
    }
  }

  :deep(fieldset) {
    padding-right: 0px;
  }

  :deep(.input-wrapper) {
    flex: 1 1 0%;

    input {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .tavoitealue{
    .otsikko {
      font-size: 1.1rem;
      font-weight: 400;
    }

    .tavoitesisaltoalue {

      .tavoitteet {
        font-size: 1rem;
        font-weight: 600;
      }

      .keskeinensisaltoalue {
        &:nth-of-type(even) {
          background-color: $table-even-row-bg-color;
        }
        &:nth-of-type(odd) {
          background-color: $table-odd-row-bg-color;
        }
      }
    }
  }

  .mb-45 {
    margin-bottom: 2rem;
  }

</style>
