<template>
  <div>
    <fas :class="tyyppi" :icon="icon" fixed-width />
    <span class="pl-2"><slot /></span>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class IkoniTeksti extends Vue {
  @Prop({ required: true })
  private tyyppi!: 'virhe' | 'huomautus' | 'kaikki-kunnossa';

  get icon() {
    if (this.tyyppi === 'kaikki-kunnossa') {
      return 'checkmark-ympyra';
    }

    return 'huutomerkki-ympyra';
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .virhe {
    color: $red;
  }

  .huomautus {
    color: $yellow;
  }

  .kaikki-kunnossa {
    color: $green;
  }

</style>
