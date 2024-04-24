<template>
<div class="form-group form-content">
    <div v-if="showHeader">
      <div v-if="name">
        <h3 :class="headerClass" v-if="headerType === 'h3'">{{ $t(name, lang) }}</h3>
        <label v-else>{{ $t(name, lang) }}</label>
      </div>
      <slot name="header"></slot>
    </div>
    <slot></slot>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Kielet } from '@shared/stores/kieli';

/**
 * Tämän komponentin tehtävä on ainoastaan esittää label lomakekentälle
 */
@Component
export default class EpFormContent extends Vue {
  @Prop({ required: false, type: String })
  private name!: string;

  @Prop({ type: String })
  private headerType!: string;

  @Prop({ type: String })
  private headerClass!: string;

  @Prop({ required: false, default: true })
  private showHeader!:boolean;

  @Prop({ required: false, type: String })
  private kieli?: string;

  private lang: string = this.kieli ? this.kieli : this.sisaltoKieli;

  @Watch('sisaltoKieli')
  async kieliChanged() {
    this.lang = this.kieli ? this.kieli : this.sisaltoKieli;
  }

  get sisaltoKieli() {
    return Kielet.getSisaltoKieli.value;
  }
}
</script>

<style scoped lang="scss">
.form-content {
  margin: 0 0 30px 0;

  label {
    font-weight: 600;
  }

  .h6 {
    font-weight: 600;
    font-size: 16px;
  }
}
</style>
