<template>
<div class="kayttaja">
  <b-nav-item-dropdown id="kayttaja-dropdown" right>
    <template slot="button-content">
      <span class="kielivalitsin">{{ esitysnimi }}</span>
    </template>

    <b-dropdown-group id="kayttaja-dropdown-group-1" :header="$t('kieli') + ': ' + uiKieli">
      <b-dropdown-item-button @click="valitseUiKieli(kieli)"
                              v-for="kieli in sovelluksenKielet"
                              :key="kieli"
                              :disabled="kieli === uiKieli">{{ kieli }}</b-dropdown-item-button>
    </b-dropdown-group>

    <b-dropdown-divider />

    <b-dropdown-group id="kayttaja-dropdown-group-2" :header="$t('toiminnot')">
      <b-dropdown-item href="/virkailijan-tyopoyta/">{{ $t('palaa-virkailijan-tyopyodalle') }}</b-dropdown-item>
      <b-dropdown-item href="/service-provider-app/saml/logout">{{ $t('kirjaudu-ulos') }}</b-dropdown-item>
    </b-dropdown-group>
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


@Component
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
}
</style>

