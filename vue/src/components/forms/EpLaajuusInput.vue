<template>
  <div v-if="!isEditing">
    <div v-if="model">
      {{ model }}
      <slot>
        {{ laajuusYksikkoLyhenne }}
      </slot>
    </div>
    <div v-else>
      -
    </div>
  </div>
  <div v-else class="d-flex flex-column">
    <div class="d-flex align-items-center">
      <div class="flex-grow-1">
        <ep-input type="number" v-model="model" min="0" max="999" :is-editing="isEditing" :validation="validation" />
      </div>
      <div class="ml-2">
        <slot>
        {{ laajuusYksikkoLyhenne }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch, Prop, Component } from 'vue-property-decorator';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpValidation from '../../mixins/EpValidation';
import EpErrorWrapper from '../forms/EpErrorWrapper.vue';
import { LaajuusYksikkoEnum } from '@shared/api/amosaa';
import _ from 'lodash';

@Component({
  components: {
    EpErrorWrapper,
    EpInput,
  },
})
export default class EpLaajuusInput extends EpValidation {
  @Prop({ required: true })
  private value!: number;

  @Prop({ default: false })
  private isEditing!: boolean;

  @Prop({ required: false })
  private laajuusYksikko?: LaajuusYksikkoEnum;

  private model = 0;

  @Watch('value', { immediate: true })
  onValueUpdate(newValue: number) {
    this.model = newValue;
  }

  @Watch('model', { immediate: true })
  onModelUpdate(newValue: number) {
    this.model = Math.max(Math.min(999, Number(newValue)), 0);
    this.$emit('input', this.model);
  }

  get laajuusYksikkoLyhenne() {
    if (this.laajuusYksikko && !this.isEditing) {
      return this.$t(_.lowerCase(this.laajuusYksikko) + '-lyhenne');
    }
    else if (this.laajuusYksikko || this.isEditing) {
      return '';
    }
    else {
      return this.$t('osaamispiste'); // palautetaan 'osp' niille vanhoille joilla ei ole laajuusyksikköä
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
