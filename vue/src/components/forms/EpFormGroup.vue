<template>
  <div class="ep-form-group mb-4">
    <div class="flex justify-between items-center gap-2 mb-2">
      <label
        v-if="label || $slots.label"
        :class="[labelClass, { 'sr-only': labelSrOnly }]"
        class="inline-block font-semibold !mb-0 flex items-center gap-1"
      >
        <slot name="label">
          {{ label }}
        </slot>
        <span
          v-if="required && anyEditorEditing"
          class="required-indicator"
        >*</span>
      </label>

      <slot name="post-label" />
    </div>
    <div class="w-full">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { EditointiStore } from '../EpEditointi/EditointiStore';

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

const anyEditorEditing = computed(() => {
  return EditointiStore.anyEditing();
});

defineSlots();
</script>

<style scoped lang="scss">
.required-indicator {
  color: #dc3545;
  margin-left: 0.25rem;
}
</style>
