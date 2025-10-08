<template>
  <div>
    <div
      v-for="(arvioinninKohdeAlue, index) in modelValue"
      :key="'arvioinninKohdeAlue' + index"
      class="arviointi"
    >
      <EpArviointi
        :model-value="modelValue[index]"
        :is-editing="isEditing"
        :arviointiasteikot="arviointiasteikot"
        @update:model-value="updateArvioinninKohdeAlue(index, $event)"
      >
        <template #poisto>
          <EpButton
            v-if="isEditing"
            variant="link"
            icon="delete"
            @click="poistaArvioinninKohdealue(arvioinninKohdeAlue)"
          >
            {{ $t('poista-arvioinnin-kohdealue') }}
          </EpButton>
        </template>
      </EpArviointi>
    </div>
    <EpButton
      v-if="isEditing"
      class="mt-3"
      variant="outline"
      icon="add"
      @click="lisaaArvioinninKohdeAlue"
    >
      {{ $t(lisaaBtnTeksti) }}
    </EpButton>
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed } from 'vue';
import EpArviointi from '@shared/components/EpArviointi/EpArviointi.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';

const props = defineProps<{
  modelValue: any[];
  isEditing: boolean;
  arviointiasteikot: any;
}>();

const emit = defineEmits(['update:modelValue']);

const updateArvioinninKohdeAlue = (index: number, value: any) => {
  const updated = [...props.modelValue];
  updated[index] = value;
  emit('update:modelValue', updated);
};

const lisaaArvioinninKohdeAlue = () => {
  emit('update:modelValue', [
    ...props.modelValue,
    {
      arvioinninKohteet: [],
    },
  ]);
};

const poistaArvioinninKohdealue = (arvioinninKohdeAlue: any) => {
  emit('update:modelValue', _.filter(props.modelValue, arv => arv !== arvioinninKohdeAlue));
};

const lisaaBtnTeksti = computed(() => {
  if (_.size(props.modelValue) > 0) {
    return 'lisaa-arvioinnin-kohdealue';
  }

  return 'lisaa-tutkinnon-osa-kohtainen-arviointi';
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.arviointi {
    @include tile-background-shadow;
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
  }

</style>
