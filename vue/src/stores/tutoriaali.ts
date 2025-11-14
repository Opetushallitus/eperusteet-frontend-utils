import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import _ from 'lodash';

export const useTutoriaaliStore = defineStore('tutoriaali', () => {
  // State
  const avaimet = ref<string[]>([]);
  const index = ref(0);
  const active = ref(false);

  // Getters
  const seuraavaAvain = computed(() => avaimet.value[index.value + 1]);
  const current = computed(() => avaimet.value[index.value]);
  const hasSeuraava = computed(() => index.value + 1 < _.size(avaimet.value));
  const hasEdellinen = computed(() => index.value > 0);
  const isActive = computed(() => active.value);

  // Actions
  function seuraava() {
    index.value = index.value + 1;
  }

  function edellinen() {
    index.value = index.value - 1;
  }

  const paivitaAvaimet = _.debounce(() => {
    const uudetAvaimet: string[] = [];
    document.querySelectorAll('[tutorial]').forEach(el => {
      const elId = el.getAttribute('id');
      if (elId) {
        uudetAvaimet.push(elId);
      }
    });

    avaimet.value = uudetAvaimet;
  }, 100);

  function setActive(isActive: boolean) {
    index.value = 0;
    active.value = isActive;
  }

  return {
    // State
    avaimet,
    index,
    active,

    // Getters
    seuraavaAvain,
    current,
    hasSeuraava,
    hasEdellinen,
    isActive,

    // Actions
    seuraava,
    edellinen,
    paivitaAvaimet,
    setActive,
  };
});
