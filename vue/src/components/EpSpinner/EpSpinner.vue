<template>
  <div
    class="spinner"
    :class="{'small': small, 'full-screen': fullScreen}"
  >
    <div class="oph-spinner" v-if="!fullScreen">
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
import { onUnmounted, onMounted, computed, ref } from 'vue';
import { useLoading } from 'vue-loading-overlay';

const props = defineProps({
  small: {
    type: Boolean,
    required: false,
    default: false,
  },
  color: {
    type: String,
    required: false,
  },
  fullScreen: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const $loading = useLoading({
  isFullPage: true,
  color: '#159ecb',
  loader: 'dots',
});
const loader = ref<any>(null);

onMounted(() => {
  if (props.fullScreen) {
    loader.value = $loading.show();
  }
});

onUnmounted(() => {
  if (loader.value) {
    loader.value.hide();
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

  &.full-screen {
    height: 50vh;
  }
}
</style>
