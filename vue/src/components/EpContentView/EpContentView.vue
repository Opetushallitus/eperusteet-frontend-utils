<template>
  <div class="ep-content-view">
    <div
      v-if="hasHeader"
      class="header border-bottom-1"
    >
      <slot name="header" />
    </div>
    <div class="content">
      <slot name="default" />
    </div>
    <slot name="after" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EpContentView extends Vue {
  get hasHeader() {
    return !!this.$scopedSlots.header;
  }
}
</script>

<style scoped lang="scss">

@import "../../styles/_variables.scss";

.content {
  padding: $content-padding;
}

.header {
  padding: $content-padding;
}

</style>
