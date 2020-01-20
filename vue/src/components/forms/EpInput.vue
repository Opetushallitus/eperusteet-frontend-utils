<template>
<div v-if="isEditing">
  <div class="input-container">
    <input class="input-style form-control"
           :class="[ inputClass ]"
           @input="onInput($event.target.value)"
           :type="type === 'number' ? 'number' : 'text'"
           :attrs="$attrs"
           :value="val">
    <div v-if="hasLeftSlot" class="addon addon-left">
      <slot name="left" />
    </div>
    <div v-if="hasRightSlot" class="addon addon-right">
      <slot name="right" />
    </div>
  </div>
  <div class="valid-feedback" v-if="!validationError && validMessage">{{ $t(validMessage) }}</div>
  <div class="invalid-feedback" v-else-if="validationError && invalidMessage">{{ $t(invalidMessage) }}</div>
  <div class="invalid-feedback" v-else-if="validationError && !invalidMessage">{{ $t('validation-error-' + validationError, validation.$params[validationError]) }}</div>
  <small class="form-text text-muted" v-if="help && isEditing">{{ $t(help) }}</small>
</div>
<div v-else :attrs="$attrs">
  <h2 v-if="isHeader">{{val}}</h2>
  <span v-else>{{val}}</span>
</div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import _ from 'lodash';
import { Kielet } from '../../stores/kieli';
import { createLogger } from '../../utils/logger';
import EpValidation from '../../mixins/EpValidation';

const logger = createLogger('EpInput');

@Component({
  name: 'EpInput',
})
export default class EpInput extends Mixins(EpValidation) {
  @Prop({ default: 'localized', type: String })
  private type!: 'localized' | 'string' | 'number';

  @Prop({ required: true })
  private value!: string | object;

  @Prop({ default: false, type: Boolean })
  private isHeader!: boolean;

  @Prop({ default: false, type: Boolean })
  private isEditing!: boolean;

  @Prop({ default: '', type: String })
  private help!: string;

  @Prop( {default: true, required: false})
  private showValidValidation!: boolean;

  get hasLeftSlot() {
    return !!this.$slots.left;
  }

  get hasRightSlot() {
    return !!this.$slots.right;
  }

  get inputClass() {
    return {
      'left-padded': this.hasLeftSlot,
      'right-padded': this.hasRightSlot,
      'is-invalid': this.isInvalid,
      'is-valid': this.isValid && this.showValidValidation,
    };
  }

  public onInput(input: any) {
    if (this.type === 'string' && !_.isString(this.value) && typeof this.value !== 'undefined') {
      logger.warn('Given value is not a string:', this.value);
    }

    if (this.type === 'number' && !_.isNumber(this.value) && typeof this.value !== 'undefined') {
      logger.warn('Given value is not a number:', this.value);
    }

    if (this.type === 'localized' && !_.isPlainObject(this.value) && typeof this.value !== 'undefined') {
      logger.warn('Given value is not an object:', this.value);
    }

    if (this.type !== 'localized' || _.isString(this.value) || _.isNumber(this.value)) {
      this.$emit('input', input);
    }
    else {
      this.$emit('input', {
        ...(_.isObject(this.value) ? this.value as any : {}),
        [Kielet.getSisaltoKieli]: input,
      });
    }
    if (this.validation) {
      this.validation.$touch();
    }
  }

  get val() {
    if (_.isObject(this.value)) {
      return (this.value as any)[Kielet.getSisaltoKieli];
    }
    else {
      return this.value;
    }
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.input-container {
  position: relative;

  .addon {
    position: absolute;
  }

  input.left-padded {
    padding-left: 32px;
  }

  input.right-padded {
    padding-right: 18px;
  }

  .addon-left {
    top: 0;
    left: 0;
  }

  .addon-right {
    top: 0;
    right: 0;
  }

}

input.input-style {
  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
}

input.is-invalid:focus {
  border-color: #dc3545;
}

input {
  &.is-valid {
    border-color: #E0E0E1;
  }

  &.is-valid:focus {
    border-color: $valid;
  }
}

// Piilotettu Bootstrapissa oletuksena
/deep/ .invalid-feedback,
/deep/ .valid-feedback {
  display: block;
}

</style>
