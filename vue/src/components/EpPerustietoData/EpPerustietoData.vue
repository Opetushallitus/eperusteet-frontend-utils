<template>
  <div class="data-content d-flex">
    <div class="pr-3">
      <EpMaterialIcon>{{ icon }}</EpMaterialIcon>
    </div>
    <div>
      <div class="topic">
        <h4 class="mb-1">
          <slot name="header">
            {{ topic }}
          </slot>
        </h4>
      </div>
      <div><slot></slot></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMaterialIcon,
  },
})
export default class EpPerustietoData extends Vue {
  @Prop({ required: true })
  private icon!: string;

  @Prop({ required: false })
  private topic!: string;
}
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

  .icon {
    color: $blue-lighten-6;
    vertical-align: top;
    font-size: 22px;
  }

</style>
