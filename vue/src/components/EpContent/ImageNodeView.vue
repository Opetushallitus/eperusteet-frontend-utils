<template>
  <node-view-wrapper class="image-node-view">
    <div v-if="editor.isEditable" class="ep-editor-component">
      <figure v-if="dataUid" class="text-center">
        <img
          class="content-image"
          :data-uid="dataUid"
          :src="imageUrl"
          :title="title"
          :alt="figcaption ? altText : tempAltText"
          @click="openModal"
        >
        <figcaption>{{ caption }}</figcaption>
      </figure>
      <EpButton
        v-if="!dataUid"
        variant="outline"
        icon="add"
        @click="openModal"
      >
        {{ $t('lisaa-kuva') }}
      </EpButton>
    </div>

    <figure v-if="dataUid && !editor.isEditable" class="text-center">
      <img
        class="content-image"
        :data-uid="dataUid"
        :src="imageUrl"
        :title="title"
        :alt="figcaption ? altText : tempAltText"
      >
      <figcaption>{{ caption }}</figcaption>
    </figure>

    <!-- Image Modal -->
    <div v-if="isModalOpen && handler" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <ImageModal
          v-model="uidObs"
          :loader="handler"
          :kuvateksti-prop="figcaptionObject"
          :vaihtoehtoteksti-prop="altTextObject"
          @on-kuvateksti-change="updateFigcaption"
          @on-vaihtoehtoinenteksti-change="updateAltText"
          @on-close="handleModalClose"
        />
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { computed, ref, inject, onMounted } from 'vue';
import { NodeViewWrapper } from '@tiptap/vue-3';
import { NodeViewProps } from '@tiptap/core';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import ImageModal from './ImageModal.vue';
import { IKuvaHandler } from './KuvaHandler';
import { $t } from '@shared/utils/globals';
import { Kielet } from '@shared/stores/kieli';
import _ from 'lodash';

interface Props extends NodeViewProps {
  // Additional props can be defined here if needed
}

const props = defineProps<Props>();

// Type assertion to help with node attrs
interface NodeWithImageAttrs {
  attrs: {
    'data-uid': string;
    alt: string;
    figcaption: string;
    src?: string;
  };
}

const imageNode = props.node as NodeWithImageAttrs;

// Get handler from injection
const handler = inject<IKuvaHandler>('kuvaHandler');

// Modal state
const isModalOpen = ref(false);
const uidObs = ref({ value: imageNode.attrs['data-uid'] || '' });

// Computed properties
const dataUid = computed({
  get: () => imageNode.attrs['data-uid'] || '',
  set: (value: string) => {
    props.updateAttributes({ 'data-uid': value });
    uidObs.value.value = value;
  },
});

const altText = computed({
  get: () => imageNode.attrs.alt || '',
  set: (value: string) => {
    props.updateAttributes({ alt: value ? value.split('"').join('"') : value });
  },
});

const figcaption = computed({
  get: () => imageNode.attrs.figcaption || '',
  set: (value: string) => {
    props.updateAttributes({ figcaption: value ? value.split('"').join('"') : value });
  },
});

const title = computed(() => {
  return altText.value || figcaption.value || '';
});

const caption = computed(() => {
  if (figcaption.value && figcaption.value !== 'undefined') {
    return figcaption.value;
  }
  if (altText.value && altText.value !== 'undefined') {
    return altText.value;
  }
  return '';
});

const tempAltText = computed(() => {
  return $t('kuvituskuva');
});

const imageUrl = computed(() => {
  if (!handler || !dataUid.value) {
    return '';
  }
  return handler.url(dataUid.value);
});

// Create object versions for the modal (it expects language maps)
const figcaptionObject = computed(() => {
  return { [Kielet.getSisaltoKieli.value]: figcaption.value };
});

const altTextObject = computed(() => {
  return { [Kielet.getSisaltoKieli.value]: altText.value };
});

// Methods
function openModal() {
  if (!props.editor.isEditable || !handler) {
    return;
  }
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

function updateFigcaption(value: string) {
  figcaption.value = value;
}

function updateAltText(value: string) {
  altText.value = value;
}

function handleModalClose(save: boolean) {
  if (save) {
    // Update the data-uid if it changed
    dataUid.value = uidObs.value.value;

    // If no image was selected and this is a new node, remove it
    if (!dataUid.value && !imageNode.attrs['data-uid']) {
      props.deleteNode();
    }
  }
  else {
    // If cancelled and this is a new node without data-uid, remove it
    if (!imageNode.attrs['data-uid']) {
      props.deleteNode();
    }
    // Reset values to original
    uidObs.value.value = imageNode.attrs['data-uid'] || '';
  }

  closeModal();
}

// Lifecycle
onMounted(() => {
  // If this is a new node without data-uid, open modal immediately
  if (!dataUid.value && props.editor.isEditable) {
    openModal();
  }
});
</script>

<style scoped lang="scss">
.image-node-view {
  position: relative;

  .ep-editor-component {
    .content-image {
      max-width: 100%;
      height: auto;
      cursor: pointer;
    }

    figure {
      margin: 1rem 0;

      figcaption {
        font-style: italic;
        color: #666;
        margin-top: 0.5rem;
      }
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  padding: 2rem;
}
</style>
