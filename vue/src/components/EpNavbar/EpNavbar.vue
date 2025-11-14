<template>
  <div
    v-sticky="sticky"
    class="topbar"
    sticky-z-index="600"
  >
    <b-sidebar id="sisaltobar">
      <div
        id="globalNavigation"
        ref="innerPortal"
      />
    </b-sidebar>

    <b-navbar
      id="navigation-bar"
      class="ep-navbar"
      type="dark"
      toggleable="lg"
    >
      <b-navbar-nav
        v-if="showNavigation"
        class="ml-2"
      >
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link
                id="nav-admin"
                :to="rootNavigation"
              >
                <EpMaterialIcon size="20px">
                  home
                </EpMaterialIcon>
              </router-link>
            </li>
            <li
              v-for="(route, idx) in routePath"
              :key="idx"
              class="breadcrumb-item"
            >
              <router-link
                v-if="route.muru && route.muru.location"
                :to="route.muru.location"
              >
                {{ route.muru.name }}
              </router-link>
              <span v-else-if="route.muru">
                {{ route.muru.name }}
              </span>
              <span v-else>{{ $t('route-' + route.name) }}</span>
            </li>
          </ol>
        </nav>
      </b-navbar-nav>
      <b-button
        v-else
        v-b-toggle.sisaltobar
        class="text-white"
        variant="icon"
      >
        <EpMaterialIcon>menu</EpMaterialIcon>
      </b-button>

      <b-navbar-nav class="ml-auto">
        <!-- Sisällön kieli-->
        <b-nav-item-dropdown
          id="content-lang-selector"
          right
          no-caret
        >
          <template #button-content>
            <div class="d-flex flex-row">
              <div class="kieli-valikko d-flex">
                <span class="kielivalitsin text-left">{{ $t("kieli-sisalto") }}: </span>
                <span class="valittu-kieli text-right ml-2">{{ $t(sisaltoKieli) }}</span>
                <EpMaterialIcon>expand_more</EpMaterialIcon>
              </div>
            </div>
          </template>
          <div class="kielet">
            <b-dd-item
              v-for="kieli in sovelluksenKielet"
              :key="kieli"
              :disabled="kieli === sisaltoKieli"
              @click="valitseSisaltoKieli(kieli)"
            >
              <EpMaterialIcon
                v-if="kieli === sisaltoKieli"
                class="mr-3 valittu"
              >
                check
              </EpMaterialIcon>
              {{ $t(kieli) }}
            </b-dd-item>
          </div>
        </b-nav-item-dropdown>

        <ep-kayttaja
          :tiedot="kayttaja"
          :koulutustoimijat="koulutustoimijat"
          :koulutustoimija="koulutustoimija"
          :sovellus-oikeudet="sovellusOikeudet"
          :logout-href="logoutHref"
        />
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Kieli } from '../../tyypit';
import { Kielet, UiKielet } from '../../stores/kieli';
import { Murupolku } from '../../stores/murupolku';
import EpButton from '../../components/EpButton/EpButton.vue';
import { Location } from 'vue-router';
import EpKayttaja from '../../components/EpKayttaja/EpKayttaja.vue';
import { BrowserStore } from '../../stores/BrowserStore';
import { SovellusOikeus } from '@shared/plugins/oikeustarkastelu';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

interface Breadcrumb {
  label: string;
  route: Location;
}

const props = defineProps({
  kayttaja: {
    type: Object,
    required: true,
  },
  sticky: {
    type: Boolean,
    default: true,
  },
  tyyli: {
    type: String,
    default: 'normaali',
  },
  koulutustoimijat: {
    type: Array,
    required: false,
  },
  koulutustoimija: {
    type: Object,
    required: false,
  },
  rootNavigation: {
    type: Object,
    default: () => ({ name: 'root' }),
  },
  sovellusOikeudet: {
    type: Array as () => SovellusOikeus[],
    required: false,
  },
  logoutHref: {
    type: String,
    required: false,
  },
});

const browserStore = new BrowserStore();
const route = useRoute();

const showNavigation = computed(() => {
  return browserStore.navigationVisible.value;
});

const murut = computed(() => {
  return Murupolku.murut;
});

const sisaltoKieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const sovelluksenKielet = computed(() => {
  return UiKielet;
});

const matched = computed(() => {
  return route?.matched;
});

const routePath = computed(() => {
  return _(route?.matched)
    .filter('name')
    .map(routeItem => {
      const computeds = _.get(routeItem, 'instances.default');
      const result = {
        ...routeItem,
        muru: murut.value[routeItem!.name!],
        // breadname: computeds && computeds.breadcrumb,
      };
      return result;
    })
    .uniqBy('muru.name')
    .value();
});

const valitseSisaltoKieli = (kieli: Kieli) => {
  Kielet.setSisaltoKieli(kieli);
};
</script>

<style scoped lang="scss">
@import '@/styles/_variables.scss';

.topbar {
  background-image: inherit;
  background-size: cover;
  height: 56px;

  .navbar {
    top: 0;
    font-weight: 600;

    .kielivalitsin {
      color: white;
    }

    .breadcrumb {
      margin-bottom: 0;
      background: rgba(0, 0, 0, 0);
      padding: 0;

      .breadcrumb-item {
        color: white;
        &::before {
          color: white;
        }
        a {
          color: white;
        }
      }
    }
  }

  .kieli-valikko {
    color: white;

    .valittu-kieli {
      font-weight: 400;
    }
  }

  .valittu-koulutustoimija {
    font-size: 0.75rem;
  }

  .ep-navbar {

    .kysymysmerkki {
      color: white;
      cursor: pointer;
    }

    .kielet {
      text-align: right;

      .valittu {
        color: #3467E3;
        vertical-align: -0.25em;
      }
    }

    :deep(.dropdown-menu) {
      padding: 0;
      color: #000000;
      min-width: initial;
    }

    :deep(.dropdown-item) {
      // padding: 0.5rem 1rem;
      color: #000000;
    }

    :deep(.dropdown-item:hover) {
      background-color: inherit;
    }

  }
}

</style>
