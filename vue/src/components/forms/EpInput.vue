<template>
<div v-if="isEditing">
  <div class="input-container d-flex align-items-center">
    <input class="input-style form-control"
           :class="[ inputClass ]"
           :placeholder="placeholderValue"
           @focus="onInputFocus"
           @blur="onInputBlur"
           @input="onInput($event.target.value)"
           :type="type === 'number' ? 'number' : 'text'"
           step="any"
           v-bind="$attrs"
           :value="val"
           :disabled="disabled">
    <div v-if="hasLeftSlot" class="addon addon-left">
      <slot name="left" />
    </div>
    <div v-if="hasRightSlot" class="addon addon-right">
      <slot name="right" />
    </div>
    <div v-if="hasSuffixSlot" class="ml-2">
      <slot name="suffix" />
    </div>
  </div>
  <div v-if="showMessage">
    <div class="valid-feedback" v-if="!validationError && validMessage">{{ $t(validMessage) }}</div>
    <div v-if="validationError && isDirty" :class="{ 'is-warning': isWarning }">
      <div class="invalid-feedback" v-if="invalidMessage">{{ $t(invalidMessage) }}</div>
      <div class="invalid-feedback" v-else>{{ message }}</div>
    </div>
    <small class="form-text text-muted" v-if="help && isEditing">{{ $t(help) }}</small>
  </div>
</div>
<div v-else v-bind="$attrs">
  <h2 v-if="isHeader">{{ val }}</h2>
  <span v-else-if="val">{{ val }}{{ unit ? ' ' + $kaannaOlioTaiTeksti(unit) : '' }}</span>
  <span class="placeholder" v-else-if="placeholderValue">{{ placeholderValue }}</span>
</div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import _ from 'lodash';
import { Kielet } from '../../stores/kieli';
import { createLogger } from '../../utils/logger';
import EpValidation from '../../mixins/EpValidation';
import { Debounced } from '../../utils/delay';
import { unescapeStringHtml } from '@shared/utils/inputs';

const logger = createLogger('EpInput');

const TextArea = document.createElement('textarea');

function escapeHtml(str: string | null) {
  if (!str) {
    return '';
  }
  else {
    TextArea.textContent = str;
    return removeHiddenCharacters(TextArea.innerHTML);
  }
}

function removeHiddenCharacters(input: string): string {
  // Regular expression to match common hidden or invisible characters
  const hiddenCharactersRegex = /[\u00AD\u200B\u200C\u200D\u2060\uFEFF\u2028\u2029\u00A0\u2009\u200A\u2003\u2002\u202A\u202B\u202C\u202D\u202E]/g;
  return input.replace(hiddenCharactersRegex, '');
}

@Component({
  name: 'EpInput',
})
export default class EpInput extends Mixins(EpValidation) {
  @Prop({ default: 'localized', type: String })
  private type!: 'localized' | 'string' | 'number';

  @Prop({ required: true })
  private value!: number | string | object;

  @Prop({ default: false, type: Boolean })
  private isHeader!: boolean;

  @Prop({ default: false, type: Boolean })
  private isEditing!: boolean;

  @Prop({ default: '', type: String })
  private help!: string;

  @Prop({ default: '' })
  private placeholder!: string;

  @Prop({ default: true, required: false, type: Boolean })
  private showValidValidation!: boolean;

  @Prop({ default: true, type: Boolean })
  private showMessage!: boolean;

  @Prop({ required: false })
  private unit!: string | object;

  @Prop({ default: false, type: Boolean })
  private disabled!: boolean;

  @Prop({ required: false })
  private change!: Function;

  private focus = false;

  get hasLeftSlot() {
    return !!this.$slots.left;
  }

  get hasRightSlot() {
    return !!this.$slots.right;
  }

  get hasSuffixSlot() {
    return !!this.$slots.suffix;
  }

  get inputClass() {
    return {
      'left-padded': this.hasLeftSlot,
      'right-padded': this.hasRightSlot,
      'is-invalid': !this.isWarning && this.isInvalid,
      'is-warning': this.isWarning && this.isInvalid,
      'is-valid': this.isValid && this.showValidValidation,
    };
  }

  @Debounced(1000)
  async touch() {
    this.validation?.$touch();
  }

  public onInput(input: any) {
    if (this.type === 'string' && !_.isString(this.value) && typeof this.value !== 'undefined') {
      logger.warn('Given value is not a string:', this.value);
    }

    if (this.type === 'number' && !_.isNumber(this.value) && typeof this.value !== 'undefined') {
      logger.warn('Given value is not a number:', this.value);
    }

    if (this.type === 'localized'
      && !_.isPlainObject(this.value)
      && !_.isNull(this.value)
      && !_.isUndefined(this.value)) {
      logger.warn('Given value is not an object:', this.value);
    }

    if (this.type === 'number') {
      this.$emit('input', Number(input));
    }
    else if (this.type !== 'localized' || _.isString(this.value)) {
      this.$emit('input', escapeHtml(input));
    }
    else {
      this.$emit('input', {
        ...(_.isObject(this.value) ? this.value as any : {}),
        [Kielet.getSisaltoKieli.value]: _.isString(input) ? escapeHtml(input) : input,
      });
    }

    if (this.change) {
      this.change();
    }

    // this.touch();
  }

  private onInputFocus() {
    this.focus = true;
    this.$emit('focus');
  }

  private onInputBlur() {
    this.focus = false;
    this.$emit('blur');
  }

  get val() {
    const target = _.isObject(this.value)
      ? (this.value as any)[Kielet.getSisaltoKieli.value]
      : this.value;

    return unescapeStringHtml(target);
  }

  get placeholderValue() {
    if (!this.focus) {
      if (this.placeholder) {
        return this.placeholder;
      }

      return this.$kaannaPlaceholder(this.value as any, !this.isEditing);
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
    right: 0;
  }

}

input.input-style {
  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
}

input.is-warning:focus {
  border-color: #ffc107;
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

input::placeholder {
  color: #adb5bd;
}

.is-warning {
  .invalid-feedback {
    color: orange;
  }
}

::v-deep .invalid-feedback, ::v-deep .valid-feedback {
}

// Piilotettu Bootstrapissa oletuksena
.invalid-feedback {
  display: block;
}

.placeholder {
  opacity: 0.5;
}

</style>
