<template>
  <div
    class="spinner"
    :class="{'small': small}"
  >
    <div class="oph-spinner">
      <div
        class="oph-bounce oph-bounce1"
        :style="style"
      />
      <div
        class="oph-bounce oph-bounce2"
        :style="style"
      />
      <div
        class="oph-bounce oph-bounce3"
        :style="style"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  small: {
    type: Boolean,
    required: false,
    default: false
  },
  color: {
    type: String,
    required: false
  }
});

const style = computed(() => {
  if (props.color) {
    return { 'background-color': props.color + ' !important' };
  }
  return {};
});
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";
@import "./style.scss";

.spinner {
  margin-top: 5px;

  &.small {
    .oph-bounce {
      height: 10px;
      width: 10px;
    }
  }

  .oph-bounce {
    background-color: $spinner-background-color !important;
  }
}
</style>
