<template>
  <div
    class="filter"
    role="search"
    :class="{'maxWidth': maxWidth}"
  >
    <label
      v-if="labelSlot"
      :for="id"
    ><slot name="label" /></label>
    <label
      v-if="srOnlyLabelText"
      :for="id"
      class="sr-only"
    >{{ srOnlyLabelText }}</label>
    <span class="form-control-feedback">
      <EpMaterialIcon class="icon">search</EpMaterialIcon>
    </span>
    <input
      :id="id"
      class="form-control"
      type="search"
      :placeholder="placeholderText"
      aria-describedby="hakuohje"
      :value="val"
      :maxlength="maxlength"
      @input="onInput($event.target.value)"
    >
    <p
      id="hakuohje"
      class="sr-only"
    >
      {{ $t('saavutettavuus-hakuohje') }}
    </p>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Kielet } from '../../stores/kieli';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMaterialIcon,
  },
})
export default class EpSearch extends Vue {
  @Prop({ type: String })
  private value!: string;

  @Prop({ type: String })
  private placeholder!: string;

  @Prop({ required: false, default: false })
  private isLoading!: boolean;

  @Prop({ required: false, default: false, type: Boolean })
  private maxWidth!: boolean;

  @Prop()
  private maxlength!: number;

  @Prop({ required: false, default: '', type: String })
  private srOnlyLabelText!: string;

  get id() {
    return _.uniqueId('search-');
  }

  get icon() {
    return this.isLoading ? 'spinner' : 'search';
  }

  get placeholderText() {
    if (this.placeholder != null) {
      return this.placeholder;
    }

    return this.$t('etsi');
  }

  public onInput(input: any) {
    this.$emit('input', input);
  }

  get val() {
    if (_.isObject(this.value)) {
      return (this.value as any)[Kielet.getSisaltoKieli.value];
    }
    else {
      return this.value;
    }
  }

  get labelSlot() {
    return this.$slots.label;
  }
}
</script>

<style scoped lang="scss">
.icon {
  vertical-align: middle;
}

.filter {
  position: relative;

  &.maxWidth {
    max-width: 100%;
  }

  .form-control {
    padding-left: 2.375rem;
    border-width: 1px;

    &::placeholder {
      color: #888;
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
    color: #555;
  }
}

</style>
