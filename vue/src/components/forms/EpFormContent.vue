<template>
  <div class="mb-4 form-content">
    <div v-if="showHeader">
      <div v-if="name">
        <h3
          v-if="headerType === 'h3'"
          :class="headerClass"
        >
          {{ text }}
        </h3>
        <label v-else>
          {{ text }}</label>
      </div>
      <slot name="header" />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Kielet } from '@shared/stores/kieli';
import { useT, $t } from '@shared/utils/globals';

/**
 * Tämän komponentin tehtävä on ainoastaan esittää label lomakekentälle
 */

const props = defineProps({
  name: {
    type: String,
    required: false,
  },
  headerType: {
    type: String,
    required: false,
  },
  headerClass: {
    type: String,
    required: false,
  },
  showHeader: {
    type: Boolean,
    required: false,
    default: true,
  },
  kieli: {
    type: String,
    required: false,
  },
});

const sisaltoKieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const lang = ref(props.kieli ? props.kieli : sisaltoKieli.value);

watch(sisaltoKieli, () => {
  lang.value = props.kieli ? props.kieli : sisaltoKieli.value;
});

watch(() => props.kieli, (val) => {
  lang.value = val ? val : sisaltoKieli.value;
});

const text = computed(() => {
  return $t(props.name, lang);
});

</script>

<style scoped lang="scss">
.form-content {
  margin: 0 0 30px 0;

  label {
    font-weight: 600;
  }

  .h6 {
    font-weight: 600;
    font-size: 16px;
  }
}
</style>
