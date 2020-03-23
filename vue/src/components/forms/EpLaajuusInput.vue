<template>
  <div v-if="!isEditing">
    <div v-if="model">
      {{ model }} {{ $t('OSAAMISPISTE') }}
    </div>
    <div v-else>
      -
    </div>
  </div>
  <div v-else class="d-flex align-items-center">
    <div class="flex-grow-1">
      <ep-input type="number" v-model="model" min="0" max="999" :is-editing="isEditing" />
    </div>
    <div class="ml-2">
      <slot>
        {{ $t('OSAAMISPISTE') }}
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch, Prop, Component, Vue } from 'vue-property-decorator';
import EpInput from '@shared/components/forms/EpInput.vue';

@Component({
  components: {
    EpInput,
  },
})
export default class RouteTutkinnonosa extends Vue {
  @Prop({ required: true })
  private value!: number;

  @Prop({ default: false })
  private isEditing!: boolean;

  private model = 0;

  @Watch('value', { immediate: true })
  onValueUpdate(newValue: number) {
    this.model = newValue;
  }

  @Watch('model', { immediate: true })
  onModelUpdate(newValue: number) {
    this.model = Math.max(Math.min(999, Number(newValue)), 0); ;
    this.$emit('input', this.model);
  }
}
</script>

<style lang="scss" scoped>
</style>
