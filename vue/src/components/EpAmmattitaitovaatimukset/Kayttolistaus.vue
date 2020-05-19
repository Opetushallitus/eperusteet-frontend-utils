<template>
  <div>
    <b-button :id="id" variant="link">
      <fas icon="info" />
    </b-button>
    <b-popover
      :target="id"
      :triggers="triggers"
      ref="kaytossa"
      @shown="shown"
      :title="$t('kaytossa-toisaalla')">

      <ep-spinner v-if="isLoading" />
      <div v-else-if="data && data.data.length > 0" class="listaus">
        <div class="info">
          {{ $t('loytyi-tutkinnon-osaa', { amount: data.kokonaismäärä }) }}
        </div>
        <div v-for="item in data.data" class="kaytetty">
          <div>
            {{ $kaanna(item.peruste.nimi) }}:
          </div>
          <div>
            {{ $kaanna(item.tutkinnonOsa.nimi) }}
          </div>
        </div>
        <EpPagination :value="page"
                      :per-page="perPage"
                      :total-rows="data.kokonaismäärä" 
                      @input="fetch" />
      </div>
      <div class="ei-hakutuloksia" v-else>
        {{ $t('ei-hakutuloksia') }}
      </div>
    </b-popover>
  </div>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'vue-property-decorator';
import EpPagination from '../EpPagination/EpPagination.vue';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import { Ammattitaitovaatimukset, Ammattitaitovaatimukset2019Dto, Koodisto } from '../../api/eperusteet';
import { KoodistoSelectStore } from '@shared/components/EpKoodistoSelect/KoodistoSelectStore';

import { BrowserStore } from '../../stores/BrowserStore';
import { metadataToLocalized } from '../../utils/perusteet';
import { delay } from '@shared/utils/delay';
import _ from 'lodash';


@Component({
  components: {
    EpPagination,
    EpSpinner,
  },
})
export default class VaatimusField extends Vue {
  @Prop({ required: true })
  private koodi!: any;

  private isLoading = true;
  private data: any = null;
  private page = 1;
  private perPage = 8;

  get id() {
    return _.uniqueId('koodidialogi_');
  }

  async fetch(page = this.page) {
    const res = await Ammattitaitovaatimukset.getTutkinnonOsatByAmmattitaitovaatimus(
      page - 1,
      this.perPage,
      this.koodi.uri,
      true);
    this.page = page;
    this.data = res.data;
  }

  async shown() {
    this.isLoading = true;
    this.data = null;
    try {
      if (this.koodi?.uri) {
        await this.fetch();
      }
    }
    finally {
      this.isLoading = false;
    }
  }

  get triggers() {
    return "hover click blur";
  }

}
</script>

<style scoped lang="scss">
.listaus {
  margin-top: 6px;
  
  .info {
    margin-bottom: 10px;
  }
}

.kaytetty {
  padding: 10px 6px 10px 2px;

  &:nth-child(odd) {
    background: #f5f5f5;
  }
}
</style>

