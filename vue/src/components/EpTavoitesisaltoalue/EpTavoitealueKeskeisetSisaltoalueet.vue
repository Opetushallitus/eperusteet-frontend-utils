<template>
  <div>
    <draggable
      v-bind="keskeisetSisaltoalueetOptions"
      v-model="keskeisetSisaltoalueet"
      tag="div"
    >
      <b-row
        v-for="(keskeinenSisaltoalue, keskeinenSisaltoalueIndex) in keskeisetSisaltoalueet"
        :key="keskeinenSisaltoalue+keskeinenSisaltoalueIndex"
        class="pb-2 pr-2"
      >
        <b-col cols="11">
          <ep-input
            v-model="keskeisetSisaltoalueet[keskeinenSisaltoalueIndex]"
            :is-editing="true"
            class="flex-grow-1"
          >
            <template #left>
              <div
                class="order-handle m-2"
              >
                <EpMaterialIcon>drag_indicator</EpMaterialIcon>
              </div>
            </template>
          </ep-input>
        </b-col>
        <b-col cols="1">
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
        </b-col>
      </b-row>
    </draggable>

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
import draggable from 'vuedraggable';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const instance = getCurrentInstance();
const $t = instance?.appContext.config.globalProperties.$t;

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
