<template>
  <div>
    <b-pagination v-model="currentPage"
                  class="mt-4"
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { nextTick } from 'vue/types/umd';

@Component
export default class EpBPagination extends Vue {
  @Prop({ required: true, default: 1 })
  private value!: number;

  @Prop({ required: true })
  private itemsPerPage!: number;

  @Prop({ required: true })
  private total!: number;

  @Prop({ required: false })
  private ariaControls?: string;

  async mounted() {
    this.fixButtonRoles();
  }

  async fixButtonRoles() {
    const buttons = this.$el.querySelectorAll('button');
    if (buttons) {
      buttons.forEach((button) => {
        button.setAttribute('role', 'navigation');
        button.setAttribute('tabindex', '0');
      });
    }
  }

  get currentPage() {
    return this.value;
  }

  set currentPage(value) {
    this.$emit('input', value);
  }

  @Watch('value')
  async onPageChange() {
    await this.$nextTick();
    this.fixButtonRoles();
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
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

::v-deep .page-item.disabled{
  color: $disabled;
  opacity: 0.5;
}

</style>
