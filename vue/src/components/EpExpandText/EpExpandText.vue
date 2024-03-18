<template>
  <span class="ep-expand-text" :class="{'clickable pointer': !isExpanded}" @click="toggleExpanded">
    {{ truncated }}
  </span>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EpExpandText extends Vue {
  @Prop({ required: true })
  text!: string;

  @Prop({ default: 150 })
  shortLength!: number;

  expanded = false;

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  get isExpanded() {
    return this.expanded || this.text.length <= this.shortLength;
  }

  get truncated() {
    if (this.isExpanded) {
      return this.text;
    }
    return _.truncate(this.text, { length: this.shortLength });
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
