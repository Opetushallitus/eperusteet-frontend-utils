import { defineStore } from 'pinia';
import { SovellusVirhe } from '../tyypit';
import { ref, computed } from 'vue';

export type ErrorHandler = (virhe: SovellusVirhe) => Promise<void> | void;

export const useVirheStore = defineStore('virhe', () => {
  // State as refs
  const onErrorHandlers = ref<ErrorHandler[]>([]);
  const virheet = ref<SovellusVirhe[]>([]);

  // Actions as functions
  async function lisaaVirhe(virhe: SovellusVirhe) {
    virheet.value = [...virheet.value, virhe];
    for (const handler of onErrorHandlers.value) {
      handler(virhe);
    }
  }

  function onError(handler: ErrorHandler) {
    onErrorHandlers.value.push(handler);
  }

  function clearVirheet() {
    virheet.value = [];
  }

  return {
    virheet,
    onErrorHandlers,
    lisaaVirhe,
    onError,
    clearVirheet,
  };
});

// For backwards compatibility
export const Virheet = {
  lisaaVirhe: async (virhe: SovellusVirhe) => {
    const store = useVirheStore();
    await store.lisaaVirhe(virhe);
  },
  onError: (handler: ErrorHandler) => {
    const store = useVirheStore();
    store.onError(handler);
  },
  clearVirheet: () => {
    const store = useVirheStore();
    store.clearVirheet();
  },
  virheet: () => {
    const store = useVirheStore();
    return store.virheet;
  },
};
