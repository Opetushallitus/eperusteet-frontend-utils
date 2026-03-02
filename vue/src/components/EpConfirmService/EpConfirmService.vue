<template>
  <ConfirmDialog group="headless">
    <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col p-4 bg-surface-0 dark:bg-surface-900 rounded">
            <span class="font-bold text-2xl block mb-4 mt-0">{{ message.header }}</span>
            <p class="mb-0">{{ message.message }}</p>
          </div>
          <div class="text-right mb-2 mr-2">
            <EpButton label="Cancel" variant="link" @click="rejectCallback" class="w-32">{{ $t('peruuta') }}</EpButton>
            <EpButton label="Save" @click="acceptCallback" class="w-32">{{ $t('kylla') }}</EpButton>
          </div>
    </template>
</ConfirmDialog>
</template>

<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog';
import EpButton from '@shared/components/EpButton/EpButton.vue';
</script>
