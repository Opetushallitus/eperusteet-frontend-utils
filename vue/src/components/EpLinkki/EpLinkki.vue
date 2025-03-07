<template>
  <div class="linkki">
    <a :href="url"
      rel="noopener noreferrer"
      target="_blank">
      <EpMaterialIcon
        v-if="icon && !iconRight"
        class="mr-1"
        size="18px"
        :alt="$t('avautuu-uuteen-valilehteen')">
        {{ icon }}
      </EpMaterialIcon>
      <slot v-if="hasSlot()"></slot>
      <span v-else>{{ cleanUrl }}</span>
      <EpMaterialIcon
        v-if="icon && iconRight"
        class="ml-1"
        size="18px"
        :alt="$t('avautuu-uuteen-valilehteen')">
        {{ icon }}
      </EpMaterialIcon>
    </a>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMaterialIcon,
  },
})
export default class EpLinkki extends Vue {
  @Prop({ required: true, type: String })
  private url!: string;

  @Prop({
    required: false,
    type: String,
  })
  private label!: string;

  @Prop({ default: '', type: String })
  private icon!: string;

  @Prop({
    default: true,
    type: Boolean,
  })
  private onlyTopLevel!: boolean;

  @Prop({
    default: false,
    type: Boolean,
  })
  private iconRight!: boolean;

  hasSlot() {
    return !!this.$slots.default;
  }

  get cleanUrl() {
    let result = this.url
      ? (this.url.replace(/^https?:\/\//, ''))
      : '';

    result = result.replace(/^mailto?:/, '');

    if (this.onlyTopLevel) {
      const idx = result.indexOf('/');
      if (idx > 0) {
        result = result.substr(0, idx);
      }
    }
    return result;
  }
}
</script>

<style scoped lang="scss">

.linkki {
  a {
    display: inline;
  }
}

// Käytetään external linkin kanssa
.linkki.medium {
  font-size: 1rem;

  a {
    white-space: normal; // Saattaa olla liian pitkä
  }
}
</style>
