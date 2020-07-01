<template>
<div>
  <div v-for="(item, idx) in inner" :key="idx">
    <template slot="default">
    </template>
  </div>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EpBalloonList extends Vue {
  @Prop({ required: true })
  private value: any[];

  get inner() {
    return this.value;
  }

  set inner(value: any[]) {
    this.$emit('input', value);
  }
}
</script>

<style lang="scss" scoped>

.alert {
  color: #9e9e9e;
}

.alert-only-text {
  padding: 0;
}

</style>
