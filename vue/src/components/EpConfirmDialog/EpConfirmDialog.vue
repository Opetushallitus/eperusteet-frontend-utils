<template>
  <div>
    <b-modal
      id="epConfirmDialog"
      ref="epConfirmDialogModal"
      v-model="visible"
      size="lg"
      @ok="cancelSave"
    >
      <template #modal-title>
        {{ $t('haluatko-poistua-tallentamatta') }}
      </template>

      <span>{{ $t('poistumisen-varmistusteksti-dialogi') }}</span>

      <template #modal-cancel>
        {{ $t('peruuta') }}
      </template>
      <template #modal-ok>
        {{ $t('poistu-tallentamatta') }}
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue, Mixins } from 'vue-property-decorator';
import _ from 'lodash';

@Component({ name: 'EpConfirmDialog' })
export default class EpConfirmDialog extends Vue {
  @Prop({ required: true })
  private redirect!: Function;

  @Prop({ required: true })
  private ctrls!: any;

  private visible: boolean = false;

  setVisible() {
    this.visible = true;
  }

  async cancelSave() {
    await this.ctrls.cancel();
    this.redirect();
  }
}
</script>

<style scoped lang="scss">

</style>
