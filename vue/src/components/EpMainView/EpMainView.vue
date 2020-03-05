<template>
<div>
  <div class="content">
    <div>
      <slot name="header"></slot>
    </div>
    <div class="view-content" v-if="$slots['default']">
      <slot name="default"></slot>
    </div>
    <slot name="custom-content"></slot>
  </div>
  <slot name="after"></slot>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EpMainView extends Vue {

}
</script>

<style scoped lang="scss">

@import "@/styles/_variables.scss";

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
