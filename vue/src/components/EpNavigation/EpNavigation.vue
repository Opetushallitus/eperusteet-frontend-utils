<template>
  <div
    v-sticky="sticky"
    class="topbar"
    sticky-z-index="600"
  >
    <nav
      id="navigation-bar"
      class="ep-navbar"
      :class="'navbar-style-' + tyyli"
      :style="{ 'background-attachment': sticky ? 'fixed' : '' }"
    >
      <div class="ep-navbar-left">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link
                id="nav-admin"
                :to="{ name: 'root' }"
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
                {{ $kaanna(route.muru.name) }}
              </router-link>
              <span v-else-if="route.muru">
                {{ $kaanna(route.muru.name) }}
              </span>
              <span v-else>{{ $t('route-' + route.name) }}</span>
            </li>
          </ol>
        </nav>
      </div>
      <div class="ep-navbar-right">
        <EpDropdown
          id="content-lang-selector"
          right
        >
          <template #button-content>
            <span class="kielivalitsin">{{ $t("kieli-sisalto") }}: {{ $t(sisaltoKieli) }}</span>
          </template>
          <div class="kielet">
            <EpDropdownItem
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
            </EpDropdownItem>
          </div>
        </EpDropdown>

        <ep-kayttaja :tiedot="tiedot" />
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Kieli } from '@shared/tyypit';
import { Kielet, UiKielet } from '@shared/stores/kieli';
import { Murupolku } from '@shared/stores/murupolku';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpKayttaja from '@shared/components/EpKayttaja/EpKayttaja.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { EpDropdown, EpDropdownItem } from '@shared/components/EpDropdown';

const props = defineProps({
  sticky: {
    type: Boolean,
    default: true,
  },
  tyyli: {
    type: String,
    default: 'normaali',
  },
  tiedot: {
    type: String,
    required: false,
  },
});

const route = useRoute();

const murut = computed(() => {
  return Murupolku.murut;
});

const sisaltoKieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const sovelluksenKielet = computed(() => {
  return UiKielet;
});

const routePath = computed(() => {
  return _(route.matched)
    .filter('name')
    .map(route => {
      const computeds = _.get(route, 'instances.default');
      const result = {
        ...route,
        muru: murut.value[route!.name!],
        breadname: computeds && computeds.breadcrumb,
      };
      return result;
    })
    .value();
});

function valitseSisaltoKieli(kieli: Kieli) {
  Kielet.setSisaltoKieli(kieli);
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.topbar {
  .ep-navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    top: 0;
    font-weight: 600;

    .ep-navbar-left {
      flex: 1;
    }

    .ep-navbar-right {
      display: flex;
      align-items: center;
      margin-left: auto;
    }

    .kielivalitsin {
      color: white;
    }

    .breadcrumb {
      margin-bottom: 0;
      background: rgba(0, 0, 0, 0);
      padding: 0;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;

      .breadcrumb-item {
        color: white;
        display: flex;
        align-items: center;

        &::before {
          content: '/';
          color: white;
          margin-right: 0.5rem;
        }

        &:first-child::before {
          display: none;
        }

        a {
          color: white;
        }
      }
    }
    height: 50px;
    background-color: $etusivu-header-background;
    background-image: url('@assets/img/banners/header.svg');
    background-position: 100% 0;
    background-repeat: no-repeat;

    @media only screen and (min-width: 2503px)  {
      background-size: 100%;
    }

    .kysymysmerkki {
      color: white;
      cursor: pointer;
    }

    .kielet {
      text-align: right;

      .valittu {
        color: $paletti-blue;
        vertical-align: -0.25em;
      }
    }

  }
}

</style>
