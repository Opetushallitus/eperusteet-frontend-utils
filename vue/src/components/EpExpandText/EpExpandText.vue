<template>
  <span
    class="ep-expand-text"
    :class="{'clickable pointer': !isExpanded}"
    @click="toggleExpanded"
  >
    {{ truncated }}
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import * as _ from 'lodash';

const props = defineProps({
  text: { type: String, required: true },
  shortLength: { type: Number, default: 150 },
});

const expanded = ref(false);

const toggleExpanded = () => {
  expanded.value = !expanded.value;
};

const isExpanded = computed(() => {
  return expanded.value || props.text.length <= props.shortLength;
});

const truncated = computed(() => {
  if (isExpanded.value) {
    return props.text;
  }
  return _.truncate(props.text, { length: props.shortLength });
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
