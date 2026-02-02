<template>
  <div class="ep-steps">
    <div
      v-if="steps.length > 1"
      class="steps d-flex justify-content-center mr-5 ml-5 mb-5"
    >
      <div
        v-for="(step, idx) in steps"
        :key="step.key"
        role="button"
        class="text-center step"
        @click="stepIdx = idx"
      >
        <div
          v-if="steps.length > 1"
          class="connection"
          :class="{ left: idx === steps.length - 1, right: idx === 0 }"
        />
        <div class="p-4">
          <div
            class="d-inline-block"
            :class="{ ball: true, active: idx <= stepIdx }"
          >
            {{ idx + 1 }}
          </div>
          <div :class="{ name: true, active: idx === stepIdx }">
            {{ step.name }}
          </div>
        </div>
      </div>
    </div>

    <h2 class="heading">
      {{ currentStep.name }}
    </h2>
    <p
      v-if="currentStep.description"
      class="description"
      v-html="currentStep.description"
    />

    <div>
      <slot :name="currentStep.key" />
    </div>

    <div class="clearfix">
      <div class="float-right mt-5">
        <ep-button
          variant="link"
          @click="cancel"
        >
          {{ $t('peruuta') }}
        </ep-button>
        <ep-button
          v-if="stepIdx > 0"
          variant="link"
          @click="previous"
        >
          {{ $t('edellinen') }}
        </ep-button>
        <ep-button
          v-if="stepIdx < steps.length - 1"
          :disabled="!currentValid"
          @click="next"
        >
          {{ $t('seuraava') }}
        </ep-button>
        <ep-button
          v-else
          :disabled="!currentValid"
          :show-spinner="saving"
          @click="saveImpl"
        >
          <slot name="luo">
            {{ $t('tallenna') }}
          </slot>
        </ep-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, PropType } from 'vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import _ from 'lodash';

export interface Step {
  key: string;
  name: string;
  description: string;
  isValid?: () => boolean;
  onNext?: () => void;
}

const props = defineProps({
  steps: {
    type: Array as () => Step[],
    required: true,
  },
  initialStep: {
    type: Number,
    default: 0,
  },
  onSave: {
    type: Function as PropType<() => Promise<void>>,
    required: true,
  },
});

const emit = defineEmits(['stepChange', 'cancel']);

const stepIdx = ref(props.initialStep);
const saving = ref(false);

watch(() => props.initialStep, (value) => {
  stepIdx.value = value;
});

const currentStep = computed(() => {
  return props.steps[stepIdx.value];
});

watch(currentStep, (newVal) => {
  emit('stepChange', newVal);
}, { immediate: true });

const currentValid = computed(() => {
  if (currentStep.value.isValid) {
    return currentStep.value.isValid();
  }
  return true;
});


async function saveImpl() {
  const isValid = _.last(props.steps)?.isValid;
  if (isValid && !isValid()) {
    return;
  }
  saving.value = true;
  try {
    await props.onSave();
  }
  finally {
    saving.value = false;
  }
}

function previous() {
  stepIdx.value--;
}

function next() {
  if (!currentStep.value.isValid || currentStep.value.isValid()) {
    if (currentStep.value.onNext) {
      currentStep.value.onNext();
    }
    stepIdx.value++;
  }
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

.ep-steps {

  .steps {
    color: #767676;

    .step {
      user-select: none;
      cursor: pointer;

      .ball {
        padding: 1px 9px;
        margin-bottom: 10px;
        border-radius: 100%;
        position: relative;
        z-index: 10;
        border-color: $gray-lighten-3;
        border-style: solid;
        border-width: 2px;
        background-color: $white;
        color: $gray-lighten-2;

        &.active {
          background-color: $blue-lighten-5;
          border-color: $blue-lighten-5;
          color: $white;
          border-width: 2px;
        }
      }

      .active:not(.ball) {
        font-weight: 600;
        color: black;
      }

      .connection {
        border-top: 2px solid $gray-lighten-3;
        position: relative;
        width: 100%;
        top: 40px;
        z-index: 1;

        &.right {
          width: 50%;
          left: 50%;
        }

        &.left {
          width: 50%;
        }
      }

    }
  }

}

</style>
