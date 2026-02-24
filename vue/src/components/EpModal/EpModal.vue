<template>
  <Dialog
    :visible="visible"
    :modal="true"
    :closable="!hideHeaderClose"
    :dismissable-mask="false"
    :content-class="contentClass"
    :pt="dialogPt"
    @update:visible="onVisibleChange"
    :class="modalClass"
  >
    <template #header>
      <slot name="modal-title">
        {{ header }}
      </slot>
    </template>

    <slot />

    <template
      v-if="!hideFooter"
      #footer
    >
      <slot name="modal-footer">
        <div class="flex justify-end gap-2">
          <EpButton
            variant="link"
            @click="onCancel"
          >
            <slot name="modal-cancel">{{ cancelText }}</slot>
          </EpButton>
          <EpButton
            variant="primary"
            :disabled="okDisabled"
            @click="onOk"
          >
            <slot name="modal-ok">{{ okText }}</slot>
          </EpButton>
        </div>
      </slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Dialog from 'primevue/dialog';
import EpButton from '@shared/components/EpButton/EpButton.vue';

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | 'xl';
    header?: string;
    okText?: string;
    cancelText?: string;
    contentClass?: string;
    hideFooter?: boolean;
    hideHeaderClose?: boolean;
    okDisabled?: boolean;
  }>(),
  {
    size: 'md',
    okText: '',
    cancelText: '',
    hideFooter: false,
    hideHeaderClose: false,
    okDisabled: false,
  },
);

const emit = defineEmits<{
  ok: [];
  cancel: [];
}>();

const visible = ref(false);

function show() {
  visible.value = true;
}

function hide() {
  visible.value = false;
}

defineExpose({ show, hide });

const dialogPt = computed(() => ({
  root: {
    class: 'ep-modal',
  },
  header: {
    class: 'border-0 text-lg font-normal',
  },
  content: {
    class: 'border-0',
  },
  footer: {
    class: 'border-0',
  },
}));

const modalClass = computed(() => {
  return {
    'sm': 'sm:w-11/12 md:w-7/12 lg:w-4/12',
    'md': 'sm:w-11/12 md:w-8/12 lg:w-6/12',
    'lg': 'sm:w-11/12 md:w-9/12 lg:w-8/12',
    'xl': 'sm:w-11/12 md:w-10/12 lg:w-10/12',
  }[props.size];
});

function onVisibleChange(value: boolean) {
  if (!value) {
    visible.value = false;
    emit('cancel');
  }
}

function onOk() {
  emit('ok');
  hide();
}

function onCancel() {
  hide();
  emit('cancel');
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

:deep(.ep-modal) {
  .p-dialog-header {
    font-family: Poppins, sans-serif;
  }

  .p-dialog-footer {
    .p-button.p-button-link {
      background-color: $white;
      color: $paletti-blue;
      border-color: $white;
    }
  }
}
</style>
