<template>
    <div v-if="isEditing">
        <div v-if="items && (!multiple || innerModel)">
            <select class="form-control"
                    v-model="innerModel"
                    :multiple="multiple"
                    @change="updateValue()"
                    :class="{ 'is-invalid': isInvalid, 'is-valid': isValid }">
                <option disabled :value="null"></option>
                <option v-for="(item, idx) in items" :value="item" :key="idx">
                    <slot name="default" :item="item">{{ item }}</slot>
                </option>
            </select>
            <div class="valid-feedback"
                 v-if="!validationError && validMessage">{{ $t(validMessage) }}</div>
            <div class="invalid-feedback"
                 v-else-if="validationError && invalidMessage">{{ $t(invalidMessage) }}</div>
            <div class="invalid-feedback"
                 v-else-if="validationError && !invalidMessage">{{ $t('validation-error-' + validationError, validation.$params[validationError]) }}</div>
            <small class="form-text text-muted"
                   v-if="help && isEditing">{{ $t(help) }}</small>
        </div>
        <ep-spinner v-else></ep-spinner>
    </div>
    <div v-else>
        <ul>
            <li v-for="(item, idx) in value" :key="idx">
                <slot name="default"
                      :item="item">
                    <span>{{ item }}</span>
                </slot>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Mixins } from 'vue-property-decorator';

import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpValidation from '../../mixins/EpValidation';

@Component({
  components: {
    EpSpinner,
  },
})
export default class EpSelect extends Mixins(EpValidation) {
  @Prop({ default: false, type: Boolean })
  private isEditing!: boolean;

  @Prop({ required: true })
  private items!: any[];

  @Prop({ required: true })
  private value!: any | any[];

  @Prop({ default: true, type: Boolean })
  private useCheckboxes!: boolean;

  @Prop({ default: false, type: Boolean })
  private multiple!: boolean;

  @Prop({ default: '', type: String })
  private help!: string;

  private innerModel: any | any[] | null = null;

  private updateValue() {
    if (_.isArray(this.innerModel)) {
      this.$emit('input', [...this.innerModel]);
    }
    else {
      this.$emit('input', this.innerModel);
    }

    if (this.validation) {
      this.validation.$touch();
    }
  }

  mounted() {
    this.innerModel = this.value;
  }
}
</script>

<style scoped lang="scss">
.form-content {
  padding: 20px;

  label.content-label {
    font-weight: 600;
  }

  .form-data {
    margin-top: -5px;
    padding-left: 2px;
  }

  select {
    overflow-y: auto;
  }
}

select {
  border-top: 1;
  border-left: 1;
  border-right: 1;
  border-radius: 6;
  appearance: none;
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 500;

  &:focus {
    border-color: #47a4f5;
    outline: none !important;
    box-shadow: none !important;
  }
}

</style>
