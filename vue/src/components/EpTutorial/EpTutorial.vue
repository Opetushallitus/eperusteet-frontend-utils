<template>
  <div v-if="show">
    <div class="tutorial-bg" />
    <b-popover
      v-if="current"
      :key="current"
      show
      :target="current"
      placement="bottom"
      custom-class="tutorial-popover"
    >
      <div class="tutorial-popover-content">
        {{ $t('tutorial-' + current) }}
      </div>
      <div class="tutorial-popover-buttons">
        <ep-button
          class="mr-5"
          variant="link"
          size="sm"
          @click="suljeTutoriaali"
        >
          {{ $t('poistu') }}
        </ep-button>

        <div class="float-right">
          <ep-button
            v-if="hasEdellinen"
            class="ml-2"
            size="sm"
            @click="edellinen"
          >
            {{ $t('edellinen') }}
          </ep-button>

          <ep-button
            v-if="hasSeuraava"
            class="float-right ml-2"
            size="sm"
            @click="seuraava"
          >
            {{ $t('seuraava') }}
          </ep-button>
        </div>
      </div>
    </b-popover>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import { TutoriaaliStore } from '@shared/stores/tutoriaali';

const props = defineProps({
  tutoriaalistore: {
    type: Object as () => TutoriaaliStore,
    required: true,
  },
});

const suljeTutoriaali = () => {
  props.tutoriaalistore.setActive(false);
};

const show = computed(() => {
  return props.tutoriaalistore.isActive;
});

const current = computed(() => {
  return props.tutoriaalistore.current;
});

const hasSeuraava = computed(() => {
  return props.tutoriaalistore.hasSeuraava;
});

const hasEdellinen = computed(() => {
  return props.tutoriaalistore.hasEdellinen;
});

const seuraava = () => {
  props.tutoriaalistore.seuraava();
};

const edellinen = () => {
  props.tutoriaalistore.edellinen();
};

const muutaTyyli = (val: string | undefined, oldVal: string | undefined) => {
  if (oldVal) {
    const oldEl = document.getElementById(oldVal);
    if (oldEl) {
      oldEl.classList.remove('tutorial-highlight');
    }
  }

  if (val && show.value) {
    const el = document.getElementById(val);
    if (el) {
      el.classList.add('tutorial-highlight');
    }
  }
};

// Watch for changes in show
watch(() => show.value, (val, oldVal) => {
  if (val) {
    props.tutoriaalistore.paivitaAvaimet();
    muutaTyyli(current.value, undefined);
  }
  else {
    muutaTyyli(undefined, current.value);
  }
});

// Watch for changes in current
watch(() => current.value, (val, oldVal) => {
  muutaTyyli(val, oldVal);
});
</script>

<style scoped lang="scss">
.tutorial-bg {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5000;
}

.tutorial-popover {
  z-index: 10001;
}

:global(.tutorial-highlight) {
  z-index: 10000;
  position: relative;
  animation: pulsate 2s ease-out;
  animation-iteration-count: infinite;
}

@keyframes pulsate {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 0 30px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

.tutorial-popover-content {
  margin-bottom: 16px;
}
</style>
