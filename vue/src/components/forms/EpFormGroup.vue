<template>
  <div class="form-group">
    <label
      v-if="label || $slots.label"
      :class="labelClass"
      class="form-label"
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
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: inline-block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.required-indicator {
  color: #dc3545;
  margin-left: 0.25rem;
}
</style>
