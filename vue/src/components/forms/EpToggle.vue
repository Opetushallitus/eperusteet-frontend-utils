<template>
<div>
  <b-form-checkbox :disabled="!isEditing"
                   v-model="innerValue"
                   :inline="inline"
                   :switch="isSwitch">
    <slot/>
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

  @Prop({ required: false, type: Boolean, default:false })
  private value!: boolean;

  @Prop({ default: true, type: Boolean })
  private inline!: boolean;

  @Prop({ default: true})
  private isSwitch!: boolean;

  get innerValue() {
    return this.value;
  }

  set innerValue(value) {
    this.$emit('input', value);
  }
}
</script>

<style scoped lang="scss">
.custom-switch {
  ::v-deep label.custom-control-label::before {
    border-radius: 10px;
    border: 2px solid #E0E0E1;
  }
}

.custom-checkbox {

  ::v-deep .custom-control-label {
    left: 0.5rem;
  }

  ::v-deep label.custom-control-label::before {
    border-radius: 5px;
    border: 1px solid #E0E0E1;
  }



  ::v-deep .custom-control-input:disabled:checked ~ .custom-control-label::before {
    background-color:#01010166;
  }

  ::v-deep .custom-control-label::after, ::v-deep .custom-control-label::before {
    top: 0rem;
    left: -2rem;
    width: 1.5rem;
    height: 1.5rem;
  }

}
</style>
