<template>
  <div class="spinner">
    <ep-spinner v-if="isLoading" />
    <slot v-else />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-facing-decorator';
import EpSpinner from './EpSpinner.vue';

@Component({
  components: {
    EpSpinner,
  },
})
export default class EpSpinnerSlot extends Vue {
  @Prop({ required: true, type: Boolean })
  private isLoading!: boolean;
}
</script>

<style>
</style>
