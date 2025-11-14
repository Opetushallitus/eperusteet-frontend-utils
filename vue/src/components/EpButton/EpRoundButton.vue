<template>
  <button
    v-bind="$attrs"
    class="round-button"
    :class="'round-button-' + variant"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <EpMaterialIcon>{{ icon }}</EpMaterialIcon>
  </button>
</template>

<script setup lang="ts">
import EpSpinnerInline from '@shared/components/EpSpinner/EpSpinnerInline.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const emit = defineEmits(['click']);

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'primary',
  },
});
</script>

<style lang="scss" scoped>

  .round-button {
    border-radius: 100%;
    background: #668eea;
    border: none;
    color: #fff;
    display: inline-block;
    min-height: 40px;
    min-width: 40px;
    outline: none;
    font-size: 1.2em;
  }

  .round-button-lightblue {
    background: #3D6EC9;
  }

  .round-button-green {
    background: #D26EAF;
  }

  .round-button-pink {
    background: #62ac32;
  }

</style>
