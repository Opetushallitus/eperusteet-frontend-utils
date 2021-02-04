<template>
  <ep-main-view :container="true" class="mt-5">
    <template slot="header">
      <div class="d-flex justify-content-between align-items-center">
        <h1>{{ $t('tiedotteet') }}</h1>
        <ep-linkki
          :url="url"
          v-oikeustarkastelu="{ oikeus: 'hallinta', kohde: 'pohja' }">
          <div class="d-flex">
            <span class="icon">
              <fas icon="plussa"></fas>
            </span>
            <span class="ml-2 link-text">{{ $t('lisaa-tiedote') }}</span>
          </div>
        </ep-linkki>
      </div>
    </template>

    <div class="row align-items-end mb-4">
      <div class="col-4">
        <ep-search v-model="nimiFilter" @input="nimiFilterChanged" :is-loading="isLoading" />
      </div>
    </div>

    <template v-if="tiedotteet">
      <ep-content-read-more
        v-for="tiedote in tiedotteet"
        :key="tiedote.id"
        :content="tiedote.sisalto">
        <template #preHeading>
          <p>{{ $sdt(tiedote.luotu) }}</p>
        </template>
        <template #heading>
          <h2 class="font-weight-normal">{{ $kaanna(tiedote.otsikko) }}</h2>
        </template>
      </ep-content-read-more>
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        @change="pageChanged"
        align="center" />
    </template>

  </ep-main-view>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Vue, Component, Watch } from 'vue-property-decorator';

import EpMainView from '../EpMainView/EpMainView.vue';
import EpSearch from '../forms/EpSearch.vue';
import EpTiedoteModal from '../EpTiedoteModal/EpTiedoteModal.vue';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpButton from '../EpButton/EpButton.vue';
import EpContentReadMore from '../EpContentReadMore/EpContentReadMore.vue';
import EpLinkki from '../EpLinkki/EpLinkki.vue';

import { Kielet } from '../../stores/kieli';
import { TiedoteViewStore } from './TiedoteViewStore';

@Component({
  components: {
    EpMainView,
    EpSearch,
    EpTiedoteModal,
    EpSpinner,
    EpButton,
    EpContentReadMore,
    EpLinkki,
  },
})
export default class EpTiedoteView extends Vue {
  private nimiFilter = '';
  private currentPage = 1;
  private tiedoteViewStore = new TiedoteViewStore();

  @Prop({ required: false })
  private tiedoteJulkaisuPaikka!: string;

  @Watch('sisaltoKieli', { immediate: true })
  async onSisaltoKieliChange(newValue: string, oldValue: string) {
    if (newValue && newValue !== oldValue) {
      this.currentPage = 1;
      this.tiedoteViewStore.changeLang(newValue);
    }
  }

  async mounted() {
    this.tiedoteViewStore.init({
      sivu: this.currentPage - 1,
      sivukoko: 10,
      ...this.tiedoteJulkaisuPaikka && {
        tiedoteJulkaisuPaikka: [this.tiedoteJulkaisuPaikka],
      },
    });
  }

  nimiFilterChanged(value) {
    this.nimiFilter = value;
    this.tiedoteViewStore.changeNimiFilter(this.nimiFilter);
  }

  pageChanged(value) {
    this.currentPage = value;
    this.tiedoteViewStore.changePage(this.currentPage - 1);
  }

  get sisaltoKieli() {
    return Kielet.getSisaltoKieli.value || null;
  }

  get perPage() {
    return this.tiedoteViewStore.options.value?.sivukoko;
  }

  get totalRows() {
    return this.tiedoteViewStore.kokonaismaara.value;
  }

  get tiedotteet() {
    return this.tiedoteViewStore.tiedotteet.value;
  }

  get isLoading() {
    return this.tiedoteViewStore.isLoading.value;
  }

  get url() {
    return `/eperusteet-app/uusi/#/${this.sisaltoKieli}/tiedotteet`;
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  width: 24px;
  border-radius: 100%;
  margin: 0;
  padding: 0;
  color: #fff;
  background-color: #3367E3;
}

.link-text {
  font-size: 1rem;
  color: $black;
}
</style>
