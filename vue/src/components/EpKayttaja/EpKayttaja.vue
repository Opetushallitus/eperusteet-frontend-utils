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
    <ep-collapse :expanded-by-default="false" v-if="valittuKoulutustoimija" :use-padding="false" :border-bottom="false">
      <div slot="header">
        <div class="pl-3 pt-2 text-nowrap kieli">
          <fas fixed-width icon="ryhma" class="icon mr-3" />
          <span>{{ $t('organisaatio') }}</span>
        </div>
        <div class="pl-3 text-nowrap">
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

      <div class="collapse-tausta text-left mt-2">
        <template v-if="koulutustoimijat && koulutustoimijat.length > 10">
          <hr class="m-0"/>
          <EpSearch class="rajain pl-2" v-model="koulutustoimijaQuery" />
          <hr class="mt-0"/>
        </template>

        <div class="koulutustoimijat mb-2">
          <b-dd-item-button @click="valitseOrganisaatio(kt)"
                            v-for="kt in koulutustoimijatFilteredSorted"
                            :key="kt.id"
                            :disabled="koulutustoimija === kt.id">
            <div class="row">
              <div class="collapse-tausta-valinta-icon col-1">
                <fas fixed-width icon="checkmark" v-if="koulutustoimija === kt.id" class="valittu" />
              </div>
              <div class="col-10 koulutustoimija">
                {{ $kaanna(kt.nimi) }}
                <fas icon="eye" v-if="kt.oikeus === 'luku'" class="vain-luku pt-1"/>
              </div>
            </div>
          </b-dd-item-button>
        </div>
      </div>
    </ep-collapse>

    <!-- Käyttöliittymän kieli -->
    <ep-collapse :expanded-by-default="false" :use-padding="false" :border-bottom="false">
      <div slot="header">
        <div class="pl-3 pt-2 text-nowrap kieli">
          <fas fixed-width icon="kielet" class="icon mr-3" />
          <span>{{ $t('kieli') }}</span>
        </div>
        <div class="pl-3 uikieli">
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

      <div class="collapse-tausta text-left">
        <b-dd-item-button @click="valitseUiKieli(kieli)"
                          v-for="kieli in sovelluksenKielet"
                          :key="kieli"
                          :disabled="kieli === uiKieli">
          <div class="collapse-tausta-valinta-icon">
            <fas fixed-width icon="checkmark" v-if="kieli === uiKieli" class="mr-3 valittu" />
          </div>
          {{ $t(kieli) }}
        </b-dd-item-button>
      </div>
    </ep-collapse>

    <b-dd-item href="/henkilo-ui/omattiedot">
      <fas fixed-width icon="user" class="icon mr-3" /><span>{{ $t('kayttajan-asetukset') }}</span>
    </b-dd-item>

    <b-dropdown-divider/>

    <b-dd-item href="/virkailijan-tyopoyta" v-if="!sovellusOikeudet || sovellusOikeudet.length === 1">
      <fas fixed-width icon="ulkoinen-linkki" class="icon mr-3"/><span>{{ $t('palaa-virkailijan-tyopyodalle') }}</span>
    </b-dd-item>

    <!-- Sovellussiisrtymä  -->
    <ep-collapse :expanded-by-default="false" :use-padding="false" :border-bottom="false" v-else>
      <div slot="header">
        <div class="pl-3 pt-2 text-nowrap kieli">
          <fas fixed-width icon="ulkoinen-linkki" class="icon mr-3" />
          <span>{{ $t('vaihda-sovellusta') }}</span>
        </div>
        <div class="pl-3 valittu-sovellus pb-2" v-if="valittuSovellus">
          <span class="icon mr-3" />
          <small>{{ $t(valittuSovellus.eperusteSovellus.sovellus) }}</small>
        </div>
      </div>

      <template slot="icon" slot-scope="{ toggled }">
        <div class="ml-auto align-self-start" style="padding: 0.8rem 1rem;">
          <fas fixed-width icon="chevron-up" v-if="toggled" />
          <fas fixed-width icon="chevron-down" v-else />
        </div>
      </template>

      <div class="collapse-tausta text-left">
        <b-dd-item :href="sovellusOikeus.eperusteSovellus.url"
                    v-for="sovellusOikeus in sovellusOikeudet"
                    :key="sovellusOikeus.eperusteSovellus.sovellus"
                    :disabled="sovellusOikeus.valittu"
                    class="sovellusoikeus">
          <div class="collapse-tausta-valinta-icon">
            <fas fixed-width icon="checkmark" v-if="sovellusOikeus.valittu" class="mr-3 valittu" />
          </div>
          {{ $t(sovellusOikeus.eperusteSovellus.sovellus) }}
        </b-dd-item>

        <b-dd-item href="/virkailijan-tyopoyta">
          <div class="collapse-tausta-valinta-icon" />
          {{ $t('virkailijan-tyopoyta') }}
        </b-dd-item>
      </div>
    </ep-collapse>

    <b-dropdown-divider/>

    <b-dd-item :href="logoutHref">
      <fas fixed-width icon="kirjaudu-ulos" class="icon mr-3" /><span>{{ $t('kirjaudu-ulos') }}</span>
    </b-dd-item>

  </b-nav-item-dropdown>
</div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Prop, Component, Vue } from 'vue-property-decorator';

import { Kielet, UiKielet } from '../../stores/kieli';
import { Kieli, SovellusVirhe } from '../../tyypit';
import { IEsitysnimi, parsiEsitysnimi } from '../../utils/kayttaja';
import EpCollapse from '../EpCollapse/EpCollapse.vue';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import { setItem } from '@shared/utils/localstorage';
import { SovellusOikeus } from '@shared/plugins/oikeustarkastelu';
import EpSearch from '@shared/components/forms/EpSearch.vue';

@Component({
  components: {
    EpCollapse,
    EpSpinner,
    EpSearch,
  },
})
export default class EpKayttaja extends Vue {
  @Prop({ required: true })
  private tiedot!: IEsitysnimi;

  @Prop({})
  private koulutustoimija!: number | null;

  @Prop({})
  private koulutustoimijat!: any[] | null;

  @Prop({ required: false })
  private sovellusOikeudet!: SovellusOikeus[];

  @Prop({ required: false, default: '/service-provider-app/saml/logout' })
  private logoutHref!: string;

  private koulutustoimijaQuery = '';

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
    }
    else {
      return null;
    }
  }

  get koulutustoimijatFilteredSorted() {
    return _.chain(this.koulutustoimijat)
      .filter(kt => Kielet.search(this.koulutustoimijaQuery, kt.nimi))
      .map(kt => {
        return {
          ...kt,
          kaannettyNimi: this.$kaanna(kt.nimi),
        };
      })
      .orderBy(['kaannettyNimi', 'id'], ['asc', 'asc'])
      .value();
  }

  private async valitseOrganisaatio(koulutustoimija: any) {
    if (!this.$router) {
      return;
    }

    const router = this.$router;
    const current: any = router.currentRoute;
    const next = {
      ...current,
      params: {
        ...current.params,
        koulutustoimijaId: _.toString(koulutustoimija.id),
      },
    };

    try {
      await router.push(next);
      setItem('koulutustoimija', koulutustoimija.id);
    }
    catch (err) { }
  }

  private async valitseUiKieli(kieli: Kieli) {
    Kielet.setUiKieli(kieli);

    if (!this.$router) {
      return;
    }

    const router = this.$router;
    const current: any = router.currentRoute;
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

  get valittuSovellus() {
    return _.find(this.sovellusOikeudet, 'valittu');
  }
}
</script>

<style scoped lang="scss">
@import '~@shared/styles/_variables.scss';
.kayttaja {

  ::v-deep ul.dropdown-menu {
    width: 350px;
  }

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

  .rajain {
    background-color: $white;

    ::v-deep .form-control {
      background-color: $white;
    }
  }

  .koulutustoimijat {
    overflow-y: auto;
    max-height: 400px;

    .vain-luku {
      color: $blue;
    }

    .koulutustoimija {
      white-space:normal;
      line-height: 1.2rem;
    }
  }

  /deep/ .ep-collapse {
    padding-top: 0;
    padding-bottom: 0;
  }

  .collapse-tausta {
    background-color: #F3F3F3;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;

    /deep/ .dropdown-item {
      padding: 0.25rem 1rem;
    }

    .valittu {
      color: #3467E3;
      vertical-align: -0.25em;
    }

    .collapse-tausta-valinta-icon {
      display: inline-block;
      width: 28px;
    }
  }

  .kieli {
    font-weight: normal;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
