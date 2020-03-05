<template>
<div class="kayttaja">
  <b-nav-item-dropdown id="kayttaja-dropdown" right>
    <template slot="button-content">
      <span class="kielivalitsin">{{ esitysnimi }}</span>
    </template>
    <ep-collapse :expanded-by-default="false">
      <div slot="header" class="pl-3 py-2 text-nowrap kieli">
        <fas fixed-width icon="kielet" class="mr-3" />
        {{ $t('kieli') + ': ' + $t(uiKieli) }}
      </div>

      <template slot="icon" slot-scope="{ toggled }">
        <div class="ml-auto align-self-start px-3 py-2">
          <fas fixed-width icon="chevron-up" v-if="toggled" />
          <fas fixed-width icon="chevron-down" v-else />
        </div>
      </template>

      <div class="kielet">
        <b-dd-item-button @click="valitseUiKieli(kieli)"
                                v-for="kieli in sovelluksenKielet"
                                :key="kieli"
                                :disabled="kieli === uiKieli">
          <fas fixed-width icon="checkmark" v-if="kieli === uiKieli" class="mr-3 valittu" />
          {{ $t(kieli) }}
        </b-dd-item-button>
      </div>
    </ep-collapse>

    <b-dd-item href="/henkilo-ui/omattiedot">
      <fas fixed-width icon="user" class="mr-3" /> {{ $t('kayttajan-asetukset') }}
    </b-dd-item>

    <b-dd-item href="/virkailijan-tyopoyta">
      <fas fixed-width icon="ulkoinen-linkki" class="mr-3"/> {{ $t('palaa-virkailijan-tyopyodalle') }}
    </b-dd-item>

    <b-dd-divider />

    <b-dd-item href="/service-provider-app/saml/logout">
      <fas fixed-width icon="kirjaudu-ulos" class="mr-3" /> {{ $t('kirjaudu-ulos') }}
    </b-dd-item>

  </b-nav-item-dropdown>
</div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Prop, Component, Vue } from 'vue-property-decorator';

import { Kielet, UiKielet } from '../../stores/kieli';
import { Kieli } from '../../tyypit';
import { KayttajanTietoDto } from '../../../../../src/tyypit';
import { parsiEsitysnimi } from '../../../../../src/stores/kayttaja';

import EpCollapse from '../EpCollapse/EpCollapse.vue';

@Component({
  components: {
    EpCollapse,
  }
})
export default class EpKayttaja extends Vue {
  @Prop({ required: true })
  private tiedot!: KayttajanTietoDto;

  get esitysnimi() {
    return parsiEsitysnimi(this.tiedot);
  }

  get sovelluksenKielet() {
    return UiKielet;
  }

  get uiKieli() {
    return Kielet.getUiKieli;
  }

  private valitseUiKieli(kieli: Kieli) {
    const router = this.$router;
    const current: any = router.currentRoute;
    Kielet.setUiKieli(kieli);
    const next = {
      ...current,
      params: {
        ...current.params,
        lang: kieli || this.$i18n.fallbackLocale,
      },
    };
    router.push(next).catch(_.noop);
  }
}
</script>

<style scoped lang="scss">
.kayttaja {
  .kielivalitsin {
    color: white;
  }

  .kieli {
    font-weight: 400;
  }

  .kielet {
    background-color: #F3F3F3;
    text-align: right;

    /deep/ .dropdown-item {
      padding: 0.25rem 1rem;
    }

    .valittu {
      color: #3467E3;
      vertical-align: -0.25em;
    }
  }

  /deep/ .dropdown-menu {
    padding: 0;
    color: #000000;
  }

  /deep/ .dropdown-divider {
    margin: 0;
  }

  /deep/ .dropdown-item {
    padding: 0.5rem 1rem;
    color: #000000;
  }

  /deep/ .dropdown-item:disabled {
    color: inherit;
  }

  /deep/ .dropdown-item:hover {
    background-color: inherit;
  }

  /deep/ .dropdown-item:active {
    color: inherit;
    background-color: inherit;
  }
}
</style>
