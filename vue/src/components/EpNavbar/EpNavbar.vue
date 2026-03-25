<template>
  <div
    v-sticky="stickyBinding"
    class="topbar"
  >
    <!-- <EpSidebar id="sisaltobar">
      <div
        id="globalNavigation"
        ref="innerPortal"
      />
    </EpSidebar> -->

    <nav
      id="navigation-bar"
      class="ep-navbar flex items-center"
    >
      <div
        v-if="showNavigation"
        class="ml-2"
      >
        <EpBreadcrumb
          :home="breadcrumbHome"
          :model="breadcrumbModel"
        />
      </div>
      <ep-button
        v-else
        v-b-toggle.sisaltobar
        class="text-white"
        variant="secondary"
      >
        <EpMaterialIcon>menu</EpMaterialIcon>
      </ep-button>

      <div class="ml-auto flex items-center mr-2">
        <EpDropdown
          class="mr-3"
          right
          no-caret
        >
          <template #button-content>
            <div class="flex flex-row">
              <div class="kieli-valikko flex">
                <span class="kielivalitsin text-left">{{ $t("kieli-sisalto") }}: </span>
                <span class="valittu-kieli text-right ml-2">{{ $t(sisaltoKieli) }}</span>
                <EpMaterialIcon>expand_more</EpMaterialIcon>
              </div>
            </div>
          </template>
          <div class="kielet">
            <EpDropdownItem
              v-for="kieli in sovelluksenKielet"
              :key="kieli"
              :disabled="kieli === sisaltoKieli"
              @click="valitseSisaltoKieli(kieli as Kieli)"
            >
              <EpMaterialIcon
                v-if="kieli === sisaltoKieli"
                class="mr-3 valittu"
              >
                check
              </EpMaterialIcon>
              <div :class="{ 'pl-[2.5rem]': kieli !== sisaltoKieli }">
                {{ $t(kieli) }}
              </div>
            </EpDropdownItem>
          </div>
        </EpDropdown>

        <ep-kayttaja
          :tiedot="kayttaja"
          :koulutustoimijat="koulutustoimijat"
          :koulutustoimija="koulutustoimija"
          :sovellus-oikeudet="sovellusOikeudet"
          :logout-href="logoutHref"
        />
      </div>
    </nav>
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
import EpBreadcrumb from '../../components/EpBreadcrumb/EpBreadcrumb.vue';
import type { RouteLocationRaw } from 'vue-router';
import EpKayttaja from '../../components/EpKayttaja/EpKayttaja.vue';
import { $t } from '@shared/utils/globals';
import EpSidebar from '../../components/EpSidebar/EpSidebar.vue';
import { EpDropdown, EpDropdownItem } from '../../components/EpDropdown';
import { BrowserStore } from '../../stores/BrowserStore';
import { SovellusOikeus } from '@shared/plugins/oikeustarkastelu';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { vSticky } from '@shared/directives/vSticky';


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

const routePath = computed(() => {
  return _(route?.matched)
    .filter('name')
    .map(routeItem => {
      const routeName = routeItem!.name!;
      const muruKey = typeof routeName === 'string' ? routeName : '';
      const result = {
        ...routeItem,
        muru: murut.value[muruKey],
      };
      return result;
    })
    .uniqBy('muru.name')
    .value();
});

const breadcrumbHome = computed(() => ({
  label: '',
  icon: 'home',
  route: props.rootNavigation,
}));

const breadcrumbModel = computed(() =>
  routePath.value.map(routeItem => {
    const nameKey = typeof routeItem.name === 'symbol' ? '' : String(routeItem.name);
    const label = routeItem.muru?.name ?? $t('route-' + nameKey);
    const item: { label: string; route?: RouteLocationRaw } = { label };
    if (routeItem.muru?.location) {
      item.route = routeItem.muru.location;
    }
    return item;
  }),
);

const valitseSisaltoKieli = (kieli: Kieli) => {
  Kielet.setSisaltoKieli(kieli);
};

const stickyBinding = computed(() => {
  if (!props.sticky) {
    return false;
  }
  return { top: 0, zIndex: 500 };
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

$ep-navbar-height: 56px;

.topbar {
  color: white;
  height: $ep-navbar-height;

  .ep-navbar {
    top: 0;
    font-weight: 600;

    .kielivalitsin {
      color: white;
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
  }
}

</style>
