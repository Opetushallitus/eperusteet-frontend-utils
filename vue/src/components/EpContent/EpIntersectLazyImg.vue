<template>
  <img
    ref="elRef"
    :class="imgClass"
    :src="displaySrc"
    decoding="async"
    alt=""
  >
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

/** Landscape SVG spinner (~130×80), no network until the row is visible in the listbox */
const LOADING_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 80" width="130" height="80">'
    + '<rect width="130" height="80" fill="#fff"/>'
    + '<circle cx="65" cy="40" r="12" fill="none" stroke="#dee2e6" stroke-width="2.5"/>'
    + '<circle cx="65" cy="40" r="12" fill="none" stroke="#868e96" stroke-width="2.5" '
    + 'stroke-linecap="round" stroke-dasharray="19 57">'
    + '<animateTransform attributeName="transform" type="rotate" from="0 65 40" to="360 65 40" dur="0.75s" repeatCount="indefinite"/>'
    + '</circle></svg>',
)}`;

const props = defineProps<{
  src: string;
  imgClass?: string;
}>();

const elRef = ref<HTMLImageElement | null>(null);
const hasEnteredView = ref(false);

const displaySrc = computed(() =>
  hasEnteredView.value ? props.src : LOADING_PLACEHOLDER,
);

function findListboxScrollRoot(el: HTMLElement): Element | null {
  const menu = el.closest('.vs__dropdown-menu');
  if (menu) {
    return menu;
  }
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    const st = window.getComputedStyle(node);
    const oy = st.overflowY;
    if (
      (oy === 'auto' || oy === 'scroll' || oy === 'overlay')
      && node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

let observer: IntersectionObserver | null = null;

onMounted(() => {
  const el = elRef.value;
  if (!el) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    hasEnteredView.value = true;
    return;
  }

  const root = findListboxScrollRoot(el);

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          hasEnteredView.value = true;
          observer?.disconnect();
          observer = null;
          return;
        }
      }
    },
    {
      root: root ?? null,
      rootMargin: '80px 0px',
      threshold: 0,
    },
  );
  observer.observe(el);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>
