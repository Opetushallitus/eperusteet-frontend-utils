<template>
  <div>
    <b-form-checkbox
      v-model="innerValue"
      :disabled="!isEditing"
      :inline="inline"
      :switch="asSwitch"
      :class="{ 'custom-checkbox-lg': !asSwitch && lgSize, 'custom-switch-lg': asSwitch && lgSize }"
    >
      <slot />
    </b-form-checkbox>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpFormContent from './EpFormContent.vue';

@Component({
  components: {
    EpFormContent,
  },
})
export default class EpToggle extends Vue {
  @Prop({ default: true, type: Boolean })
  private isEditing!: boolean;

  @Prop({ required: false, type: Boolean, default: false })
  private value!: boolean;

  @Prop({ default: true, type: Boolean })
  private inline!: boolean;

  @Prop({ default: true })
  private isSWitch!: boolean;

  @Prop({ default: false, type: Boolean })
  private checkbox!: boolean;

  @Prop({ required: false })
  private size!: string | undefined;

  get lgSize() {
    return this.size ? this.size === 'lg' : false;
  }

  get innerValue() {
    return this.value;
  }

  set innerValue(value) {
    this.$emit('input', value);
  }

  get asSwitch() {
    return !this.checkbox && this.isSWitch;
  }
}
</script>

<style scoped lang="scss">

@import '@shared/styles/bootstrap.scss';
@import '@shared/styles/_mixins.scss';

::v-deep .custom-checkbox .custom-control-input:disabled:checked ~ .custom-control-label::before {
  border-width: 0;
}

large checkbox
::v-deep .custom-checkbox-lg {
  padding-left: 2rem;
  .custom-control-input {
    left: 0;
    width: 1.5rem;
    height: 1.5rem;
  }
}

::v-deep .custom-checkbox-lg label.custom-control-label::before {
  top: 0rem;
  left: -1.7rem;
  width: 1.5rem;
  height: 1.5rem;
}

::v-deep .custom-checkbox-lg label.custom-control-label::after {
  top: 0rem;
  left: -1.7rem;
  width: 1.5rem;
  height: 1.5rem;
}

// Large switch
::v-deep .custom-switch-lg {
  padding-left: 3rem;
  .custom-control-input {
    left: 0;
    width: 2.625rem;
    height: 1.5rem;
  }
}

::v-deep .custom-switch-lg label.custom-control-label::before {
  top: 0rem;
  left: -3.125rem;
  width: 2.625rem;
  height: 1.5rem;
}

::v-deep .custom-switch-lg label.custom-control-label::after {
  top: 0.125rem;
  left: -3rem;
  width: 1.25rem;
  height: 1.25rem;
}

::v-deep .custom-switch .custom-control-input:checked ~ .custom-control-label::after {
  transform: translateX(1.125rem)
}

::v-deep .custom-checkbox {
  @include focus-within;
}

</style>
