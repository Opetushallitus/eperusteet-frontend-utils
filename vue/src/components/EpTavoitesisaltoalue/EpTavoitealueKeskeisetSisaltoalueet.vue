<template>
  <div>
    <VueDraggable
      v-bind="keskeisetSisaltoalueetOptions"
      v-model="keskeisetSisaltoalueet"
      tag="div"
    >
      <div
        v-for="(keskeinenSisaltoalue, keskeinenSisaltoalueIndex) in keskeisetSisaltoalueet"
        :key="keskeinenSisaltoalue+keskeinenSisaltoalueIndex"
        class="flex flex-wrap pb-2 pr-2"
      >
        <div class="w-11/12">
          <ep-input
            v-model="keskeisetSisaltoalueet[keskeinenSisaltoalueIndex]"
            :is-editing="true"
            class="grow"
          >
            <template #left>
              <div
                class="order-handle m-2"
              >
                <EpMaterialIcon>drag_indicator</EpMaterialIcon>
              </div>
            </template>
          </ep-input>
        </div>
        <div class="w-1/12">
          <div
            class="default-icon clickable mt-2"
            @click="poistaKeskeinenSisaltoalue(keskeinenSisaltoalue)"
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

    <ep-button
      variant="outline"
      icon="add"
      @click="lisaaKeskeinenSisaltoalue()"
    >
      {{ $t('lisaa-keskeinen-sisaltoalue') }}
    </ep-button>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import _ from 'lodash';
import { VueDraggable } from 'vue-draggable-plus';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { $t } from '@shared/utils/globals';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const keskeisetSisaltoalueet = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const lisaaKeskeinenSisaltoalue = () => {
  keskeisetSisaltoalueet.value = [
    ...keskeisetSisaltoalueet.value,
    {},
  ];
};

const poistaKeskeinenSisaltoalue = (keskeinenSisaltoalue: any) => {
  keskeisetSisaltoalueet.value = _.filter(keskeisetSisaltoalueet.value, rivi => rivi !== keskeinenSisaltoalue);
};

const defaultDragOptions = computed(() => {
  return {
    animation: 300,
    emptyInsertThreshold: 10,
    handle: '.order-handle',
    ghostClass: 'dragged',
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

</style>
