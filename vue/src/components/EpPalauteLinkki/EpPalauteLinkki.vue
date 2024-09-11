<template>
  <div class="d-flex" v-if="yllapitoValue">
    <EpMaterialIcon>chevron_right</EpMaterialIcon>
    <EpExternalLink :url="url" iconRight>
      {{ $t('anna-palautetta') }}
    </EpExternalLink>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Maintenance } from '@shared/api/eperusteet';
import { BrowserStore } from '@shared/stores/BrowserStore';

@Component
export default class EpPalauteLinkki extends Vue {
  @Prop({ required: true })
  private yllapitoAvain!: string;

  private yllapitoValue: string | null = null;

  async mounted() {
    try {
      this.yllapitoValue = (await Maintenance.getYllapito(this.yllapitoAvain)).data;
    }
    catch (e) {
      this.yllapitoValue = null;
    }
  }

  get url() {
    return this.yllapitoValue + '/?ref=' + encodeURIComponent(this.browserLocationHref);
  }

  get browserLocationHref() {
    return BrowserStore.location.href;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
