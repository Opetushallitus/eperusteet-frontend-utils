<template>
<div>
  <multiselect :value="model"
               :track-by="track"
               :options="filteredOptions"
               :close-on-select="true"
               :clear-on-select="true"
               :placeholder="placeholder"
               :internalSearch="false"
               select-label=""
               selected-label=""
               deselect-label=""
               @search-change="onSearchChange"
               @input="changed($event)"
               :multiple="multiple"
               :class="inputClass"
               :label="label">
    <template slot="singleLabel"
              slot-scope="{ option }">
      <slot name="singleLabel" :option="option"></slot>
    </template>
    <template slot="option" slot-scope="{ option, search }">
      <slot name="option" :option="option" :search="search"></slot>
    </template>
    <template
      slot="tag" slot-scope="{ option, search, remove }">
      <slot name="tag" :option="option" :search="search" :remove="remove"></slot>
    </template>
    <template slot="noResult">
      <div>{{ $t('ei-hakutuloksia') }}</div>
    </template>
    <template slot="noOptions">
      <div>{{ $t('ei-vaihtoehtoja') }}</div>
    </template>
  </multiselect>
  <div class="valid-feedback" v-if="!validationError && validMessage">{{ $t(validMessage) }}</div>
  <div class="invalid-feedback" v-else-if="validationError && invalidMessage ">{{ $t(invalidMessage) }}</div>
  <div class="invalid-feedback" v-else-if="validationError && !invalidMessage">{{ $t('validation-error-' + validationError, validation.$params[validationError]) }}</div>
  <small class="form-text text-muted" v-if="help">{{ $t(help) }}</small>
</div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import Multiselect from 'vue-multiselect';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import { Debounced } from '@shared/utils/delay';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpValidation from '../../mixins/EpValidation';
import _ from 'lodash';

@Component({
  components: {
    EpContent,
    EpInput,
    EpSpinner,
    Multiselect,
  },
})
export default class EpMultiSelect extends Mixins(EpValidation) {
  @Prop({
    required: true,
    // type: Array
  })
  private value!: any[] | any;

  @Prop({
    default: false,
  })
  private multiple!: boolean;

  @Prop()
  private trackBy!: string;

  @Prop()
  private label!: string;

  @Prop({ required: true })
  private options!: any[];

  @Prop({ default: '' })
  private help!: string;

  @Prop({ default: '' })
  private placeholder!: string;

  @Prop({ default: null })
  private searchIdentity!: null | ((v: any) => string | null | undefined);

  private search = '';

  get filteredOptions() {
    if (this.search && this.searchIdentity) {
      return _.filter(this.options, x => _.includes(
        _.toLower(this.searchIdentity!(x) || ''),
        _.toLower(this.search || '')));
    }
    return this.options;
  }

  get model() {
    return this.value;
  }

  get track() {
    return this.trackBy;
  }

  private changed(value: any) {
    this.$emit('input', value);
  }

  @Debounced(300)
  onSearchChange(ev) {
    if (this.searchIdentity) {
      this.search = ev;
    }
    else {
      this.$emit('search', ev);
    }
  }

  get inputClass() {
    return {
      'is-invalid': this.isInvalid,
      'is-valid': this.isValid,
    };
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

/deep/ .multiselect__tags {
  border: 2px solid #E0E0E1;
  border-radius: 10px;
  font-size: 1rem;
  background-color: $white;
}

/deep/ .multiselect__tag {
  background-color: $white;
  color: $black;
  margin: 0px;
}

/deep/ .multiselect__placeholder {
  margin-bottom: 0px;
  padding-top: 0px;
}

/deep/ .multiselect--active {
  .multiselect__tags {
    border-bottom: 0;
    border-top: 2px solid #E0E0E1;
  }
}

/deep/ .multiselect--above {
  .multiselect__content-wrapper {
    border: 2px solid #E0E0E1;
    border-radius: 10px 10px 0 0;
    border-bottom: none;
  }
  .multiselect__tags {
    border-bottom: 2px solid #E0E0E1;
  }
}
/deep/ .multiselect--above.multiselect--active {
  .multiselect__tags {
    border-top: 0;
  }
}

/deep/ .multiselect__content-wrapper {
  border: 2px solid #E0E0E1;
  border-radius: 0 0 10px 10px;
  border-top: none;
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
