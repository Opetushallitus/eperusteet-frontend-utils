<template>
  <InputGroup class="ep-input-group" :class="{ 'disabled': disabled }">
    <InputGroupAddon v-if="$slots.prefix">
      <slot name="prefix" />
    </InputGroupAddon>
    <div class="flex-grow middle-input" :class="{ 'with-prefix': $slots.prefix, 'with-append': $slots.append }">
      <slot />
    </div>
    <InputGroupAddon v-if="$slots.append" class="append-addon">
      <slot name="append" />
    </InputGroupAddon>
  </InputGroup>
</template>

<script setup lang="ts">
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
@import '@shared/styles/_variables.scss';

.disabled {
  :deep(input) {
    background-color: $grey200 !important;
  }
  :deep(.p-inputgroupaddon) {
    background-color: $grey200 !important;
  }

  .middle-input {
    background-color: $grey200 !important;
  }
}

.middle-input {

  border: 1px solid #ccc;

  &.with-prefix {
    border-left: 0 !important;
  }
  &.with-append {
    border-right: 0 !important;
  }
  :deep(input) {
    border: 0 !important;
  }
}
.append-addon {
  :deep(button) {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
}
</style>
