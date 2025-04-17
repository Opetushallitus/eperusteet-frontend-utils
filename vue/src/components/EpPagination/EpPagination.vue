<template>
  <div v-if="totalRows > 0">
    <div
      :aria-label="$t('sivutus')"
      class="d-flex align-items-center justify-content-center"
    >
      <div class="link-container">
        <b-button
          variant="link"
          :aria-label="$t('edellinen')"
          class="link"
          :class="{ 'muted': leftDisabled }"
          :disabled="leftDisabled"
          @click="setValue(modelValue - 1)"
        >
          <EpMaterialIcon>chevron_left</EpMaterialIcon>
        </b-button>
      </div>
      <div
        v-for="row in pages"
        :key="row"
        class="link-container"
      >
        <div v-if="row !== null">
          <b-button
            :class="{ 'active-link': row === modelValue }"
            :aria-label="$t('sivu') + ' ' + row"
            variant="link"
            class="link"
            @click="setValue(row)"
          >
            {{ row }}
          </b-button>
        </div>
        <div v-else>
          ...
        </div>
      </div>
      <div class="link-container">
        <b-button
          class="link"
          :aria-label="$t('seuraava')"
          variant="link"
          :class="{ 'muted': rightDisabled }"
          :disabled="rightDisabled"
          @click="setValue(modelValue + 1)"
        >
          <EpMaterialIcon>chevron_right</EpMaterialIcon>
        </b-button>
      </div>
    </div>
  </div>
  <div v-else>
    <slot name="empty" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EpButton from '../EpButton/EpButton.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import _ from 'lodash';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    required: true,
  },
  totalRows: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const count = computed(() => {
  return Math.ceil(props.totalRows / props.perPage);
});

const leftDisabled = computed(() => {
  return props.modelValue < 2;
});

const rightDisabled = computed(() => {
  return props.modelValue > count.value - 1;
});

const leftEllipsis = computed(() => {
  return props.modelValue - 1 > 1;
});

const rightEllipsis = computed(() => {
  return props.modelValue < count.value - 1;
});

const pages = computed(() => {
  if (count.value < 6) {
    return _.range(1, count.value + 1);
  }
  else {
    const result: (number | null)[] = [];
    if (!leftDisabled.value) {
      result.push(1);
    }
    if (leftEllipsis.value) {
      if (props.modelValue > 3) {
        result.push(null);
      }
      result.push(props.modelValue - 1);
    }
    result.push(props.modelValue);
    if (rightEllipsis.value) {
      result.push(props.modelValue + 1);
      if (props.modelValue < count.value - 2) {
        result.push(null);
      }
    }
    if (props.modelValue !== count.value) {
      result.push(count.value);
    }
    return result;
  }
});

const setValue = async (value: number) => {
  if (value > 0 && value <= count.value) {
    emit('update:modelValue', value);
  }
};
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

.link-container {
  margin: 0 0.05rem 0 0.05rem;

  .active-link {
    background: #3367e3;
    border-radius: 100%;
    color: #fff !important;
    font-weight: bold;
    height: 2em;
    padding-top: 0.2rem;
    width: 2em;

    &:active {
      background: none;
    }

  }

  .link {
    color: #4f4f4f;
  }

  .muted {
    color: #ccc;
  }

}

</style>
