<template>
  <div>
    <VueDraggable
      v-bind="tavoitteetOptions"
      v-model="tavoitteet"
      tag="div"
    >
      <div
        v-for="(tavoite, tavoiteIndex) in tavoitteet"
        :key="tavoite+tavoiteIndex"
        class="flex flex-wrap pb-2"
      >
        <div class="w-11/12">
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
                <EpInputGroup>
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
                  <template #append>
                    <ep-button
                      variant="primary"
                      @click="open"
                    >
                      {{ $t('hae-koodistosta') }}
                    </ep-button>
                  </template>
                </EpInputGroup>
              </template>
            </EpKoodistoSelect>
          </slot>
        </div>
        <div class="w-1/12">
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
        </div>
      </div>
    </VueDraggable>

    <div class="flex justify-between">
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
import { KoodistoSelectStore, getKoodistoSivutettuna } from '../EpKoodistoSelect/KoodistoSelectStore';
import { VueDraggable } from 'vue-draggable-plus';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpInputGroup from '@shared/components/EpInputGroup/EpInputGroup.vue';
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
    return await getKoodistoSivutettuna(koodisto, query, sivu) as any;
  },
});

const lisaaTavoite = () => {
  tavoitteet.value = [
    ...tavoitteet.value,
    {
      ...(!hasSlotContent(slots.default)
        && {
          nimi: null,
          uri: generateTemporaryKoodiUri('tavoitteetlukutaidot'),
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
