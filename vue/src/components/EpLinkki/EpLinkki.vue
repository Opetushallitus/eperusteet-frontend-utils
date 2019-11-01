<template>
<div class="linkki">
  <a :href="url">
    <fas fixed-width :icon="icon" class="mr-1" v-if="icon"></fas>
    <slot v-if="hasSlot()"></slot>  
    <span v-else>{{ cleanUrl }}</span>
  </a>
</div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';

@Component
export default class EpLinkki extends Vue {
  @Prop({ type: String })
  private url!: string;

  @Prop({
    required: false,
    type: String
  })
  private label!: string;

  @Prop({ default: '', type: String })
  private icon!: string;

  @Prop({
    default: true,
    type: Boolean
  })
  private onlyTopLevel!: boolean;

  hasSlot() {
    return !!this.$slots.default;
  }

  get cleanUrl() {
    let result = this.url
      ? (this.url.replace(/^https?:\/\//, ''))
      : '';

    result = result.replace(/^mailto?:/, '');

    if (this.onlyTopLevel) {
      const idx = result.indexOf('/');
      if (idx > 0) {
        result = result.substr(0, idx);
      }
    }
    return result;
  }
}
</script>

<style scoped lang="scss">
.linkki {
  font-size: small;

  a {
    display: inline;
    white-space: nowrap;

  }
 
}
.linkki.medium {
  font-size: medium;
} 
</style>

