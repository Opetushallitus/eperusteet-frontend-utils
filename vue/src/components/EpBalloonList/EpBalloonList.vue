<template>
<div>
  <div class="balloon-wrapper" v-for="(item, idx) in inner" :key="idx">
    <div class="balloon">
      <slot v-bind="{ item }">
      </slot>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EpBalloonList extends Vue {
  @Prop({
    required: true, type: Array,
  })
  value!: any[];

  get inner() {
    return this.value;
  }

  set inner(value: any[]) {
    this.$emit('input', value);
  }
}
</script>

<style lang="scss" scoped>

.balloon-wrapper {
  margin-bottom: 6px;

  .balloon {
    background: #e6f6ff;
    border-radius: 60px;
    padding: 8px 8px 8px 18px;
    border: 1px solid #cdeeff;
  }
}

</style>
