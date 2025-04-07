<template>
  <div>
    <EpMaterialIcon
      :id="'infopopup-' + uniqueId"
      class="default-icon clickable"
      icon-shape="outlined"
    >
      info
    </EpMaterialIcon>
    <b-popover
      :target="'infopopup-' + uniqueId"
      triggers="hover click blur"
    >
      <slot />
    </b-popover>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMaterialIcon,
  },
})
export default class EpInfoPopover extends Vue {
  // Käytä komponentin proppina uniqueId:tä, jos EpInfoPopover on käytössä useamman kerran samassa komponentissa, jotta popover näytetään oikeassa ikonissa.
  @Prop({ required: false, default: '0' })
  uniqueId!: string;
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
