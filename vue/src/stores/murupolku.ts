import { defineStore } from 'pinia';
import _ from 'lodash';
import { Location } from 'vue-router';
import { ref, computed } from 'vue';

export const useMurupolkuStore = defineStore('murupolku', () => {
  // State as refs
  const polku = ref<{ [avain: string]: any }>({});

  // Getters as computed
  const murut = computed(() => {
    return {
      ...polku.value,
    };
  });

  // Actions as functions
  function aseta(key: string, value: any, location?: Location) {
    polku.value = {
      ...polku.value,
      [key]: {
        name: value,
        location,
      },
    };
  }

  function tyhjenna() {
    polku.value = {};
  }

  return {
    polku,
    murut,
    aseta,
    tyhjenna,
  };
});

// For backwards compatibility
export const Murupolku = {
  aseta: (key: string, value: any, location?: Location) => {
    const store = useMurupolkuStore();
    store.aseta(key, value, location);
  },
  tyhjenna: () => {
    const store = useMurupolkuStore();
    store.tyhjenna();
  },
  get murut() {
    const store = useMurupolkuStore();
    return store.murut;
  },
};
