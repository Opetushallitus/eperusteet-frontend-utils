<template>
  <div class="wrapper mb-3 pt-2 pb-4">
    <slot name="preHeading" />
    <slot name="heading" />
    <div class="content">
      <div
        :class="{'limited-content': showReadMore && !readMore}"
        v-html="$kaannaOlioTaiTeksti(content)"
      />
      <button
        v-if="showReadMore"
        class="read-more"
        @click="onReadMore"
      >
        {{ readMore ? $t('nayta-vahemman') : $t('lue-lisaa') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import _ from 'lodash';
import { Kielet } from '../../stores/kieli';

const props = defineProps({
  charLimit: {
    type: Number,
    default: 400,
  },
  content: {
    type: [String, Object],
    required: true,
  },
});

const readMore = ref(false);

const onReadMore = () => {
  readMore.value = !readMore.value;
};

const showReadMore = computed(() => {
  return Kielet.kaannaOlioTaiTeksti(props.content).length > props.charLimit;
});
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

.wrapper {
  border-bottom: 2px solid $gray-lighten-10;

  > p {
    color: $gray-lighten-1;
    font-size: 0.85rem;
  }
}

.read-more {
  appearance: none;
  border: 0;
  background: none;
  padding: 0;
  margin: 0;
  color: $blue-lighten-5;
  outline: none;
  text-transform: lowercase;

  &:focus,
  &:hover {
    text-decoration: underline;
  }
}

.content {
  ::v-deep p:last-of-type {
    display: inline;
    margin-right: 0.5rem;
  }

  .limited-content {
    max-height:90px;
    overflow: hidden;
    position: relative;
  }

  .limited-content:after {
    content: "";
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: 0;
    pointer-events: none;
    background-image: linear-gradient(to bottom,
                      rgba(255,255,255, 0),
                      rgba(255,255,255, 1) 90%);
    width: 100%;
    height: 4em;
  }
}
</style>
