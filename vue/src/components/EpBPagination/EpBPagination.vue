<template>
  <div>
    <b-pagination v-model="currentPage"
                  class="mt-4"
                  @change="updatePage"
                  :total-rows="totalPages"
                  :per-page="perPage"
                  align="center"
                  :aria-controls="controls"
                  :first-text="$t('alkuun')"
                  :last-text="$t('loppuun')"
                  prev-text="«"
                  next-text="»"
                  :label-first-page="$t('alkuun')"
                  :label-last-page="$t('loppuun')"
                  :label-page="$t('sivu')"
                  :label-next-page="$t('seuraava-sivu')"
                  :label-prev-page="$t('edellinen-sivu')"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class EpBPagination extends Vue {
  @Prop({ required: true, default: 1 })
  private value!: number;

  @Prop({ required: true })
  private itemsPerPage!: number;

  @Prop({ required: true })
  private total!: number;

  @Prop({ required: false })
  private ariaControls?: string;

  get currentPage() {
    return this.value;
  }

  set currentPage(value) {
  }

  get controls() {
    return this.ariaControls;
  }

  get perPage() {
    return this.itemsPerPage;
  }

  get totalPages() {
    return this.total;
  }

  private updatePage(value) {
    this.$emit('pageChanged', value);
  }
}
</script>

<style scoped>
</style>
