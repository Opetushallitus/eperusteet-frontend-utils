<template>
  <ep-main-view :container="true" class="mt-5" v-if="tiedotteet">
    <template slot="header">
      <div class="d-flex justify-content-between align-items-center flex-wrap">
        <h1>{{ $t('tiedotteet') }}</h1>
        <ep-linkki
          :url="url"
          v-oikeustarkastelu="{ oikeus: 'hallinta', kohde: 'pohja' }"
          icon="plussa">
          <span class="ml-1 link-text">{{ $t('lisaa-tiedote') }}</span>
        </ep-linkki>
      </div>
    </template>

    <div class="row align-items-end mb-4">
      <div class="col-4">
        <slot name="search"></slot>
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
      <slot name="pagination"></slot>
    </template>

  </ep-main-view>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Vue, Component } from 'vue-property-decorator';

import EpMainView from '../EpMainView/EpMainView.vue';
import EpSearch from '../forms/EpSearch.vue';
import EpContentReadMore from '../EpContentReadMore/EpContentReadMore.vue';
import EpLinkki from '../EpLinkki/EpLinkki.vue';

import { Kielet } from '../../stores/kieli';

import { TiedoteDto } from '../../tyypit';

@Component({
  components: {
    EpMainView,
    EpSearch,
    EpContentReadMore,
    EpLinkki,
  },
})
export default class EpTiedoteView extends Vue {
  @Prop({ required: true })
  private tiedotteet!: TiedoteDto;

  get sisaltoKieli() {
    return Kielet.getSisaltoKieli.value || null;
  }

  get url() {
    return `/eperusteet-app/uusi/#/${this.sisaltoKieli}/tiedotteet`;
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

::v-deep .linkki a {
  display: flex;
}

::v-deep .fa-plussa {
  height: 24px;
  width: 24px;
  border-radius: 100%;
  margin: 0;
  padding: .2rem;
  color: #fff;
  background-color: #3367E3;
}

.link-text {
  font-size: 1rem;
  color: $black;
}
</style>
