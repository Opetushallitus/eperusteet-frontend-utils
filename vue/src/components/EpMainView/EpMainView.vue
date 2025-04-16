<template>
  <div class="content">
    <div :class="{'container': container}">
      <div v-if="hasHeaderSlot">
        <slot name="header" />
      </div>
      <div
        v-if="$slots['default']"
        :class="{'view-content': hasHeaderSlot}"
      >
        <slot name="default" />
      </div>
      <slot name="custom-content" />
    </div>
    <slot name="after" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EpMainView extends Vue {
  @Prop({ required: false, default: false, type: Boolean })
  private container!: boolean;

  get hasHeaderSlot() {
    return this.$scopedSlots.header;
  }
}
</script>

<style scoped lang="scss">

@import "../../styles/_variables.scss";

.content {
  padding: 20px;
}

.col-fixed {
  flex: 0 0 $main-view-offset;
}

h5 {
  overflow-x: hidden;
}

.view-content {
  margin-top: 40px;
}

</style>
