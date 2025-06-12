<template>
  <div class="tile">
    <!-- Todo: Onko parempaa tapaa välittää slotit alikomponentille? -->
    <!-- router-link täytyy olla a, jotta navigointi onnistuu näppäimistöllä -->
    <router-link
      v-if="route"
      :to="route && route"
      custom
      v-slot="{ navigate }"
    >
      <a
        style="outline: none;"
        @click="navigate"
        @keypress.enter="navigate"
        @mouseover="effects.hover = true"
        @mouseleave="effects.hover = false"
        @focus="effects.focus = true"
        @blur="effects.focus = false"
      >
        <InnerTile
          :icon="icon"
          :color="color"
          :effects="effects"
          :count="count"
        >
          <template #fas>
            <slot name="fas" />
          </template>
          <template #header>
            <slot name="header" />
          </template>
          <template #content>
            <slot name="content" />
          </template>
        </InnerTile>
      </a>
    </router-link>
    <a
      v-else
      :href="href && href"
      rel="noopener noreferrer"
      target="_blank"
      style="outline: none;"
      @mouseover="effects.hover = true"
      @mouseleave="effects.hover = false"
      @focus="effects.focus = true"
      @blur="effects.focus = false"
    >
      <InnerTile
        :icon="icon"
        :color="color"
        :effects="effects"
        :count="count"
      >
        <template #header>
          <slot name="header" />
        </template>
        <template #content>
          <slot name="content" />
        </template>
      </InnerTile>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InnerTile from './InnerTile.vue';

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: null,
  },
  route: {
    type: [Object, String],
    default: null,
  },
  href: {
    type: String,
    default: null,
  },
  count: {
    type: Number,
    required: false,
  },
});

const effects = ref({
  hover: false,
  focus: false,
});
</script>

<style scoped lang="scss">

$tile-width: 540px;

.tile {
  width: $tile-width;
  margin: 15px 15px;
  text-align: center;
}

</style>
