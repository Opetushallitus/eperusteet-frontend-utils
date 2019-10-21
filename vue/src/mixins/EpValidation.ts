import { Component, Prop, Mixins } from 'vue-property-decorator';
import _ from 'lodash';
import { validationMixin } from 'vuelidate';

@Component({
  validations() {
    const vc = (this as any).validationConfig;
    if (vc === undefined) {
      console.error('Validation configuration missing:', this);
      return {};
    }
    return vc;
  },
} as any)
export default class EpValidation extends Mixins(validationMixin) {
  @Prop({ default: '', type: String })
  private validMessage!: string;

  @Prop({ default: '', type: String })
  private invalidMessage!: string;

  @Prop({ default: null })
  public validation!: any;

  get isInvalid() {
    return this.validation && this.validation.$invalid;
  }

  get isValid() {
    return this.validation && !this.validation.$invalid;
  }

  get validationError() {
    // Validointi näyteään vain muokkaustilassa
    if (this.validation && ((this as any).isEditing === undefined || (this as any).isEditing)) {
      return _(this.validation)
        .keys()
        .reject((key) => _.startsWith(key, '$'))
        .reject((key) => this.validation[key])
        .head();
    }
    else {
      return '';
    }
  }
}
