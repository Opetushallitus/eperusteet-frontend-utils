<template>
  <div class="ep-form-group mb-4">
    <div class="flex">
      <label
        v-if="label || $slots.label"
        :class="[labelClass, { 'sr-only': labelSrOnly }]"
        class="inline-block mb-2 font-semibold"
      >
        <slot name="label">
          {{ label }}
        </slot>
      </label>
      <div
        v-if="required"
        class="required-indicator"
      >*</div>
    </div>
    <div class="w-full">
      <slot />
    </div>
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
  labelSrOnly: {
    type: Boolean,
    default: false,
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
