<template>
  <div>
    <EpButton
      v-if="editable"
      v-oikeustarkastelu="oikeustarkastelu"
      icon="add"
      variant="outline"
      @click="lisaaTiedote"
    >
      {{ $t('lisaa-tiedote') }}
    </EpButton>

    <EpModal
      ref="modalRef"
      size="lg"
    >
      <template #modal-title>
        <div class="flex w-full gap-4 justify-between items-center">
          <div>
            <h2 v-if="!editing">
              {{ $t('tiedote') }}
            </h2>
            <h2 v-else>
              {{
                muokattavaTiedote.id
                  ? $t('muokkaa-tiedotetta')
                  : $t('lisaa-tiedote')
              }}
            </h2>
          </div>
          <div class="text-right">
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
              {{
                $t(
                  'tiedote-julkaisupaikka-opintopolku-koulutus-ja-tutkintonakyma',
                )
              }}
            </ep-toggle>

            <ep-multi-list-select
              v-if="opintopolkuJulkaisuKoulutustyyppiTutkinto"
              v-model="koulutustyyppiRyhmaValinnat"
              class="pl-5 pb-2"
              tyyppi="koulutuskohtainen-nakyma"
              :items="koulutustyyppiRyhmaItems"
              :is-editing="editing"
              :required="true"
            >
              <template #option="{ option }">
                <ep-color-indicator
                  v-if="option.value && option.value.type"
                  :size="10"
                  :tooltip="false"
                  :kind="option.value.type"
                />
                {{ option.text }}
              </template>

              <template #singleLabel="{ option }">
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
            v-model="amosaaJulkaisu"
            class="pb-2"
            :is-s-witch="false"
            :is-editing="editing"
          >
            {{ $t('tiedote-julkaisupaikka-totsu') }}
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
                  v-if="
                    option.value.voimassaoloAlkaa ||
                      option.value.voimassaoloLoppuu
                  "
                  class="ml-3 voimassaolo"
                >
                  (<span v-if="option.value.voimassaoloAlkaa">{{
                    $sd(option.value.voimassaoloAlkaa)
                  }}</span>-
                  <span v-if="option.value.voimassaoloLoppuu">{{
                    $sd(option.value.voimassaoloLoppuu)
                  }}</span>)
                </span>
              </template>
              <template #singleLabel="{ option }">
                {{ option.text }}
                <span
                  v-if="
                    option.value.voimassaoloAlkaa ||
                      option.value.voimassaoloLoppuu
                  "
                  class="ml-3 voimassaolo"
                >
                  (<span v-if="option.value.voimassaoloAlkaa">{{
                    $sd(option.value.voimassaoloAlkaa)
                  }}</span>-
                  <span v-if="option.value.voimassaoloLoppuu">{{
                    $sd(option.value.voimassaoloLoppuu)
                  }}</span>)
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
            v-for="(tutkinnonOsa, index) in muokattavaTiedote.tutkinnonosat ??
              []"
            :key="'tutkinnonOsa' + index"
            class="mb-1 flex justify-center items-center"
          >
            <ep-koodisto-select
              v-model="muokattavaTiedote.tutkinnonosat![index]"
              :store="tutkinnonOsaKoodisto"
              class="w-full"
            >
              <template #default="{ open }">
                <EpInputGroup class="w-full flex">
                  <ep-input
                    :model-value="$kaanna(tutkinnonOsa.nimi)"
                    :is-editing="true"
                    disabled
                  />
                  <template #append>
                    <EpButton
                      variant="primary"
                      @click="open"
                    >
                      {{ $t('hae') }}
                    </EpButton>
                  </template>
                </EpInputGroup>
              </template>
            </ep-koodisto-select>
            <div class="shrink-0 pl-2">
              <EpButton
                variant="link"
                icon="delete"
                @click="poistaTutkinnonosa(index)"
              />
            </div>
          </div>
          <EpButton
            button-class="pl-0"
            variant="outline-primary"
            icon="add"
            @click="lisaaTutkinnonOsa"
          >
            {{ $t('lisaa-tutkinnon-osa') }}
          </EpButton>
        </ep-form-content>

        <ep-form-content
          v-if="ammatillisetLisayksetSallittu"
          name="liita-osaamisala-tiedotteeseen"
        >
          <div
            v-for="(osaamisala, index) in muokattavaTiedote.osaamisalat ?? []"
            :key="'osaamisala' + index"
            class="mb-1 flex justify-center items-center"
          >
            <ep-koodisto-select
              v-model="muokattavaTiedote.osaamisalat![index]"
              :store="osaamisalaKoodisto"
              class="w-full"
            >
              <template #default="{ open }">
                <EpInputGroup class="w-full flex">
                  <ep-input
                    :model-value="$kaanna(osaamisala.nimi)"
                    :is-editing="true"
                    disabled
                  />
                  <template #append>
                    <EpButton
                      variant="primary"
                      @click="open"
                    >
                      {{ $t('hae') }}
                    </EpButton>
                  </template>
                </EpInputGroup>
              </template>
            </ep-koodisto-select>
            <div class="shrink-0 pl-2">
              <EpButton
                variant="link"
                icon="delete"
                @click="poistaOsaamisala(index)"
              />
            </div>
          </div>
          <EpButton
            button-class="pl-0"
            variant="outline-primary"
            icon="add"
            @click="lisaaOsaamisala"
          >
            {{ $t('lisaa-osaamisala') }}
          </EpButton>
        </ep-form-content>

        <ep-form-content name="liita-tiedote-tiedotteeseen">
          <div
            v-for="tiedote in muokattavaTiedote.tiedotteet ?? []"
            :key="tiedote.id"
            class="mb-1 flex justify-center items-center"
          >
            <EpInputGroup class="w-full flex">
              <ep-input
                :model-value="$kaanna(tiedote.otsikko)"
                :is-editing="true"
                disabled
              />
            </EpInputGroup>

            <div class="shrink-0 pl-2">
              <EpButton
                variant="link"
                icon="delete"
                @click="poistaLiitettyTiedote(tiedote.id)"
              />
            </div>
          </div>
          <EpButton
            button-class="pl-0"
            variant="outline-primary"
            icon="add"
            @click="avaaTiedoteValinta()"
          >
            {{ $t('lisaa-tiedote') }}
          </EpButton>
        </ep-form-content>
      </div>

      <div v-else>
        <div>
          <h3>{{ $kaanna(esittavaMuokkaustieto.otsikko) }}</h3>
        </div>
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
          <h6
            v-if="
              opintopolkuJulkaisu ||
                esittavaMuokkaustieto.filteredJulkaisupaikat.length > 0 ||
                esittavaMuokkaustieto.filteredJulkaisusovellukset.length > 0
            "
          >
            {{ $t('tiedote-julkaistu') }}:
          </h6>

          <div
            v-if="
              esittavaMuokkaustieto.filteredJulkaisupaikat.length > 0 ||
                opintopolkuJulkaisu
            "
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
              />
              {{ $t('etusivu') }}
            </div>

            <div
              v-for="(
                julkaisupaikka, index
              ) in esittavaMuokkaustieto.filteredJulkaisupaikat"
              :key="index + 'filteredjulkaisupaikka'"
              class="ml-4"
            >
              <ep-color-indicator
                class="mr-2"
                :size="6"
                :tooltip="false"
                :kind="julkaisupaikka"
              />
              {{ $t(julkaisupaikka) }}
            </div>
          </div>

          <div
            v-for="(
              julkaisusovellus, index
            ) in esittavaMuokkaustieto.filteredJulkaisusovellukset"
            :key="index + 'julkaisusovellus'"
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
            :key="index + 'filteredPerusteet'"
          >
            {{ peruste }}
          </div>
        </div>

        <div
          v-if="
            esittavaMuokkaustieto.tutkinnonosat &&
              esittavaMuokkaustieto.tutkinnonosat.length > 0
          "
          class="mt-4"
        >
          <h6>{{ $t('liitetyt-tutkinnonosat') }}:</h6>
          <div
            v-for="(tutkinnonosa, index) in esittavaMuokkaustieto.tutkinnonosat"
            :key="index + 'tutkinnonosa'"
          >
            {{ $kaanna(tutkinnonosa.nimi) }}
          </div>
        </div>

        <div
          v-if="
            esittavaMuokkaustieto.osaamisalat &&
              esittavaMuokkaustieto.osaamisalat.length > 0
          "
          class="mt-4"
        >
          <h6>{{ $t('liitetyt-osaamisalat') }}:</h6>
          <div
            v-for="(osaamisala, index) in esittavaMuokkaustieto.osaamisalat"
            :key="index + 'osaamisala'"
          >
            {{ $kaanna(osaamisala.nimi) }}
          </div>
        </div>

        <div
          v-if="esittavaMuokkaustieto.tiedotteet?.length"
          class="mt-4"
        >
          <h6>
            {{
              $t(
                esittavaMuokkaustieto.tiedotteet.length === 1
                  ? 'liitetty-tiedote'
                  : 'liitetyt-tiedotteet',
              )
            }}:
          </h6>
          <div
            v-for="tiedote in esittavaMuokkaustieto.tiedotteet"
            :key="tiedote.id"
          >
            <EpButton
              variant="link"
              button-class="p-0"
              @click="avaaLiittyvaTiedote(tiedote)"
            >
              {{ $kaanna(tiedote.otsikko) }}
            </EpButton>
          </div>
        </div>
      </div>

      <template #modal-footer>
        <template v-if="editing && editable">
          <EpButton
            variant="link"
            @click="suljeTiedote"
          >
            {{ $t('peruuta') }}
          </EpButton>
          <EpButton
            class="ml-3"
            :disabled="v$.$invalid"
            @click="tallennaTiedote"
          >
            {{ muokattavaTiedote.id ? $t('tallenna') : $t('julkaise-tiedote') }}
          </EpButton>
        </template>

        <template v-else>
          <template v-if="editable">
            <EpButton
              v-oikeustarkastelu="oikeustarkastelu"
              icon="edit"
              variant="link"
              @click="editing = true"
            >
              {{ $t('muokkaa') }}
            </EpButton>
            <EpButton
              v-oikeustarkastelu="oikeustarkastelu"
              icon="delete"
              variant="link"
              @click="poista"
            >
              {{ $t('poista') }}
            </EpButton>
          </template>
          <template v-else />

          <EpButton @click="suljeTiedote">
            {{ $t('sulje') }}
          </EpButton>
        </template>
      </template>
    </EpModal>
    <EpTiedoteSelect
      ref="tiedoteValinta"
      :hae="haeTiedotteet"
      :excluded-ids="poisRajatutTiedoteIdt"
      @select="valitseTiedote"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue';
import _ from 'lodash';
import {
  Kayttajat,
  PerusteDto,
  PerusteHakuDto,
  PerusteKevytDto,
  TiedoteDto,
  TiedoteDtoJulkaisupaikatEnum,
  TiedoteKevytDto,
} from '@shared/api/eperusteet';
import { parsiEsitysnimi } from '@shared/utils/kayttaja';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpMultiListSelect, {
  MultiListSelectItem,
} from '@shared/components/forms/EpMultiListSelect.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import {
  julkaisupaikka,
  KoulutustyyppiRyhmaValinta,
} from '@shared/utils/tiedote';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import EpKielivalinta from '@shared/components/EpKielivalinta/EpKielivalinta.vue';
import {
  isAmmatillinenKoulutustyyppi,
  KoulutustyyppiRyhma,
  koulutustyyppiRyhmaSort,
  koulutustyyppiRyhmat,
  ktToState,
  themes,
} from '@shared/utils/perusteet';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import {
  getKoodistoSivutettuna,
  KoodistoSelectStore,
} from '../EpKoodistoSelect/KoodistoSelectStore';
import EpInputGroup from '@shared/components/EpInputGroup/EpInputGroup.vue';
import EpKoodistoSelect from '@shared/components/EpKoodistoSelect/EpKoodistoSelect.vue';
import EpTiedoteSelect from '@shared/components/EpTiedoteModal/EpTiedoteSelect.vue';
import EpModal from '@shared/components/EpModal/EpModal.vue';
import { ITiedotteetProvider } from '@shared/stores/types';
import { requiredOneLang } from '@shared/validators/required';
import {
  $confirmModal,
  $fail,
  $kaanna,
  $sd,
  $sdt,
  $success,
  $t,
} from '@shared/utils/globals';

// Only the fields needed by the selector, allowing both PerusteHakuDto and
// PerusteKevytDto without requiring their incompatible tila enums to match.
type PerusteValinta = Pick<
  PerusteHakuDto,
  'id' | 'nimi' | 'koulutustyyppi' | 'voimassaoloAlkaa' | 'voimassaoloLoppuu'
>;

const modalRef = ref<InstanceType<typeof EpModal> | null>(null);

const props = defineProps({
  perusteet: {
    type: Array as () => PerusteValinta[],
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

const koulutustyyppiRyhmaValinnat = ref<KoulutustyyppiRyhmaValinta[]>([]);
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
    return (await getKoodistoSivutettuna(koodisto, query, sivu)) as any;
  },
});

const osaamisalaKoodisto = new KoodistoSelectStore({
  koodisto: 'osaamisala',
  async query(query: string, sivu = 0, koodisto: string) {
    return (await getKoodistoSivutettuna(koodisto, query, sivu)) as any;
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
        .map((koulutustyyppi) => themes[koulutustyyppi])
        .uniq()
        .value(),
    ],
    filteredJulkaisusovellukset: [
      ..._.chain([
        julkaisupaikka.ops,
        julkaisupaikka.lops,
        julkaisupaikka.amosaa,
      ])
        .filter((julkaisupaikka) =>
          _.includes(
            _.map(muokattavaTiedote.value.julkaisupaikat, _.toLower),
            _.toLower(julkaisupaikka),
          ),
        )
        .map((julkaisupaikka) => $t('tiedote-julkaisupaikka-' + julkaisupaikka))
        .value(),
    ],
    filteredPerusteet: [
      ..._.chain(muokattavaTiedote.value.perusteet)
        .filter(
          (peruste) => !_.isEmpty(perusteetById.value[(peruste as any).id]),
        )
        .map((peruste) =>
          $kaanna((perusteetById.value[(peruste as any).id] as any).nimi),
        )
        .uniq()
        .value(),
    ],
  };
});

const valitutKoulutustyypit = computed((): string[] => {
  return _.chain(koulutustyyppiRyhmaValinnat.value)
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
      .sortBy(
        (koulutustyyppiryhma) =>
          koulutustyyppiRyhmaSort[koulutustyyppiryhma.value.type],
      )
      .value(),
  ];
});

const perusteItems = computed((): MultiListSelectItem[] => {
  return [
    ..._.chain(_.keys(ktToState))
      .filter(
        (koulutustyyppi) =>
          !_.isEmpty(
            _.keyBy(props.perusteet, 'koulutustyyppi')[koulutustyyppi],
          ),
      )
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
            .map((peruste) => {
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
    koulutustyyppiRyhmaValinnat.value = [];
  }
});

// Methods
function resetForm() {
  muokattavaTiedote.value = {};
  opintopolkuJulkaisu.value = false;
  opintopolkuJulkaisuKoulutustyyppiTutkinto.value = false;
  opsJulkaisu.value = false;
  lopsJulkaisu.value = false;
  amosaaJulkaisu.value = false;
  vstJulkaisu.value = false;
  tuvaJulkaisu.value = false;
  kotoJulkaisu.value = false;
  koulutustyyppiRyhmaValinnat.value = [];
  muokkaavanKayttajanNimi.value = '';
  liitaPeruste.value = Boolean(props.peruste);
}

function lisaaTiedote() {
  resetForm();
  aloitaMuokkaus();
  modalRef.value?.show();
}

async function muokkaa(id: number | undefined) {
  if (id === undefined) {
    $fail($t('tiedotteen-haku-epaonnistui'));
    return;
  }

  try {
    const tiedote = await props.tiedotteetStore!.getTiedote(id);
    muokattavaTiedote.value = {
      ..._.cloneDeep(tiedote),
    };

    const julkaisupaikat: string[] = tiedote.julkaisupaikat ?? [];
    opintopolkuJulkaisu.value = julkaisupaikat.includes(
      julkaisupaikka.opintopolku_etusivu,
    );
    opsJulkaisu.value = julkaisupaikat.includes(julkaisupaikka.ops);
    lopsJulkaisu.value = julkaisupaikat.includes(julkaisupaikka.lops);
    amosaaJulkaisu.value = julkaisupaikat.includes(julkaisupaikka.amosaa);
    vstJulkaisu.value = julkaisupaikat.includes(julkaisupaikka.vst);
    tuvaJulkaisu.value = julkaisupaikat.includes(julkaisupaikka.tuva);
    kotoJulkaisu.value = julkaisupaikat.includes(julkaisupaikka.koto);

    koulutustyyppiRyhmaValinnat.value = [
      ..._.chain(koulutustyyppiRyhmaItems.value)
        .filter((item) =>
          _.some(item.value.object, (koulutustyyppi) =>
            _.includes(tiedote.koulutustyypit, koulutustyyppi),
          ),
        )
        .map((item) => {
          return {
            ...item.value,
          } as KoulutustyyppiRyhmaValinta;
        })
        .value(),
    ];

    opintopolkuJulkaisuKoulutustyyppiTutkinto.value = !_.isEmpty(
      koulutustyyppiRyhmaValinnat.value,
    );

    muokattavaTiedote.value.perusteet = _.map(
      muokattavaTiedote.value.perusteet,
      (peruste) => perusteToKevytDto(peruste),
    );

    if (muokattavaTiedote.value.luotu) {
      const kayttaja = (
        await Kayttajat.getKayttaja(muokattavaTiedote.value.muokkaaja as any)
      ).data;
      if (kayttaja) {
        muokkaavanKayttajanNimi.value = parsiEsitysnimi(kayttaja);
      }
      else {
        muokkaavanKayttajanNimi.value = muokattavaTiedote.value
          .muokkaaja as any;
      }
    }

    if (props.peruste) {
      liitaPeruste.value = true;
    }

    modalRef.value?.show();
  }
  catch {
    $fail($t('tiedotteen-haku-epaonnistui'));
  }
}

function aloitaMuokkaus() {
  editing.value = true;
}

async function avaaLiittyvaTiedote(tiedote: TiedoteKevytDto) {
  tiedoteValinta.value?.close();
  await muokkaa(tiedote.id);
}

function suljeTiedote() {
  tiedoteValinta.value?.close();
  editing.value = false;
  modalRef.value?.hide();
}

async function tallennaTiedote() {
  muokattavaTiedote.value.julkaisupaikat = _.chain(_.values(julkaisupaikka))
    .filter(
      (value) =>
        value !== julkaisupaikka.opintopolku_etusivu
        || opintopolkuJulkaisu.value,
    )
    .filter((value) => value !== julkaisupaikka.ops || opsJulkaisu.value)
    .filter((value) => value !== julkaisupaikka.lops || lopsJulkaisu.value)
    .filter((value) => value !== julkaisupaikka.amosaa || amosaaJulkaisu.value)
    .filter((value) => value !== julkaisupaikka.vst || vstJulkaisu.value)
    .filter((value) => value !== julkaisupaikka.tuva || tuvaJulkaisu.value)
    .filter((value) => value !== julkaisupaikka.koto || kotoJulkaisu.value)
    .value() as any;

  muokattavaTiedote.value.koulutustyypit = valitutKoulutustyypit.value as any;
  if (muokattavaTiedote.value.koulutustyypit?.length || 0 > 0) {
    muokattavaTiedote.value.julkaisupaikat?.push(
      TiedoteDtoJulkaisupaikatEnum.OPINTOPOLKU,
    );
  }
  else {
    muokattavaTiedote.value.julkaisupaikat?.filter(
      (value) => value !== TiedoteDtoJulkaisupaikatEnum.OPINTOPOLKU,
    );
  }

  if (props.peruste) {
    if (liitaPeruste.value) {
      if (
        !_.includes(
          _.map(muokattavaTiedote.value.perusteet, 'id'),
          props.peruste.id,
        )
      ) {
        muokattavaTiedote.value.perusteet = [
          ..._.map(muokattavaTiedote.value.perusteet),
          perusteToKevytDto(props.peruste),
        ];
      }
    }
    else {
      muokattavaTiedote.value.perusteet = _.filter(
        muokattavaTiedote.value.perusteet,
        (peruste) => peruste.id !== props.peruste?.id,
      );
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

  if ((await vahvistaPoisto()) && props.tiedotteetStore?.delete) {
    await props.tiedotteetStore.delete(muokattavaTiedote.value);
    $success($t('tiedote-poistettu'));
  }
}

async function vahvistaPoisto() {
  const vahvistusSisalto = h('div', {}, [
    h('div', $t('poista-tiedote-vahvistus') as string),
    h('div', '"' + $kaanna(muokattavaTiedote.value.otsikko) + '"'),
    h('br', ''),
    h('div', $t('poista-tiedote-varmistus') as string),
  ]).children;

  return $confirmModal.msgBoxConfirm(vahvistusSisalto as any, {
    title: $t('poista-tiedote-kysymys'),
    okVariant: 'primary',
    okTitle: $t('poista') as any,
    cancelVariant: 'link',
    cancelTitle: $t('peruuta') as any,
    centered: true,
    ...({} as any),
  });
}

function poistaTutkinnonosa(tutkinnonOsaIndex: number) {
  muokattavaTiedote.value.tutkinnonosat = _.filter(
    muokattavaTiedote.value.tutkinnonosat,
    (_tutkinnonOsa, index) => index !== tutkinnonOsaIndex,
  );
}

function lisaaTutkinnonOsa() {
  muokattavaTiedote.value = {
    ...muokattavaTiedote.value,
    tutkinnonosat: [...(muokattavaTiedote.value.tutkinnonosat || []), {}],
  };
}

function poistaOsaamisala(osaamisalaIndex: number) {
  muokattavaTiedote.value.osaamisalat = _.filter(
    muokattavaTiedote.value.osaamisalat,
    (_osaamisala, index) => index !== osaamisalaIndex,
  );
}

function lisaaOsaamisala() {
  muokattavaTiedote.value = {
    ...muokattavaTiedote.value,
    osaamisalat: [...(muokattavaTiedote.value.osaamisalat || []), {}],
  };
}

const ammatillisetLisayksetSallittu = computed(() => {
  return (
    !props.peruste || isAmmatillinenKoulutustyyppi(props.peruste.koulutustyyppi)
  );
});

const tiedoteValinta = ref<InstanceType<typeof EpTiedoteSelect> | null>(null);

const poisRajatutTiedoteIdt = computed((): number[] => {
  const ids = (muokattavaTiedote.value.tiedotteet ?? [])
    .map((tiedote) => tiedote.id)
    .filter((id): id is number => id != null);

  if (muokattavaTiedote.value.id != null) {
    ids.push(muokattavaTiedote.value.id);
  }

  return ids;
});

const haeTiedotteet = computed(() => {
  return (query: string, sivu: number) =>
    props.tiedotteetStore!.search({
      sivu,
      sivukoko: 10,
      nimi: query || undefined,
      jarjestys: 'luotu',
      jarjestysNouseva: false,
    });
});

function avaaTiedoteValinta() {
  tiedoteValinta.value?.openDialog();
}

function valitseTiedote(tiedote: TiedoteKevytDto) {
  muokattavaTiedote.value.tiedotteet = [
    ...(muokattavaTiedote.value.tiedotteet ?? []),
    tiedote,
  ];
}

function poistaLiitettyTiedote(id: number | undefined) {
  muokattavaTiedote.value.tiedotteet = (
    muokattavaTiedote.value.tiedotteet ?? []
  ).filter((t) => t.id !== id);
}

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
  font-size: 0.9rem;
}
</style>
