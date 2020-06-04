<template>
<div class="kayttaja">
  <b-nav-item-dropdown id="kayttaja-dropdown" right no-caret>
    <template slot="button-content">
      <div class="d-flex flex-row">
        <div class="kayttaja-valikko d-flex flex-column">
          <span class="kielivalitsin text-right">{{ esitysnimi }}</span>
          <small v-if="valittuKoulutustoimija" class="valittu-koulutustoimija text-right">{{ $kaanna(valittuKoulutustoimija.nimi) }}</small>
        </div>
        <fas fixed-width icon="chevron-down" class="mx-2 my-1" />
      </div>
    </template>

    <!-- Koulutustoimija -->
    <ep-collapse :expanded-by-default="false" v-if="valittuKoulutustoimija">
      <div slot="header">
        <div class="pl-3 pt-2 text-nowrap kieli">
          <fas fixed-width icon="ryhma" class="icon mr-3" />
          <span>{{ $t('organisaatio') }}</span>
        </div>
        <div class="pl-3">
          <span class="icon mr-3" />
          <small>{{ $kaanna(valittuKoulutustoimija.nimi) }}</small>
        </div>
      </div>

      <template slot="icon" slot-scope="{ toggled }">
        <div class="ml-auto align-self-start" style="padding: 0.8rem 1rem;">
          <fas fixed-width icon="chevron-up" v-if="toggled" />
          <fas fixed-width icon="chevron-down" v-else />
        </div>
      </template>

      <div class="collapse-tausta">
        <b-dd-item-button @click="valitseOrganisaatio(kt)"
                          v-for="kt in koulutustoimijat"
                          :key="kt.id"
                          :disabled="koulutustoimija === kt.id">
          <fas fixed-width icon="checkmark" v-if="koulutustoimija === kt.id" class="mr-3 valittu" />
          {{ $kaanna(kt.nimi) }}
        </b-dd-item-button>
      </div>
    </ep-collapse>

    <!-- Käyttöliittymän kieli -->
    <ep-collapse :expanded-by-default="false">
      <div slot="header">
        <div class="pl-3 pt-2 text-nowrap kieli">
          <fas fixed-width icon="kielet" class="icon mr-3" />
          <span>{{ $t('kieli') }}</span>
        </div>
        <div class="pl-3">
          <span class="icon mr-3" />
          <small>{{ $t(uiKieli) }}</small>
        </div>
      </div>

      <template slot="icon" slot-scope="{ toggled }">
        <div class="ml-auto align-self-start" style="padding: 0.8rem 1rem;">
          <fas fixed-width icon="chevron-up" v-if="toggled" />
          <fas fixed-width icon="chevron-down" v-else />
        </div>
      </template>

      <div class="collapse-tausta">
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
      <fas fixed-width icon="user" class="icon mr-3" /><span>{{ $t('kayttajan-asetukset') }}</span>
    </b-dd-item>

    <b-dd-item href="/virkailijan-tyopoyta">
      <fas fixed-width icon="ulkoinen-linkki" class="icon mr-3"/><span>{{ $t('palaa-virkailijan-tyopyodalle') }}</span>
    </b-dd-item>

    <b-dd-divider />

    <b-dd-item href="/service-provider-app/saml/logout">
      <fas fixed-width icon="kirjaudu-ulos" class="icon mr-3" /><span>{{ $t('kirjaudu-ulos') }}</span>
    </b-dd-item>

  </b-nav-item-dropdown>
</div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Prop, Component, Vue } from 'vue-property-decorator';

import { Kielet, UiKielet } from '../../stores/kieli';
import { Kieli } from '../../tyypit';
import { IEsitysnimi, parsiEsitysnimi } from '../../utils/kayttaja';
import EpCollapse from '../EpCollapse/EpCollapse.vue';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import {
  KoulutustoimijaBaseDto,
 } from '../../api/amosaa';
 import { setItem } from '@shared/utils/localstorage';

@Component({
  components: {
    EpCollapse,
    EpSpinner,
  },
})
export default class EpKayttaja extends Vue {
  @Prop({ required: true })
  private tiedot!: IEsitysnimi;

  @Prop({})
  private koulutustoimija!: number | null;

  @Prop({})
  private koulutustoimijat!: KoulutustoimijaBaseDto[] | null;

  get esitysnimi() {
    return parsiEsitysnimi(this.tiedot);
  }

  get sovelluksenKielet() {
    return UiKielet;
  }

  get uiKieli() {
    return Kielet.uiKieli.value;
  }

  get valittuKoulutustoimija() {
    if (this.koulutustoimijat && this.koulutustoimija) {
      return _.find(this.koulutustoimijat, { id: this.koulutustoimija });
    } else {
      return null;
    }
  }

  private async valitseOrganisaatio(koulutustoimija: any) {
    const router = this.$router;
    const current: any = router.currentRoute;
    const next = {
      ...current,
      params: {
        ...current.params,
        koulutustoimijaId: _.toString(koulutustoimija.id),
      },
    };
    setItem('koulutustoimija', koulutustoimija.id);

    try {
      await router.push(next);
    }
    catch (err) { }
  }

  private async valitseUiKieli(kieli: Kieli) {
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

    try {
      await router.push(next);
    }
    catch (err) { }
  }
}
</script>

<style scoped lang="scss">
.kayttaja {

  .icon {
    display: inline-block;
    width: 1rem;
  }

  .kayttaja-valikko {
    color: white;
  }

  .valittu-koulutustoimija {
    font-size: 0.75rem;
  }

  /deep/ .ep-collapse {
    padding-top: 0;
    padding-bottom: 0;
  }

  .collapse-tausta {
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
