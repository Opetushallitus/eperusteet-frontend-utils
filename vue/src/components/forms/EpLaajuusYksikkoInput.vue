<template>
  <EpMultiSelect
    v-model="model"
    :options="laajuusYksikot"
    :close-on-select="true"
    :clear-on-select="false"
    :placeholder="$t('valitse-laajuus-yksikko')"
    :validation="validation">
    <template slot="singleLabel" slot-scope="{ option }">
      {{ $t(option.toLowerCase() + '-lyhenne') }}
    </template>
    <template slot="option" slot-scope="{ option }">
      {{ $t(option.toLowerCase() + '-partitiivi') }}
    </template>
  </EpMultiSelect>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import EpValidation from '../../mixins/EpValidation';
import EpErrorWrapper from '../forms/EpErrorWrapper.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import { LaajuusYksikkoEnum } from '@shared/api/amosaa';

@Component({
  components: {
    EpErrorWrapper,
    EpMultiSelect,
  },
})
export default class EpLaajuusYksikkoInput extends Mixins(EpValidation) {
  @Prop({ required: true })
  private value!: LaajuusYksikkoEnum;

  private model = LaajuusYksikkoEnum.OSAAMISPISTE;

  @Watch('value', { immediate: true })
  onValueUpdate(newValue: LaajuusYksikkoEnum) {
    this.model = newValue;
  }

  @Watch('model', { immediate: true })
  onModelUpdate() {
    this.$emit('input', this.model);
  }

  get laajuusYksikot() {
    return [
      LaajuusYksikkoEnum.OPINTOPISTE,
      LaajuusYksikkoEnum.OPINTOVIIKKO,
      LaajuusYksikkoEnum.TUNTI,
      LaajuusYksikkoEnum.VIIKKO,
      LaajuusYksikkoEnum.OSAAMISPISTE,
      LaajuusYksikkoEnum.VUOSI,
      LaajuusYksikkoEnum.VUOSIVIIKKOTUNTI,
    ];
  }
};
</script>

<style lang="scss" scoped>
</style>
