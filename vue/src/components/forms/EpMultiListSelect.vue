<template>
    <div>

      <div v-for="(innerModel, i) in innerModels" :key="i" class="row mb-2">
        <div class="col-11">
          <multiselect
            class="groupselect"
            v-model="innerModels[i]"
            :options="items"
            :multiple="false"
            track-by="text"
            label="text"
            select-label=""
            selected-label=""
            deselect-label=""
            :placeholder="''"
            :class="{'is-invalid': isInvalid && i === 0 }"
            @input="handleInput($event, i)" >

            <template slot="singleLabel" slot-scope="{ option }">
              <!-- <div v-if="itemsContains(option)"> -->
                {{option.text}}
              <!-- </div>
              <div v-else /> -->
            </template>

            <template slot="option" slot-scope="{ option }">
              <div :class="{'child': option.child, 'unselectable': option.unselectable}">
                {{option.text}}
              </div>
            </template>

            <template slot="noResult">
              <div>{{ $t('ei-hakutuloksia') }}</div>
            </template>
            <template slot="noOptions">
              <div>{{ $t('ei-vaihtoehtoja') }}</div>
            </template>

          </multiselect>

        </div>
        <div class="col-1">
          <ep-button v-if="i > 0" buttonClass="p-0 pt-2" variant="link" icon="roskalaatikko" @click="poistaValinta(i)" />
        </div>
      </div>

      <ep-button buttonClass="pl-0" variant="outline-primary" icon="plussa" @click="lisaaValinta">
        {{ $t(lisaaTeksti) }}
      </ep-button>

      <div class="valid-feedback" v-if="!validationError && validMessage">{{ $t(validMessage) }}</div>
      <div class="invalid-feedback" v-else-if="validationError && invalidMessage ">{{ $t(invalidMessage) }}</div>
      <div class="invalid-feedback" v-else-if="validationError && !invalidMessage">{{ $t('validation-error-' + validationError, validation.$params[validationError]) }}</div>

    </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';

import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpValidation from '../../mixins/EpValidation';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import Multiselect from 'vue-multiselect';

export interface MultiListSelectItem {
  value: any,
  text: string,
  unselectable: boolean,
  child: boolean,
}

@Component({
  components: {
    EpSpinner,
    EpButton,
    Multiselect,
  },
})
export default class EpMultiListSelect extends Mixins(EpValidation) {
  @Prop({ required: true })
  private items!: MultiListSelectItem[];

  @Prop({ required: true })
  private value!: any[];

  @Prop({ required: false })
  private tyyppi!: string;

  @Prop({ default: null })
  public validation!: any;

  private innerModels: any[] = [];

  private updateValue() {
    this.$emit('input', [...this.innerModelsValues]);
  }

  @Watch('items', { immediate: true })
  onChange(val) {
    this.innerModels = _.map(this.value, (singleValue) => _.head(_.filter(this.items, (item) => _.isEqual(item.value, singleValue))));
  }

  get lisaaTeksti() {
    if(this.tyyppi) {
      return 'lisaa-' + this.tyyppi;
    }

    return 'lisaa';
  }

  itemsContains(model) {
    return _.includes(this.items, model);
  }

  lisaaValinta() {
    this.innerModels = [
      ...(this.innerModels as any),
      {}
    ];
  }

  poistaValinta(index) {
    this.innerModels = _.filter(this.innerModels, (val, valIndex) => index !== valIndex);
    this.updateValue();
  }

  handleInput(selected, index) {

    if(_.isEmpty(selected) || selected.unselectable) {
      this.poistaValinta(index);
      this.lisaaValinta();
    }
    else {
      if(_.size(_.filter(this.innerModels, (innerModel) => innerModel === selected)) === 1){
        this.updateValue();
      }
      else {
        this.poistaValinta(index);
        this.lisaaValinta();
      }
    }
  }

  get innerModelsValues() {
    return _.chain(this.innerModels)
      .filter(innerModel => !_.isEmpty(innerModel.value))
      .map(innerModel => innerModel.value)
      .value();
  }

}
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

  .unselectable {
    cursor: default;
  }

  /deep/ .multiselect__element {
    margin: 0px;
    padding: 0px;
    line-height: 1rem;
  }

  /deep/ .multiselect__option {
    padding: 0px;
    margin: 0px;
    background-color: $white;
    color: $black;
  }

  /deep/ .multiselect__option div {
    padding: 12px;
    margin: 0px;
  }

  /deep/ .multiselect__option div.child {
    padding-left: 35px;
  }

  /deep/ .multiselect__option--highlight div {
    background-color: $blue-lighten-1;
    color: $white;
  }

  /deep/ .multiselect__option .unselectable {
    background-color: $white;
    color: $gray-lighten-1;
  }

  /deep/ .is-invalid .multiselect__content-wrapper {
    border-color: #dc3545;
  }

  /deep/ .is-valid .multiselect__content-wrapper {
    border-color: $valid;
  }

  /deep/ .is-invalid .multiselect__tags {
    border-color: #dc3545;
  }

  /deep/ .is-valid .multiselect__tags {
    border-color: $valid;
  }

  // Piilotettu Bootstrapissa oletuksena
  /deep/ .invalid-feedback,
  /deep/ .valid-feedback {
    display: block;
  }

</style>
