<template>
  <div>
    <b-pagination
      :value="currentPage"
      @input="currentPage = $event"
      class="mt-4"
      :total-rows="totalPages"
      :per-page="perPage"
      align="center"
      :aria-controls="controls"
      :first-text="$t('alkuun')"
      :last-text="$t('loppuun')"
      prev-text="«"
      next-text="»"
      :label-first-page="$t('alkuun')"
      :label-last-page="$t('loppuun')"
      :label-page="$t('sivu')"
      :label-next-page="$t('seuraava-sivu')"
      :label-prev-page="$t('edellinen-sivu')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, useTemplateRef } from 'vue';
import { nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
    default: 1,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  ariaControls: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const fixButtonRoles = async () => {
  const buttons = document.querySelectorAll('button');
  if (buttons) {
    buttons.forEach((button) => {
      button.setAttribute('role', 'navigation');
      button.setAttribute('tabindex', '0');
    });
  }
};

onMounted(async () => {
  await fixButtonRoles();
});

const currentPage = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

watch(() => props.modelValue, async () => {
  await nextTick();
  await fixButtonRoles();
});

const controls = computed(() => {
  return props.ariaControls;
});

const perPage = computed(() => {
  return props.itemsPerPage;
});

const totalPages = computed(() => {
  return props.total;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

:deep(.page-item.disabled) {
  color: $disabled;
  opacity: 0.5;
}
</style>
