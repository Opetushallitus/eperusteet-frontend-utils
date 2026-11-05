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
            :class="{ 'tavoitesisaltoalue p-3': !naytaKeskeisetSisaltoalueet }"
          >
            <div class="flex items-center gap-2 mb-2">
              <div
                class="order-handle"
              >
                <EpMaterialIcon>drag_indicator</EpMaterialIcon>
              </div>
              <span class="otsikko"> {{ $t('tavoitealueen-otsikko') }}</span>
            </div>
            <div class="flex">
              <div class="w-11/12 min-w-0">
                <ep-koodisto-select
                  v-model="tavoitealue.otsikko"
                  :koodisto="otsikkoKoodisto"
                  :is-editing="isEditing"
                  :nayta-arvo="false"
                >
                  <template #default="{ open }">
                    <EpInputGroup class="w-full min-w-0">
                      <ep-input
                        v-if="sallitaanOmaOtsikko && tavoitealue.otsikko"
                        v-model="tavoitealue.otsikko.nimi"
                        :is-editing="true"
                        :disabled="!tavoitealue.otsikko.uri?.startsWith('temporary')"
                        class="input-wrapper"
                        :validation="v$.tavoitealueet.$each.$response.$data[tavoitealueIndex]?.otsikko"
                      />
                      <ep-input
                        v-else
                        :model-value="tavoitealue.otsikko ? $kaanna(tavoitealue.otsikko.nimi) : ''"
                        :is-editing="true"
                        disabled
                      />
                      <template #append>
                        <EpButton
                          variant="primary"
                          @click="open"
                        >
                          {{ $t('hae-koodistosta') }}
                        </EpButton>
                      </template>
                    </EpInputGroup>
                  </template>
                </ep-koodisto-select>
              </div>
              <div class="w-1/12">
                <div
                  class="default-icon clickable m-1 ml-3"
                  @click="poistaTavoitealue(tavoitealue)"
                >
                  <EpMaterialIcon
                    icon-shape="outlined"
                    :color="'inherit'"
                  >
                    delete
                  </EpMaterialIcon>
                </div>
              </div>
            </div>
            <div
              v-if="!naytaKeskeisetSisaltoalueet"
              class="mt-3"
            >
              <div class="otsikko mb-2">
                {{ $t('tavoitteiden-johdanto') }}
              </div>
              <div class="w-11/12 min-w-0">
                <ep-input
                  :model-value="tavoitealue.tavoitteidenJohdanto ?? null"
                  :is-editing="true"
                  @update:model-value="tavoitealue.tavoitteidenJohdanto = $event"
                />
              </div>
              <div class="otsikko mb-2 mt-3">
                {{ $t('tavoitteet') }}
              </div>
              <EpTavoitealueTavoitteet
                v-model="tavoitealue.tavoitteet"
                :koodisto="tavoiteKoodisto"
                :sallitaan-oma-tavoite="sallitaanOmaTavoite"
              />
            </div>
          </div>

          <div
            v-if="tavoitealue.tavoiteAlueTyyppi === 'TAVOITESISALTOALUE'"
            class="m-2 tavoitesisaltoalue"
          >
            <div
              class="order-handle m-1"
            >
              <EpMaterialIcon>drag_indicator</EpMaterialIcon>
              <span class="otsikko pl-1"> {{ $t('tavoitteet') }}</span>
            </div>
            <div class="ml-4">
              <div class="otsikko mb-2">
                {{ $t('tavoitteiden-johdanto') }}
              </div>
              <div class="w-11/12 min-w-0">
                <ep-input
                  :model-value="tavoitealue.tavoitteidenJohdanto ?? null"
                  :is-editing="true"
                  @update:model-value="tavoitealue.tavoitteidenJohdanto = $event"
                />
              </div>
              <div class="mt-3">
                <EpTavoitealueTavoitteet
                  v-model="tavoitealue.tavoitteet"
                  :koodisto="tavoiteKoodisto"
                  :sallitaan-oma-tavoite="sallitaanOmaTavoite"
                />
              </div>
            </div>
            <div
              v-if="naytaKeskeisetSisaltoalueet"
              class="mt-3 ml-4"
            >
              <div class="otsikko mb-2">
                {{ $t('keskeiset-sisaltoalueet') }}
              </div>
              <EpTavoitealueKeskeisetSisaltoalueet v-model="tavoitealue.keskeisetSisaltoalueet" />
            </div>
            <div class="text-right p-2">
              <EpButton
                variant="link"
                icon="delete"
                @click="poistaTavoitealue(tavoitealue)"
              >
                {{ $t('poista-tavoitteet-ja-sisaltoalueet') }}
              </EpButton>
            </div>
          </div>
        </div>
      </VueDraggable>

      <div class="flex flex-col gap-2">
        <EpButton
          variant="outline"
          icon="add"
          @click="lisaaTavoitealue('OTSIKKO')"
        >
          {{ naytaKeskeisetSisaltoalueet ? $t('lisaa-tavoitealueen-otsikko') : $t('lisaa-tavoitealue') }}
        </EpButton>
        <EpButton
          v-if="naytaKeskeisetSisaltoalueet"
          variant="outline"
          icon="add"
          @click="lisaaTavoitealue('TAVOITESISALTOALUE')"
        >
          {{ $t('lisaa-tavoitteet-ja-sisaltoalueet') }}
        </EpButton>
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
          <div
            v-if="$kaanna(tavoitealue.tavoitteidenJohdanto) || (tavoitealue.tavoitteet && tavoitealue.tavoitteet.length > 0)"
            class="tavoitesisaltoalue mb-5"
          >
            <div
              v-if="$kaanna(tavoitealue.tavoitteidenJohdanto)"
              class="mb-2"
            >
              {{ $kaanna(tavoitealue.tavoitteidenJohdanto) }}
            </div>
            <ul
              v-if="tavoitealue.tavoitteet && tavoitealue.tavoitteet.length > 0"
              class="tavoitteet-lista"
            >
              <li
                v-for="(tavoite, index) in tavoitealue.tavoitteet"
                :key="tavoitealueIndex+'otsikko-tavoite'+index"
              >
                {{ $kaanna(tavoite.nimi) }}
              </li>
            </ul>
          </div>
        </template>

        <div
          v-if="tavoitealue.tavoiteAlueTyyppi === 'TAVOITESISALTOALUE'"
          class="tavoitesisaltoalue mb-5"
        >
          <div
            v-if="$kaanna(tavoitealue.tavoitteidenJohdanto)"
            class="mb-2"
          >
            {{ $kaanna(tavoitealue.tavoitteidenJohdanto) }}
          </div>
          <div
            v-if="tavoitealue.tavoitteet && tavoitealue.tavoitteet.length > 0"
            class="mb-45"
          >
            <ul class="tavoitteet-lista">
              <li
                v-for="(tavoite, index) in tavoitealue.tavoitteet"
                :key="tavoitealueIndex+'tavoitealue'+index"
              >
                {{ $kaanna(tavoite.nimi) }}
              </li>
            </ul>
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
import { computed, getCurrentInstance, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import _ from 'lodash';
import { VueDraggable } from 'vue-draggable-plus';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpInputGroup from '@shared/components/EpInputGroup/EpInputGroup.vue';
import EpKoodistoSelect from '@shared/components/EpKoodistoSelect/EpKoodistoSelect.vue';
import EpTavoitealueKeskeisetSisaltoalueet from './EpTavoitealueKeskeisetSisaltoalueet.vue';
import EpTavoitealueTavoitteet from './EpTavoitealueTavoitteet.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { $t, $kaanna } from '@shared/utils/globals';
import { generateTemporaryKoodiUri, Koodistot } from '@shared/utils/koodi';
import { koodistoKoodiValidator } from '@shared/validators/required';
import EpInput from '@shared/components/forms/EpInput.vue';

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
  otsikkoKoodisto: {
    type: String,
    default: Koodistot.TAVOITEALUEET,
  },
  tavoiteKoodisto: {
    type: String,
    default: Koodistot.TAVOITTEETLUKUTAITO2027,
  },
  sallitaanOmaTavoite: {
    type: Boolean,
    default: true,
  },
  sallitaanOmaOtsikko: {
    type: Boolean,
    default: false,
  },
  naytaKeskeisetSisaltoalueet: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const tavoitealueet = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

watch(() => props.modelValue, (alueet) => {
  if (props.naytaKeskeisetSisaltoalueet || !Array.isArray(alueet)) {
    return;
  }

  alueet.forEach((tavoitealue: any) => {
    if (tavoitealue?.tavoiteAlueTyyppi === 'OTSIKKO' && !Array.isArray(tavoitealue.tavoitteet)) {
      tavoitealue.tavoitteet = [];
    }
  });
}, { immediate: true });

const rules = computed(() => {
  const nimiRules = koodistoKoodiValidator().nimi;

  return {
    tavoitealueet: {
      $each: helpers.forEach({
        ...(props.sallitaanOmaOtsikko && {
          otsikko: _.mapValues(nimiRules, (rule: (value: unknown) => boolean) => {
            return (otsikko: { nimi?: unknown } | undefined, tavoitealue: { tavoiteAlueTyyppi?: string }) => {
              if (tavoitealue?.tavoiteAlueTyyppi !== 'OTSIKKO') {
                return true;
              }

              return rule(otsikko?.nimi);
            };
          }),
        }),
      }),
    },
  };
});

const v$ = useVuelidate(rules, { tavoitealueet });

const lisaaTavoitealue = (tyyppi: 'OTSIKKO' | 'TAVOITESISALTOALUE') => {
  tavoitealueet.value = [
    ...tavoitealueet.value,
    {
      tavoiteAlueTyyppi: tyyppi,
      ...(tyyppi === 'OTSIKKO' && props.sallitaanOmaOtsikko && {
        otsikko: {
          nimi: null,
          uri: generateTemporaryKoodiUri(props.otsikkoKoodisto),
        },
      }),
      ...(tyyppi === 'OTSIKKO' && !props.naytaKeskeisetSisaltoalueet && { tavoitteet: [] }),
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
        border: 1px solid $grey200;
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

      .tavoitteet-lista {
        list-style-type: disc;
        margin-bottom: 1rem;
        padding-left: 1.25rem;
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
