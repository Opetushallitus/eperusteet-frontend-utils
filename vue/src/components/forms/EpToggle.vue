<template>
<div>
  <b-form-checkbox :disabled="!isEditing"
                   v-model="innerValue"
                   :inline="inline"
                   switch>
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

  get innerValue() {
    return this.value;
  }

  set innerValue(value) {
    this.$emit('input', value);
  }
}
</script>

<style scoped lang="scss">
/deep/ label.custom-control-label::before {
  border-radius: 10px;
  border: 2px solid #E0E0E1;
}
</style>
