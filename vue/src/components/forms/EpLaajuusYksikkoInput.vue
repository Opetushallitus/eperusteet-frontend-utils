<template>
  <EpMultiSelect
    v-model="value"
    :options="laajuusYksikot"
    :close-on-select="true"
    :clear-on-select="false"
    :placeholder="$t('valitse-laajuus-yksikko')"
    :validation="validation.opintokokonaisuus.laajuusYksikko">
    <template slot="singleLabel" slot-scope="{ option }">
      {{ $t(option.toLowerCase() + '-lyhenne') }}
    </template>
    <template slot="option" slot-scope="{ option }">
      {{ $t(option.toLowerCase() + '-partitiivi') }}
    </template>
  </EpMultiSelect>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import EpValidation from '@/mixins/EpValidation';
import EpErrorWrapper from '../forms/EpErrorWrapper.vue';
import { LaajuusYksikkoEnum } from '@/api/amosaa';
import EpMultiSelect from '@/components/forms/EpMultiSelect.vue';

@Component({
  components: {
    EpErrorWrapper,
    EpMultiSelect,
  },
})
export default class EpLaajuusYksikkoInput extends EpValidation {
  @Prop({ required: true })
  private value!: LaajuusYksikkoEnum;

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
