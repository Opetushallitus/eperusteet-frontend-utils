<template>
  <ConfirmDialog
    group="headless"
    class="w-1/3"
  >
    <template #container="{ message, acceptCallback, rejectCallback, }">
      <div class="flex flex-col p-4 bg-surface-0 dark:bg-surface-900 rounded">
        <span class="font-bold text-2xl block mb-4 mt-0">{{ message.title }}</span>
        <p class="mb-0">
          {{ message.message }}
        </p>
      </div>
      <div class="flex gap-4 justify-end items-center m-3">
        <EpButton
          label="Cancel"
          variant="link"
          @click="rejectCallback"
        >
          {{ $t(message.cancelTitle) }}
        </EpButton>
        <EpButton
          label="Save"
          @click="acceptCallback"
        >
          {{ $t(message.okTitle) }}
        </EpButton>
      </div>
    </template>
  </ConfirmDialog>
</template>

<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog';
import EpButton from '@shared/components/EpButton/EpButton.vue';

export interface ConfirmServiceOptions {
  title?: string;
  message?: string;
  okTitle?: string;
  cancelTitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
</script>
