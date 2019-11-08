<template>
<div class="filter" role="search">
    <span class="form-control-feedback">
        <fas fixed-width icon="search"></fas>
    </span>
    <input class="form-control"
           type="search"
           :placeholder="placeholderText"
           :aria-label="ariaPlaceholderText"
           @input="onInput($event.target.value)"
           :value="val">
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Kielet } from '../../stores/kieli';

@Component({
  name: 'EpSearch',
})
export default class EpSearch extends Vue {
  @Prop({ type: String })
  private value!: string;

  @Prop({ type: String })
  private placeholder!: string;

  get placeholderText() {
    return this.placeholder || this.$t('etsi');
  }

  get ariaPlaceholderText() {
    return this.placeholder || this.$t('etsi-tietoja-sivulta');
  }

  public onInput(input: any) {
    this.$emit('input', input);
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
.filter {
  position: relative;

  .form-control {
    padding-left: 2.375rem;
    border-radius: 15px;
    background: #F3F3F3;
    border-width: 0;

    &::placeholder {
      color: #aaa;
    }

  }

  .form-control-feedback {
    position: absolute;
    z-index: 2;
    display: block;
    width: 2.375rem;
    height: 2.375rem;
    line-height: 2.375rem;
    text-align: center;
    pointer-events: none;
    color: #aaa;
  }
}

</style>
