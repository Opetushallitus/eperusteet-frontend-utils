<template>
  <div>
    <b-button class="toggle" size="sm" @click="valueChange">
      <span v-if="value" class="material-icons-outlined checked" aria-hidden="true">done</span>
      <slot />
    </b-button>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class EpColoredToggle extends Vue {
  @Prop({ required: false, type: Boolean, default: false })
  private value!: boolean;

  valueChange() {
    this.innerValue = !this.innerValue;
  }

  get innerValue() {
    return this.value;
  }

  set innerValue(value) {
    this.$emit('input', value);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .toggle {
    padding: 2px 5px;
    line-height: 20px;

    .checked {
      font-size: 0.7rem;
      padding-right: 0.2rem;
    }
  }

</style>
