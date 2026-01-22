<template>
  <div class="mb-4">
    <label
      v-if="label || $slots.label"
      :class="labelClass"
      class="inline-block mb-2 font-semibold"
    >
      <slot name="label">
        {{ label }}
      </slot>
      <span
        v-if="required"
        class="required-indicator"
      >*</span>
    </label>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: '',
  },
  labelClass: {
    type: [String, Array, Object],
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
});

defineSlots();
</script>

<style scoped lang="scss">
.required-indicator {
  color: #dc3545;
  margin-left: 0.25rem;
}
</style>
