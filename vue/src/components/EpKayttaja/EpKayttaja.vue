<template>
  <div class="kayttaja">
    <b-nav-item-dropdown
      id="kayttaja-dropdown"
      right
      no-caret
    >
      <template #button-content>
        <div class="d-flex flex-row">
          <div class="kayttaja-valikko d-flex flex-column">
            <span class="kielivalitsin text-right">{{ esitysnimi }}</span>
            <small
              v-if="koulutustoimija"
              class="valittu-koulutustoimija text-right"
            >{{ $kaanna(koulutustoimija.nimi) }}</small>
          </div>
          <EpMaterialIcon>expand_more</EpMaterialIcon>
        </div>
      </template>

      <!-- Koulutustoimija -->
      <ep-collapse
        v-if="koulutustoimija"
        :expanded-by-default="false"
        :use-padding="false"
        :border-bottom="false"
      >
        <template #header>
          <div class="pl-3 pt-2 text-nowrap kieli">
            <EpMaterialIcon class="icon mr-3">
              group
            </EpMaterialIcon>
            <span>{{ $t('organisaatio') }}</span>
          </div>
          <div class="pl-3 text-nowrap">
            <span class="icon mr-3" />
            <small>{{ $kaanna(koulutustoimija.nimi) }}</small>
          </div>
        </template>

        <template #icon="{ toggled }">
          <div
            class="ml-auto align-self-start"
            style="padding: 0.8rem 1rem;"
          >
            <EpMaterialIcon v-if="toggled">
              expand_less
            </EpMaterialIcon>
            <EpMaterialIcon v-else>
              expand_more
            </EpMaterialIcon>
          </div>
        </template>

        <div class="collapse-tausta text-left mt-2">
          <template v-if="koulutustoimijat && koulutustoimijat.length > 10">
            <hr class="m-0">
            <EpSearch
              v-model="koulutustoimijaQuery"
              class="rajain pl-2"
            />
            <hr class="mt-0">
          </template>

          <div class="koulutustoimijat mb-2">
            <div
              v-if="hasLukuOikeusKoulutustoimijoita"
              class="d-flex justify-content-end"
            >
              <EpMaterialIcon class="vain-luku mr-3">
                visibility
              </EpMaterialIcon>
              <ep-toggle
                v-model="naytaLukuoikeusKoulutustoimijat"
                :title="$t('lukuoikeus')"
              />
            </div>
            <b-dd-item-button
              v-for="kt in koulutustoimijatFilteredSorted"
              :key="kt.id"
              :disabled="koulutustoimija.id === kt.id"
              @click="valitseOrganisaatio(kt)"
            >
              <div class="row">
                <div class="collapse-tausta-valinta-icon col-1">
                  <EpMaterialIcon
                    v-if="koulutustoimija === kt.id"
                    class="valittu"
                  >
                    done
                  </EpMaterialIcon>
                </div>
                <div class="col-10 koulutustoimija">
                  {{ $kaanna(kt.nimi) }}
                  <EpMaterialIcon
                    v-if="kt.oikeus === 'luku'"
                    class="vain-luku"
                    size="16px"
                  >
                    visibility
                  </EpMaterialIcon>
                </div>
              </div>
            </b-dd-item-button>
          </div>
        </div>
      </ep-collapse>

      <!-- Käyttöliittymän kieli -->
      <ep-collapse
        :expanded-by-default="false"
        :use-padding="false"
        :border-bottom="false"
      >
        <template #header>
          <div class="pl-3 pt-2 text-nowrap kieli">
            <EpMaterialIcon class="icon mr-3">
              language
            </EpMaterialIcon>
            <span>{{ $t('kieli') }}</span>
          </div>
          <div class="pl-3 uikieli">
            <span class="icon mr-3" />
            <small>{{ $t(uiKieli) }}</small>
          </div>
        </template>

        <template #icon="{ toggled }">
          <div
            class="ml-auto align-self-start"
            style="padding: 0.8rem 1rem;"
          >
            <EpMaterialIcon v-if="toggled">
              expand_less
            </EpMaterialIcon>
            <EpMaterialIcon v-else>
              expand_more
            </EpMaterialIcon>
          </div>
        </template>

        <div class="collapse-tausta text-left">
          <b-dd-item-button
            v-for="kieli in sovelluksenKielet"
            :key="kieli"
            :disabled="kieli === uiKieli"
            @click="valitseUiKieli(kieli)"
          >
            <div class="collapse-tausta-valinta-icon">
              <EpMaterialIcon
                v-if="kieli === uiKieli"
                class="mr-3 valittu"
              >
                done
              </EpMaterialIcon>
            </div>
            {{ $t(kieli) }}
          </b-dd-item-button>
        </div>
      </ep-collapse>

      <b-dd-item href="/henkilo-ui/omattiedot">
        <EpMaterialIcon class="icon mr-3">
          person
        </EpMaterialIcon>
        <span>{{ $t('kayttajan-asetukset') }}</span>
      </b-dd-item>

      <b-dropdown-divider />

      <b-dd-item
        v-if="!sovellusOikeudet || sovellusOikeudet.length === 1"
        href="/virkailijan-tyopoyta"
      >
        <EpMaterialIcon class="icon mr-3">
          launch
        </EpMaterialIcon>
        <span>{{ $t('palaa-virkailijan-tyopyodalle') }}</span>
      </b-dd-item>

      <!-- Sovellussiisrtymä  -->
      <ep-collapse
        v-else
        :expanded-by-default="false"
        :use-padding="false"
        :border-bottom="false"
      >
        <template #header>
          <div class="pl-3 pt-2 text-nowrap kieli">
            <EpMaterialIcon class="icon mr-3">
              launch
            </EpMaterialIcon>
            <span>{{ $t('vaihda-sovellusta') }}</span>
          </div>
          <div
            v-if="valittuSovellus"
            class="pl-3 valittu-sovellus pb-2"
          >
            <span class="icon mr-3" />
            <small>{{ $t(valittuSovellus.eperusteSovellus.sovellus) }}</small>
          </div>
        </template>

        <template #icon="{ toggled }">
          <div
            class="ml-auto align-self-start"
            style="padding: 0.8rem 1rem;"
          >
            <EpMaterialIcon v-if="toggled">
              expand_less
            </EpMaterialIcon>
            <EpMaterialIcon v-else>
              expand_more
            </EpMaterialIcon>
          </div>
        </template>

        <div class="collapse-tausta text-left">
          <b-dd-item
            v-for="sovellusOikeus in sovellusOikeudet"
            :key="sovellusOikeus.eperusteSovellus.sovellus"
            :href="sovellusOikeus.eperusteSovellus.url"
            :disabled="sovellusOikeus.valittu"
            class="sovellusoikeus"
          >
            <div class="collapse-tausta-valinta-icon">
              <EpMaterialIcon
                v-if="sovellusOikeus.valittu"
                class="mr-3 valittu"
              >
                done
              </EpMaterialIcon>
            </div>
            {{ $t(sovellusOikeus.eperusteSovellus.sovellus) }}
          </b-dd-item>

          <b-dd-item href="/virkailijan-tyopoyta">
            <div class="collapse-tausta-valinta-icon" />
            {{ $t('virkailijan-tyopoyta') }}
          </b-dd-item>
        </div>
      </ep-collapse>

      <b-dropdown-divider />

      <b-dd-item :href="logoutHref">
        <EpMaterialIcon class="mr-3 valittu">
          logout
        </EpMaterialIcon>
        <span>{{ $t('kirjaudu-ulos') }}</span>
      </b-dd-item>
    </b-nav-item-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import * as _ from 'lodash';
import { Kielet, UiKielet } from '../../stores/kieli';
import { Kieli } from '../../tyypit';
import { IEsitysnimi, parsiEsitysnimi } from '../../utils/kayttaja';
import EpCollapse from '../EpCollapse/EpCollapse.vue';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import { setItem } from '@shared/utils/localstorage';
import { SovellusOikeus } from '@shared/plugins/oikeustarkastelu';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { useRouter } from 'vue-router';
import { $kaanna } from '@shared/utils/globals';

const props = defineProps({
  tiedot: {
    type: Object as () => IEsitysnimi,
    required: true,
  },
  koulutustoimija: {
    type: Object,
    required: false,
  },
  koulutustoimijat: {
    type: Array,
    required: false,
  },
  sovellusOikeudet: {
    type: Array as () => SovellusOikeus[],
    required: false,
  },
  logoutHref: {
    type: String,
    default: '/service-provider-app/saml/logout',
  },
});

// State
const koulutustoimijaQuery = ref('');
const naytaLukuoikeusKoulutustoimijat = ref(true);
const router = useRouter();

// Computed properties
const esitysnimi = computed(() => {
  return parsiEsitysnimi(props.tiedot);
});

const sovelluksenKielet = computed(() => {
  return UiKielet;
});

const uiKieli = computed(() => {
  return Kielet.uiKieli.value;
});

const hasLukuOikeusKoulutustoimijoita = computed(() => {
  if (props.koulutustoimijat) {
    return !_.isEmpty(_.filter(props.koulutustoimijat, { oikeus: 'luku' }))
           && !_.isEmpty(_.reject(props.koulutustoimijat, { oikeus: 'luku' }));
  }
  return false;
});

const koulutustoimijatFilteredSorted = computed(() => {
  return _.chain(props.koulutustoimijat)
    .filter(kt => Kielet.search(koulutustoimijaQuery.value, kt.nimi))
    .filter(kt => naytaLukuoikeusKoulutustoimijat.value || kt.oikeus !== 'luku')
    .map(kt => {
      return {
        ...kt,
        kaannettyNimi: $kaanna(kt.nimi),
      };
    })
    .orderBy(['kaannettyNimi', 'id'], ['asc', 'asc'])
    .value();
});

const valittuSovellus = computed(() => {
  return _.find(props.sovellusOikeudet, 'valittu');
});

// Methods
async function valitseOrganisaatio(koulutustoimija: any) {
  if (!router) {
    return;
  }

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
  catch (err) {
    // Silently ignore router push errors
  }
}

async function valitseUiKieli(kieli: Kieli) {
  Kielet.setUiKieli(kieli);

  if (!router) {
    return;
  }

  const current: any = router.currentRoute;
  const next = {
    ...current,
    params: {
      ...current.params,
      lang: kieli || Kielet.i18n.global.fallbackLocale,
    },
  };

  try {
    await router.push(next);
  }
  catch (err) {
    // Silently ignore router push errors
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
.kayttaja {

  :deep(ul.dropdown-menu) {
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

    :deep(.form-control) {
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

  :deep(.ep-collapse) {
    padding-top: 0;
    padding-bottom: 0;
  }

  .collapse-tausta {
    background-color: #F3F3F3;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;

    :deep(.dropdown-item) {
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

  :deep(.dropdown-menu) {
    padding: 0;
    color: #000000;
  }

  :deep(.dropdown-divider) {
    margin: 0;
  }

  :deep(.dropdown-item) {
    padding: 0.5rem 1rem;
    color: #000000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :deep(.dropdown-item:disabled) {
    color: inherit;
  }

  :deep(.dropdown-item:hover) {
    background-color: inherit;
  }

  :deep(.dropdown-item:active) {
    color: inherit;
    background-color: inherit;
  }
}
</style>
