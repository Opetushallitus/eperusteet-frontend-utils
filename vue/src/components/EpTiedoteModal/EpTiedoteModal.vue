<template>
  <div>
    <ep-button
      v-if="editable"
      v-b-modal.tiedoteMuokkausModal
      v-oikeustarkastelu="oikeustarkastelu"
      icon="add"
      variant="outline"
      @click="lisaaTiedote"
    >
      {{ $t('lisaa-tiedote') }}
    </ep-button>

    <b-modal
      id="tiedoteMuokkausModal"
      ref="tiedoteMuokkausModal"
      size="lg"
      static
      lazy
      :no-enforce-focus="true"
    >
      <template #modal-header>
        <div class="row w-100">
          <div class="col">
            <h2 v-if="!editing">
              {{ $t('tiedote') }}
            </h2>
            <h2 v-else>
              {{ muokattavaTiedote.id ? $t('muokkaa-tiedotetta') : $t('lisaa-tiedote') }}
            </h2>
          </div>
          <div class="col text-right">
            <ep-kielivalinta />
          </div>
        </div>
      </template>

      <div v-if="editing">
        <ep-toggle
          v-if="peruste"
          v-model="liitaPeruste"
          class="mb-3"
        >
          {{ $t('liita-peruste-osaksi-tiedotetta') }}
        </ep-toggle>

        <ep-form-content name="tiedotteen-otsikko">
          <ep-input
            v-model="muokattavaTiedote.otsikko"
            :is-editing="editing"
            :validation="v$.muokattavaTiedote.otsikko"
          />
        </ep-form-content>

        <ep-form-content name="tiedoteteksti">
          <ep-content
            v-model="muokattavaTiedote.sisalto"
            :is-editable="editing"
            layout="simplified_w_links"
          />
        </ep-form-content>

        <ep-form-content name="valitse-missa-tiedote-julkaistaan">
          <ep-toggle
            v-model="opintopolkuJulkaisu"
            class="pb-2 mt-3"
            :is-s-witch="false"
            :is-editing="editing"
          >
            {{ $t('tiedote-julkaisupaikka-opintopolku_etusivu') }}
          </ep-toggle>

          <div>
            <ep-toggle
              v-model="opintopolkuJulkaisuKoulutustyyppiTutkinto"
              class="pb-2"
              :is-s-witch="false"
              :is-editing="editing"
            >
              {{ $t('tiedote-julkaisupaikka-opintopolku-koulutus-ja-tutkintonakyma') }}
            </ep-toggle>

            <ep-multi-list-select
              v-if="opintopolkuJulkaisuKoulutustyyppiTutkinto"
              v-model="koulutusryypiRyhmaValinnat"
              class="pl-5 pb-2"
              tyyppi="koulutuskohtainen-nakyma"
              :items="koulutustyyppiRyhmaItems"
              :is-editing="editing"
              :required="true"
            >
              <template #option="{option}">
                <ep-color-indicator
                  v-if="option.value && option.value.type"
                  :size="10"
                  :tooltip="false"
                  :kind="option.value.type"
                />
                {{ option.text }}
              </template>

              <template #singleLabel="{option}">
                <ep-color-indicator
                  v-if="option.value && option.value.type"
                  :size="10"
                  :tooltip="false"
                  :kind="option.value.type"
                />
                {{ option.text }}
              </template>
            </ep-multi-list-select>
          </div>

          <ep-toggle
            v-model="opsJulkaisu"
            class="pb-2"
            :is-s-witch="false"
            :is-editing="editing"
          >
            {{ $t('tiedote-julkaisupaikka-ops') }}
          </ep-toggle>
          <ep-toggle
            v-model="lopsJulkaisu"
            class="pb-2"
            :is-s-witch="false"
            :is-editing="editing"
          >
            {{ $t('tiedote-julkaisupaikka-lops') }}
          </ep-toggle>
          <ep-toggle
            v-model="amosaaJulkaisu"
            class="pb-2"
            :is-s-witch="false"
            :is-editing="editing"
          >
            {{ $t('tiedote-julkaisupaikka-amosaa') }}
          </ep-toggle>
          <ep-toggle
            v-model="vstJulkaisu"
            class="pb-2"
            :is-s-witch="false"
            :is-editing="editing"
          >
            {{ $t('tiedote-julkaisupaikka-vst') }}
          </ep-toggle>
          <ep-toggle
            v-model="tuvaJulkaisu"
            class="pb-2"
            :is-s-witch="false"
            :is-editing="editing"
          >
            {{ $t('tiedote-julkaisupaikka-tuva') }}
          </ep-toggle>
          <ep-toggle
            v-model="kotoJulkaisu"
            class="pb-2"
            :is-s-witch="false"
            :is-editing="editing"
          >
            {{ $t('tiedote-julkaisupaikka-koto') }}
          </ep-toggle>
        </ep-form-content>

        <ep-form-content
          v-if="!peruste && perusteet"
          name="liita-peruste-tiedotteeseen"
        >
          <ep-spinner v-if="!perusteet" />
          <template v-else>
            <div class="peruste-linkitys-ohje mb-2">
              {{ $t('valitsemasi-peruste-linkitetaan-osaksi-tiedotetta') }}
            </div>
            <EpMultiListSelect
              v-model="muokattavaTiedote.perusteet"
              tyyppi="peruste"
              :items="perusteItems"
              :is-editing="editing"
              :required="false"
            >
              <template #option="{ option }">
                {{ option.text }}
                <span
                  v-if="option.value.voimassaoloAlkaa || option.value.voimassaoloLoppuu"
                  class="ml-3 voimassaolo"
                >
                  (<span v-if="option.value.voimassaoloAlkaa">{{ $sd(option.value.voimassaoloAlkaa) }}</span>-
                  <span v-if="option.value.voimassaoloLoppuu">{{ $sd(option.value.voimassaoloLoppuu) }}</span>)
                </span>
              </template>
              <template #singleLabel="{ option }">
                {{ option.text }}
                <span
                  v-if="option.value.voimassaoloAlkaa || option.value.voimassaoloLoppuu"
                  class="ml-3 voimassaolo"
                >
                  (<span v-if="option.value.voimassaoloAlkaa">{{ $sd(option.value.voimassaoloAlkaa) }}</span>-
                  <span v-if="option.value.voimassaoloLoppuu">{{ $sd(option.value.voimassaoloLoppuu) }}</span>)
                </span>
              </template>
            </EpMultiListSelect>
          </template>
        </ep-form-content>

        <ep-form-content
          v-if="ammatillisetLisayksetSallittu"
          name="liita-tutkinnon-osa-tiedotteeseen"
        >
          <div
            v-for="(tutkinnonOsa, index) in muokattavaTiedote.tutkinnonosat"
            :key="'tutkinnonOsa' + index"
            class="mb-1 d-flex justify-content-center align-items-center"
          >
            <ep-koodisto-select
              v-model="muokattavaTiedote.tutkinnonosat[index]"
              :store="tutkinnonOsaKoodisto"
              class="w-100"
            >
              <template #default="{ open }">
                <b-input-group class="w-100 d-flex">
                  <b-form-input
                    :value="$kaanna(tutkinnonOsa.nimi)"
                    disabled
                  />
                  <b-input-group-append>
                    <b-button
                      variant="primary"
                      @click="open"
                    >
                      {{ $t('hae') }}
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </template>
            </ep-koodisto-select>
            <div class="flex-shrink pl-2">
              <ep-button
                variant="link"
                icon="delete"
                @click="poistaTutkinnonosa(index)"
              />
            </div>
          </div>
          <ep-button
            button-class="pl-0"
            variant="outline-primary"
            icon="add"
            @click="lisaaTutkinnonOsa"
          >
            {{ $t('lisaa-tutkinnon-osa') }}
          </ep-button>
        </ep-form-content>

        <ep-form-content
          v-if="ammatillisetLisayksetSallittu"
          name="liita-osaamisala-tiedotteeseen"
        >
          <div
            v-for="(osaamisala, index) in muokattavaTiedote.osaamisalat"
            :key="'osaamisala' + index"
            class="mb-1 d-flex justify-content-center align-items-center"
          >
            <ep-koodisto-select
              v-model="muokattavaTiedote.osaamisalat[index]"
              :store="osaamisalaKoodisto"
              class="w-100"
            >
              <template #default="{ open }">
                <b-input-group class="w-100 d-flex">
                  <b-form-input
                    :value="$kaanna(osaamisala.nimi)"
                    disabled
                  />
                  <b-input-group-append>
                    <b-button
                      variant="primary"
                      @click="open"
                    >
                      {{ $t('hae') }}
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </template>
            </ep-koodisto-select>
            <div class="flex-shrink pl-2">
              <ep-button
                variant="link"
                icon="delete"
                @click="poistaOsaamisala(index)"
              />
            </div>
          </div>
          <ep-button
            button-class="pl-0"
            variant="outline-primary"
            icon="add"
            @click="lisaaOsaamisala"
          >
            {{ $t('lisaa-osaamisala') }}
          </ep-button>
        </ep-form-content>
      </div>

      <div v-else>
        <div><h3>{{ $kaanna(esittavaMuokkaustieto.otsikko) }}</h3></div>
        <div class="tiedote-muokkaustieto">
          {{ $sdt(esittavaMuokkaustieto.muokattu) }}
          <span class="pl-3">{{ muokkaavanKayttajanNimi }}</span>
        </div>

        <div
          class="mt-4"
          :class="{ 'mb-5': naytaJulkaisupaikka }"
          v-html="$kaanna(esittavaMuokkaustieto.sisalto)"
        />

        <div v-if="naytaJulkaisupaikka">
          <h6 v-if="opintopolkuJulkaisu || esittavaMuokkaustieto.filteredJulkaisupaikat.length > 0 || esittavaMuokkaustieto.filteredJulkaisusovellukset.length > 0">
            {{ $t('tiedote-julkaistu') }}:
          </h6>

          <div
            v-if="esittavaMuokkaustieto.filteredJulkaisupaikat.length > 0 || opintopolkuJulkaisu"
            class="mb-3"
          >
            {{ $t('tiedote-julkaisupaikka-opintopolku') }}

            <div
              v-if="opintopolkuJulkaisu"
              class="ml-4"
            >
              <ep-color-indicator
                class="mr-2"
                :size="6"
                :tooltip="false"
                kind="etusivu"
              /> {{ $t('etusivu') }}
            </div>

            <div
              v-for="(julkaisupaikka, index) in esittavaMuokkaustieto.filteredJulkaisupaikat"
              :key="index+'filteredjulkaisupaikka'"
              class="ml-4"
            >
              <ep-color-indicator
                class="mr-2"
                :size="6"
                :tooltip="false"
                :kind="julkaisupaikka"
              /> {{ $t(julkaisupaikka) }}
            </div>
          </div>

          <div
            v-for="(julkaisusovellus, index) in esittavaMuokkaustieto.filteredJulkaisusovellukset"
            :key="index+'julkaisusovellus'"
          >
            {{ julkaisusovellus }}
          </div>
        </div>

        <div
          v-if="esittavaMuokkaustieto.filteredPerusteet.length > 0"
          class="mt-4"
        >
          <h6>{{ $t('liitetyt-perusteet') }}:</h6>
          <div
            v-for="(peruste, index) in esittavaMuokkaustieto.filteredPerusteet"
            :key="index+'filteredPerusteet'"
          >
            {{ peruste }}
          </div>
        </div>

        <div
          v-if="esittavaMuokkaustieto.tutkinnonosat && esittavaMuokkaustieto.tutkinnonosat.length > 0"
          class="mt-4"
        >
          <h6>{{ $t('liitetyt-tutkinnonosat') }}:</h6>
          <div
            v-for="(tutkinnonosa, index) in esittavaMuokkaustieto.tutkinnonosat"
            :key="index+'tutkinnonosa'"
          >
            {{ $kaanna(tutkinnonosa.nimi) }}
          </div>
        </div>

        <div
          v-if="esittavaMuokkaustieto.osaamisalat && esittavaMuokkaustieto.osaamisalat.length > 0"
          class="mt-4"
        >
          <h6>{{ $t('liitetyt-osaamisalat') }}:</h6>
          <div
            v-for="(osaamisala, index) in esittavaMuokkaustieto.osaamisalat"
            :key="index+'osaamisala'"
          >
            {{ $kaanna(osaamisala.nimi) }}
          </div>
        </div>
      </div>

      <template #modal-footer>
        <div v-if="editing && editable">
          <ep-button
            variant="link"
            @click="suljeTiedote"
          >
            {{ $t('peruuta') }}
          </ep-button>
          <ep-button
            class="ml-3"
            :disabled="v$.$invalid"
            @click="tallennaTiedote"
          >
            {{ muokattavaTiedote.id ? $t('tallenna') : $t('julkaise-tiedote') }}
          </ep-button>
        </div>

        <div
          v-else
          class="d-flex justify-content-between w-100"
        >
          <div v-if="editable">
            <ep-button
              v-oikeustarkastelu="oikeustarkastelu"
              icon="edit"
              variant="link"
              @click="editing = true"
            >
              {{ $t('muokkaa') }}
            </ep-button>
            <ep-button
              v-oikeustarkastelu="oikeustarkastelu"
              icon="delete"
              variant="link"
              @click="poista"
            >
              {{ $t('poista') }}
            </ep-button>
          </div>
          <div v-else />

          <ep-button @click="suljeTiedote">
            {{ $t('sulje') }}
          </ep-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance, watch } from 'vue';
import * as _ from 'lodash';
import { TiedoteDto, Kayttajat, PerusteHakuDto, PerusteDto, PerusteKevytDto, Koodisto } from '@shared/api/eperusteet';
import { parsiEsitysnimi } from '@shared/utils/kayttaja';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpMultiListSelect, { MultiListSelectItem } from '@shared/components/forms/EpMultiListSelect.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { success, fail } from '@shared/utils/notifications';
import { julkaisupaikka, KoulutustyyppiRyhmaValinta } from '@shared/utils/tiedote';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import EpKielivalinta from '@shared/components/EpKielivalinta/EpKielivalinta.vue';
import { themes, ktToState, koulutustyyppiRyhmat, KoulutustyyppiRyhma, koulutustyyppiRyhmaSort, isAmmatillinenKoulutustyyppi } from '@shared/utils/perusteet';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { KoodistoSelectStore } from '../EpKoodistoSelect/KoodistoSelectStore';
import EpKoodistoSelect from '@shared/components/EpKoodistoSelect/EpKoodistoSelect.vue';
import { ITiedotteetProvider } from '@shared/stores/types';
import { requiredOneLang } from '@shared/validators/required';
import { useTemplateRef } from 'vue';
import { $t, $kaanna, $sdt, $sd, $bvModal, $success, $fail } from '@shared/utils/globals';

const props = defineProps({
  perusteet: {
    type: Array as () => PerusteHakuDto[],
    required: false,
  },
  peruste: {
    type: Object as () => PerusteDto,
    required: false,
  },
  tiedotteetStore: {
    type: Object as () => ITiedotteetProvider,
    required: false,
  },
  editable: {
    type: Boolean,
    required: false,
    default: true,
  },
  naytaJulkaisupaikka: {
    type: Boolean,
    required: false,
    default: true,
  },
  oikeustarkastelu: {
    type: Object,
    required: false,
    default: () => ({ oikeus: 'muokkaus' }),
  },
});

const koulutusryypiRyhmaValinnat = ref<KoulutustyyppiRyhmaValinta[]>([]);
const liitaPeruste = ref(false);
const opintopolkuJulkaisu = ref(false);
const opintopolkuJulkaisuKoulutustyyppiTutkinto = ref(false);
const opsJulkaisu = ref(false);
const lopsJulkaisu = ref(false);
const amosaaJulkaisu = ref(false);
const vstJulkaisu = ref(false);
const tuvaJulkaisu = ref(false);
const kotoJulkaisu = ref(false);
const muokkaavanKayttajanNimi = ref('');
const muokattavaTiedote = ref<TiedoteDto>({});
const editing = ref(false);

// Get instance for $t, $kaanna, etc.
const instance = getCurrentInstance();
// Get $bvModal from instance's proxy

// Template refs
const tiedoteMuokkausModal = useTemplateRef('tiedoteMuokkausModal');

// Validation rules
const rules = {
  muokattavaTiedote: {
    otsikko: requiredOneLang(),
    sisalto: {
      required,
      ...requiredOneLang(),
    },
  },
};

// Setup vuelidate
const v$ = useVuelidate(rules, { muokattavaTiedote });

// KoodistoSelectStores
const tutkinnonOsaKoodisto = new KoodistoSelectStore({
  koodisto: 'tutkinnonosat',
  async query(query: string, sivu = 0, koodisto: string) {
    const { data } = await Koodisto.kaikkiSivutettuna(koodisto, query, {
      params: {
        sivu,
        sivukoko: 10,
      },
    });
    return data as any;
  },
});

const osaamisalaKoodisto = new KoodistoSelectStore({
  koodisto: 'osaamisala',
  async query(query: string, sivu = 0, koodisto: string) {
    const { data } = await Koodisto.kaikkiSivutettuna(koodisto, query, {
      params: {
        sivu,
        sivukoko: 10,
      },
    });
    return data as any;
  },
});

// Computed properties
const perusteetById = computed(() => {
  return _.keyBy(props.perusteet, 'id');
});

const esittavaMuokkaustieto = computed(() => {
  return {
    ...muokattavaTiedote.value,
    filteredJulkaisupaikat: [
      ..._.chain(muokattavaTiedote.value.koulutustyypit)
        .map(koulutustyyppi => themes[koulutustyyppi])
        .uniq()
        .value(),
    ],
    filteredJulkaisusovellukset: [
      ..._.chain([julkaisupaikka.ops, julkaisupaikka.lops, julkaisupaikka.amosaa])
        .filter(julkaisupaikka => _.includes(_.map(muokattavaTiedote.value.julkaisupaikat, _.toLower), _.toLower(julkaisupaikka)))
        .map(julkaisupaikka => $t('tiedote-julkaisupaikka-' + julkaisupaikka))
        .value(),
    ],
    filteredPerusteet: [
      ..._.chain(muokattavaTiedote.value.perusteet)
        .filter(peruste => !_.isEmpty(perusteetById.value[(peruste as any).id]))
        .map(peruste => $kaanna((perusteetById.value[(peruste as any).id] as any).nimi))
        .uniq()
        .value(),
    ],
  };
});

const valitutKoulutustyypit = computed((): string[] => {
  return _.chain(koulutusryypiRyhmaValinnat.value)
    .map('object')
    .flatMap()
    .value();
});

const koulutustyyppiRyhmaItems = computed((): MultiListSelectItem[] => {
  return [
    ..._.chain(koulutustyyppiRyhmat())
      .map((koulutustyyppiryhma: KoulutustyyppiRyhma) => {
        return {
          text: $t(koulutustyyppiryhma.ryhma),
          value: {
            type: koulutustyyppiryhma.ryhma,
            object: koulutustyyppiryhma.koulutustyypit,
          },
        } as MultiListSelectItem;
      })
      .sortBy(koulutustyyppiryhma => koulutustyyppiRyhmaSort[koulutustyyppiryhma.value.type])
      .value(),
  ];
});

const perusteItems = computed((): MultiListSelectItem[] => {
  return [
    ..._.chain(_.keys(ktToState))
      .filter(koulutustyyppi => !_.isEmpty(_.keyBy(props.perusteet, 'koulutustyyppi')[koulutustyyppi]))
      .map((koulutustyyppi) => {
        return [
          {
            text: $t(koulutustyyppi),
            value: {
              type: 'koulutustyyppi',
              object: koulutustyyppi,
            },
            unselectable: true,
          } as MultiListSelectItem,
          ..._.chain(props.perusteet)
            .filter((peruste) => peruste.koulutustyyppi === koulutustyyppi)
            .map(peruste => {
              return {
                text: $kaanna(peruste.nimi),
                value: perusteToKevytDto(peruste),
                child: true,
              } as MultiListSelectItem;
            })
            .value(),
        ];
      })
      .flatten()
      .value(),
  ];
});

// Watch for changes
watch(opintopolkuJulkaisuKoulutustyyppiTutkinto, (val) => {
  if (!val) {
    koulutusryypiRyhmaValinnat.value = [];
  }
});

// Methods
function lisaaTiedote() {
  muokkaa({});
  aloitaMuokkaus();
}

async function muokkaa(rivi: any) {
  muokattavaTiedote.value = _.cloneDeep(rivi);
  opintopolkuJulkaisu.value = _.includes(rivi.julkaisupaikat, julkaisupaikka.opintopolku_etusivu);
  opsJulkaisu.value = _.includes(rivi.julkaisupaikat, julkaisupaikka.ops);
  lopsJulkaisu.value = _.includes(rivi.julkaisupaikat, julkaisupaikka.lops);
  amosaaJulkaisu.value = _.includes(rivi.julkaisupaikat, julkaisupaikka.amosaa);
  vstJulkaisu.value = _.includes(rivi.julkaisupaikat, julkaisupaikka.vst);
  tuvaJulkaisu.value = _.includes(rivi.julkaisupaikat, julkaisupaikka.tuva);
  kotoJulkaisu.value = _.includes(rivi.julkaisupaikat, julkaisupaikka.koto);

  koulutusryypiRyhmaValinnat.value = [
    ..._.chain(koulutustyyppiRyhmaItems.value)
      .filter(item => _.some(item.value.object, koulutustyyppi => _.includes(rivi.koulutustyypit, koulutustyyppi)))
      .map(item => {
        return {
          ...item.value,
        } as KoulutustyyppiRyhmaValinta;
      })
      .value(),
  ];

  opintopolkuJulkaisuKoulutustyyppiTutkinto.value = !_.isEmpty(koulutusryypiRyhmaValinnat.value);

  muokattavaTiedote.value.perusteet = _.map(muokattavaTiedote.value.perusteet, peruste => perusteToKevytDto(peruste));

  if (muokattavaTiedote.value.luotu) {
    const kayttaja = (await Kayttajat.getKayttaja((muokattavaTiedote.value.muokkaaja as any))).data;
    if (kayttaja) {
      muokkaavanKayttajanNimi.value = parsiEsitysnimi(kayttaja);
    }
    else {
      muokkaavanKayttajanNimi.value = (muokattavaTiedote.value.muokkaaja as any);
    }
  }

  if (props.peruste) {
    liitaPeruste.value = true;
  }

  tiedoteMuokkausModal.value?.show();
}

function aloitaMuokkaus() {
  editing.value = true;
}

function suljeTiedote() {
  editing.value = false;
  tiedoteMuokkausModal.value?.hide();
}

async function tallennaTiedote() {
  muokattavaTiedote.value.julkaisupaikat = _.chain(_.values(julkaisupaikka))
    .filter(value => value !== julkaisupaikka.opintopolku_etusivu || opintopolkuJulkaisu.value)
    .filter(value => value !== julkaisupaikka.ops || opsJulkaisu.value)
    .filter(value => value !== julkaisupaikka.lops || lopsJulkaisu.value)
    .filter(value => value !== julkaisupaikka.amosaa || amosaaJulkaisu.value)
    .filter(value => value !== julkaisupaikka.vst || vstJulkaisu.value)
    .filter(value => value !== julkaisupaikka.tuva || tuvaJulkaisu.value)
    .filter(value => value !== julkaisupaikka.koto || kotoJulkaisu.value)
    .value() as any;

  muokattavaTiedote.value.koulutustyypit = (valitutKoulutustyypit.value as any);

  if (props.peruste) {
    if (liitaPeruste.value) {
      if (!_.includes(_.map(muokattavaTiedote.value.perusteet, 'id'), props.peruste.id)) {
        muokattavaTiedote.value.perusteet = [
          ..._.map(muokattavaTiedote.value.perusteet),
          perusteToKevytDto(props.peruste),
        ];
      }
    }
    else {
      muokattavaTiedote.value.perusteet = _.filter(muokattavaTiedote.value.perusteet, peruste => peruste.id !== props.peruste.id);
    }
  }

  if (props.tiedotteetStore?.save) {
    try {
      await props.tiedotteetStore.save(muokattavaTiedote.value);
      suljeTiedote();
      $success($t('tiedote-tallennettu'));
    }
    catch (e) {
      if (_.includes(_.get(e, 'message'), '400')) {
        $fail($t('tiedotteen-tallennus-epaonnistui-sisaltovirhe'));
      }
      else {
        $fail($t('tiedotteen-tallennus-epaonnistui'));
      }
    }
  }
}

function perusteToKevytDto(peruste: any): PerusteKevytDto {
  return {
    id: peruste.id,
    nimi: peruste.nimi,
    voimassaoloAlkaa: peruste.voimassaoloAlkaa,
    voimassaoloLoppuu: peruste.voimassaoloLoppuu,
  } as PerusteKevytDto;
}

async function poista() {
  suljeTiedote();

  if (await vahvistaPoisto() && props.tiedotteetStore?.delete) {
    await props.tiedotteetStore.delete(muokattavaTiedote.value);
    $success($t('tiedote-poistettu'));
  }
}

async function vahvistaPoisto() {
  const vahvistusSisalto = instance?.proxy?.$createElement('div', {},
    [
      instance.proxy.$createElement('div', $t('poista-tiedote-vahvistus') as string),
      instance.proxy.$createElement('div', '"' + $kaanna(muokattavaTiedote.value.otsikko) + '"'),
      instance.proxy.$createElement('br', ''),
      instance.proxy.$createElement('div', $t('poista-tiedote-varmistus') as string),
    ],
  ).children;

  return $bvModal.msgBoxConfirm((vahvistusSisalto as any), {
    title: $t('poista-tiedote-kysymys'),
    okVariant: 'primary',
    okTitle: $t('poista') as any,
    cancelVariant: 'link',
    cancelTitle: $t('peruuta') as any,
    centered: true,
    ...{} as any,
  });
}

function poistaTutkinnonosa(tutkinnonOsaIndex: number) {
  muokattavaTiedote.value.tutkinnonosat = _.filter(muokattavaTiedote.value.tutkinnonosat, (tutkinnonOsa, index) => index !== tutkinnonOsaIndex);
}

function lisaaTutkinnonOsa() {
  muokattavaTiedote.value = {
    ...muokattavaTiedote.value,
    tutkinnonosat: [
      ...(muokattavaTiedote.value.tutkinnonosat || []),
      {},
    ],
  };
}

function poistaOsaamisala(osaamisalaIndex: number) {
  muokattavaTiedote.value.osaamisalat = _.filter(muokattavaTiedote.value.osaamisalat, (osaamisala, index) => index !== osaamisalaIndex);
}

function lisaaOsaamisala() {
  muokattavaTiedote.value = {
    ...muokattavaTiedote.value,
    osaamisalat: [
      ...(muokattavaTiedote.value.osaamisalat || []),
      {},
    ],
  };
}

const ammatillisetLisayksetSallittu = computed(() => {
  return !props.peruste || isAmmatillinenKoulutustyyppi(props.peruste.koulutustyyppi);
});

defineExpose({
  muokkaa,
});
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

  .peruste-linkitys-ohje {
    font-size: 0.8rem;
    color: $gray;
  }

  .voimassaolo {
    font-size:0.9rem;
  }

</style>
