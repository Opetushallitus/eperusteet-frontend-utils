<template>
  <div>
    <div
      v-for="(modelObject, index) in model"
      :key="'item'+index"
      class="row"
      :class="striped ? 'striped' : ''"
    >
      <slot
        :data="modelObject"
        :index="index"
      />
    </div>
    <div
      v-if="totalListLength > collapsedSize"
      class="nayta-btn"
      @click="toggleNaytaKaikki()"
    >
      <span v-html="naytaKaikki ? $t('nayta-vahemman') : $t('nayta-kaikki')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  collapsedSize: {
    type: Number,
    default: 3,
  },
  striped: {
    type: Boolean,
    default: false,
  },
});

const naytaKaikki = ref(false);

const model = computed(() => {
  return naytaKaikki.value ? props.modelValue : props.modelValue.slice(0, props.collapsedSize);
});

const totalListLength = computed(() => {
  return props.modelValue.length;
});

const toggleNaytaKaikki = () => {
  naytaKaikki.value = !naytaKaikki.value;
};
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.striped {
  &:nth-of-type(even) {
    background-color: $table-even-row-bg-color;
  }
  &:nth-of-type(odd) {
    background-color: $table-odd-row-bg-color;
  }
}
.row {
  padding: 0.5rem;
}

.nayta-btn {
  margin-top: 10px;
  color: #3367E3;
  font-weight: 600;
  cursor: pointer;
}
</style>
