<template>
  <div class="ep-checkbox">
    <b-form-checkbox :value="value"
                     @input="$emit('input', $event)">
      <slot></slot>
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
  @Prop({ default: false, type: Boolean })
  private isEditing!: boolean;

  @Prop({ required: true, type: Boolean })
  private value!: boolean;
}
</script>

<style scoped lang="scss">

.ep-checkbox {
  margin: 0 0 6px 0;
}

</style>
