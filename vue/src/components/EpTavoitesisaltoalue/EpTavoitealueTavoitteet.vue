<template>
  <div>
    <VueDraggable
      v-bind="tavoitteetOptions"
      v-model="tavoitteet"
      tag="div"
    >
      <b-row
        v-for="(tavoite, tavoiteIndex) in tavoitteet"
        :key="tavoite+tavoiteIndex"
        class="pb-2"
      >
        <b-col cols="11">
          <slot
            :tavoite="tavoite"
            :tavoite-index="tavoiteIndex"
          >
            <EpKoodistoSelect
              v-model="tavoitteet[tavoiteIndex]"
              :store="tavoitteetlukutaidotKoodisto"
              :is-editing="true"
              :nayta-arvo="false"
            >
              <template #default="{ open }">
                <b-input-group>
                  <EpInput
                    v-model="tavoite.nimi"
                    :is-editing="true"
                    :disabled="!tavoite.uri.startsWith('temporary')"
                    class="input-wrapper"
                    :validation="v$.tavoitteet.$each.$response.$data[tavoiteIndex]?.nimi"
                  >
                    <template #left>
                      <div
                        class="order-handle m-2"
                      >
                        <EpMaterialIcon>drag_indicator</EpMaterialIcon>
                      </div>
                    </template>
                  </EpInput>
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
            </EpKoodistoSelect>
          </slot>
        </b-col>
        <b-col cols="1">
          <div
            class="default-icon clickable mt-2"
            @click="poistaTavoite(tavoite)"
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
    </VueDraggable>

    <div class="d-flex justify-content-between">
      <ep-button
        variant="outline"
        icon="add"
        @click="lisaaTavoite()"
      >
        <slot name="lisaaBtnText">
          {{ $t('lisaa-tavoite') }}
        </slot>
      </ep-button>

      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import _ from 'lodash';
import { KoodistoSelectStore } from '../EpKoodistoSelect/KoodistoSelectStore';
import { Koodisto } from '@shared/api/eperusteet';
import { VueDraggable } from 'vue-draggable-plus';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpKoodistoSelect from '@shared/components/EpKoodistoSelect/EpKoodistoSelect.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import { koodistoKoodiValidator } from '@shared/validators/required';
import { generateTemporaryKoodiUri } from '@shared/utils/koodi';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { hasSlotContent } from '@shared/utils/vue-utils';
import { helpers } from '@vuelidate/validators';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const slots = useSlots();

const tavoitteet = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const rules = computed(() => ({
  tavoitteet: {
    $each: helpers.forEach({
      ...koodistoKoodiValidator(),
    }),
  },
}));

const v$ = useVuelidate(rules, { tavoitteet });

const tavoitteetlukutaidotKoodisto = new KoodistoSelectStore({
  koodisto: 'tavoitteetlukutaidot',
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

const lisaaTavoite = () => {
  tavoitteet.value = [
    ...tavoitteet.value,
    {
      ...(!hasSlotContent(slots.default)
        && {
          nimi: null,
          uri: generateTemporaryKoodiUri('tavoitteetlukutaidot')
        }),
    },
  ];
};

const poistaTavoite = (tavoite) => {
  tavoitteet.value = _.filter(tavoitteet.value, rivi => rivi !== tavoite);
};

const defaultDragOptions = computed(() => {
  return {
    animation: 300,
    emptyInsertThreshold: 10,
    handle: '.order-handle',
    ghostClass: 'dragged',
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
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

  :deep(.input-group-append) {
    display: inline-block;
  }
</style>
