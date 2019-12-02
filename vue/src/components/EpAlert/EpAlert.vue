<template>
  <div>
    <img :src="pictureSrc"/>
    <span class="alert">{{ text }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EpAlert extends Vue {
  @Prop({ required: true })
  private text!: string;

  @Prop({ default: false, required: false })
  private ops!: boolean;

  get pictureSrc() {
    return this.ops ? '../../../../img/icons/ops_tyhja-tila.svg' : '../../../../img/icons/tyhja-tila.svg';
  }
}
</script>

<style lang="scss" scoped>

  .alert {
    color: #9e9e9e;
  }

</style>
