<template>
  <div>

    <ep-button v-if="editable" icon="plussa" variant="outline" v-b-modal.tiedoteMuokkausModal @click="lisaaTiedote">{{ $t('lisaa-tiedote') }}</ep-button>

    <b-modal ref="tiedoteMuokkausModal"
        id="tiedoteMuokkausModal"
        size="lg">

      <template v-slot:modal-header>
        <div class="row w-100">
          <div class="col">
            <h2 v-if="!editing">{{$t('tiedote')}}</h2>
            <h2 v-else>{{ muokattavaTiedote.id ? $t('muokkaa-tiedotetta') : $t('lisaa-tiedote') }}</h2>
          </div>
          <div class="col text-right">
            <ep-kielivalinta />
          </div>
        </div>
      </template>

      <div v-if="editing">

        <ep-toggle class="mb-3" v-if="peruste" v-model="liitaPeruste">{{$t('liita-peruste-osaksi-tiedotetta')}}</ep-toggle>

        <ep-form-content name="tiedotteen-otsikko">
          <ep-input v-model="muokattavaTiedote.otsikko" :is-editing="editing" :validation="$v.muokattavaTiedote.otsikko"/>
        </ep-form-content>

        <ep-form-content name="tiedoteteksti">
          <ep-content v-model="muokattavaTiedote.sisalto" :is-editable="editing" layout="normal" :validation="$v.muokattavaTiedote.sisalto"> </ep-content>
        </ep-form-content>

        <ep-form-content name="valitse-missa-tiedote-julkaistaan">

          <ep-toggle class="pb-2 mt-3" v-model="opintopolkuJulkaisu" :isSWitch="false" :is-editing="editing"> {{ $t('tiedote-julkaisupaikka-opintopolku_etusivu')}} </ep-toggle>

          <div>
            <ep-toggle class="pb-2" v-model="opintopolkuJulkaisuKoulutustyyppiTutkinto" :isSWitch="false" :is-editing="editing">
              {{ $t('tiedote-julkaisupaikka-opintopolku-koulutus-ja-tutkintonakyma')}}
            </ep-toggle>

            <ep-multi-list-select
              v-if="opintopolkuJulkaisuKoulutustyyppiTutkinto"
              class="pl-5 pb-2"
              tyyppi="koulutuskohtainen-nakyma"
              :items="koulutustyyppiRyhmaItems"
              v-model="koulutusryypiRyhmaValinnat"
              :is-editing="editing"
              :required="true">

              <template v-slot:option="{option}">
                <ep-color-indicator :size="10" v-if="option.value && option.value.type" :tooltip="false" :kind="option.value.type"/>
                {{option.text}}
                </template>

              <template v-slot:singleLabel="{option}">
                <ep-color-indicator :size="10" v-if="option.value && option.value.type" :tooltip="false" :kind="option.value.type"/>
                {{option.text}}
              </template>

            </ep-multi-list-select>
          </div>

          <ep-toggle class="pb-2" v-model="opsJulkaisu" :isSWitch="false" :is-editing="editing"> {{ $t('tiedote-julkaisupaikka-ops')}} </ep-toggle>
          <ep-toggle class="pb-2" v-model="lopsJulkaisu" :isSWitch="false" :is-editing="editing"> {{ $t('tiedote-julkaisupaikka-lops')}} </ep-toggle>
          <ep-toggle class="pb-2" v-model="amosaaJulkaisu" :isSWitch="false" :is-editing="editing"> {{ $t('tiedote-julkaisupaikka-amosaa')}} </ep-toggle>
          <ep-toggle class="pb-2" v-model="vstJulkaisu" :isSWitch="false" :is-editing="editing"> {{ $t('tiedote-julkaisupaikka-vst')}} </ep-toggle>

        </ep-form-content>

        <ep-form-content name="liita-peruste-tiedotteeseen" v-if="!peruste && perusteet">
          <ep-spinner v-if="!perusteet" />
          <template v-else>
            <div class="peruste-linkitys-ohje mb-2">{{$t('valitsemasi-peruste-linkitetaan-osaksi-tiedotetta')}}</div>
            <ep-multi-list-select
                tyyppi="peruste"
                :items="perusteItems"
                v-model="muokattavaTiedote.perusteet"
                :is-editing="editing"
                :required="false"/>
          </template>
        </ep-form-content>

      </div>

      <div v-else>
        <div><h3>{{$kaanna(esittavaMuokkaustieto.otsikko)}}</h3></div>
        <div class="tiedote-muokkaustieto">
          {{$sdt(esittavaMuokkaustieto.muokattu)}}
          <span class="pl-3">{{muokkaavanKayttajanNimi}}</span>
        </div>

        <div class="mt-4" v-html="$kaanna(esittavaMuokkaustieto.sisalto)" :class="{ 'mb-5': naytaJulkaisupaikka }"></div>

        <div v-if="naytaJulkaisupaikka">
          <h6 v-if="opintopolkuJulkaisu || esittavaMuokkaustieto.filteredJulkaisupaikat.length > 0 || esittavaMuokkaustieto.filteredJulkaisusovellukset.length > 0">
            {{$t('tiedote-julkaistu')}}:
          </h6>

          <div class="mb-3" v-if="esittavaMuokkaustieto.filteredJulkaisupaikat.length > 0 || opintopolkuJulkaisu">
            {{$t('tiedote-julkaisupaikka-opintopolku')}}

            <div class="ml-4" v-if="opintopolkuJulkaisu">
              <ep-color-indicator class="mr-2" :size="6" :tooltip="false" kind="etusivu"/> {{$t('etusivu')}}
            </div>

            <div class="ml-4" v-for="(julkaisupaikka, index) in esittavaMuokkaustieto.filteredJulkaisupaikat" :key="index+'filteredjulkaisupaikka'">
              <ep-color-indicator class="mr-2" :size="6" :tooltip="false" :kind="julkaisupaikka"/> {{$t(julkaisupaikka)}}
            </div>
          </div>

          <div v-for="(julkaisusovellus, index) in esittavaMuokkaustieto.filteredJulkaisusovellukset" :key="index+'julkaisusovellus'">
            {{julkaisusovellus}}
          </div>
        </div>

        <div v-if="esittavaMuokkaustieto.filteredPerusteet.length > 0" class="mt-4">
          <h6>{{$t('liitetyt-perusteet')}}:</h6>
          <div v-for="(peruste, index) in esittavaMuokkaustieto.filteredPerusteet" :key="index+'filteredPerusteet'">
            {{peruste}}
          </div>
        </div>

      </div>

      <template v-slot:modal-footer>

        <div v-if="editing && editable">
          <ep-button @click="suljeTiedote" variant="link">{{ $t('peruuta') }}</ep-button>
          <ep-button @click="tallennaTiedote" class="ml-3" :disabled="$v.$invalid">{{ muokattavaTiedote.id ? $t('tallenna') : $t('julkaise-tiedote') }}</ep-button>
        </div>

        <div v-else class="d-flex justify-content-between w-100">
          <div v-if="editable">
            <ep-button icon="kyna" variant="link" @click="editing = true">{{ $t('muokkaa') }}</ep-button>
            <ep-button icon="roskalaatikko" variant="link" @click="poista">{{ $t('poista') }}</ep-button>
          </div>
          <div v-else />

          <ep-button @click="suljeTiedote">{{ $t('sulje') }}</ep-button>
        </div>

      </template>

    </b-modal>

  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Watch, Prop, Component, Vue, Mixins } from 'vue-property-decorator';
import { TiedoteDto, Kayttajat, PerusteHakuDto, PerusteDto, PerusteKevytDto } from '@shared/api/eperusteet';
import { parsiEsitysnimi } from '@shared/utils/kayttaja';
import { ITiedotteetProvider } from '@shared/stores/types';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpMultiListSelect, { MultiListSelectItem } from '@shared/components/forms/EpMultiListSelect.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import { required } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import { success, fail } from '@shared/utils/notifications';
import { julkaisupaikka, KoulutustyyppiRyhmaValinta } from '@shared/utils/tiedote';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import EpKielivalinta from '@shared/components/EpKielivalinta/EpKielivalinta.vue';
import { themes, ktToState, koulutustyyppiRyhmat, KoulutustyyppiRyhma, koulutustyyppiRyhmaSort } from '@shared/utils/perusteet';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import { Kielet } from '../../stores/kieli';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

@Component({
  components: {
    EpButton,
    EpFormContent,
    EpMultiSelect,
    EpInput,
    EpField,
    EpMultiListSelect,
    EpToggle,
    EpContent,
    EpKielivalinta,
    EpColorIndicator,
    EpSpinner,
  },
  validations: {
    muokattavaTiedote: {
      otsikko: {
        [Kielet.getSisaltoKieli.value]: {
          required,
        },
      },
      sisalto: {
        required,
        [Kielet.getSisaltoKieli.value]: {
          required,
        },
      },
    },
  },
} as any)
export default class EpTiedoteModal extends Mixins(validationMixin) {
  @Prop({ required: false })
  private perusteet!: PerusteHakuDto[];

  @Prop({ required: false })
  private peruste!: PerusteDto;

  @Prop({ required: false })
  private tiedotteetStore!: ITiedotteetProvider;

  @Prop({ required: false, default: true })
  private editable!: boolean;

  @Prop({ required: false, default: true })
  private naytaJulkaisupaikka!: boolean;

  private koulutusryypiRyhmaValinnat: KoulutustyyppiRyhmaValinta[] = [];

  private liitaPeruste: boolean = false;
  private opintopolkuJulkaisu: boolean = false;
  private opintopolkuJulkaisuKoulutustyyppiTutkinto: boolean = false;
  private opsJulkaisu: boolean = false;
  private lopsJulkaisu: boolean = false;
  private amosaaJulkaisu: boolean = false;
  private vstJulkaisu: boolean = false;
  private muokkaavanKayttajanNimi = '';
  private muokattavaTiedote: TiedoteDto = {};
  private editing: boolean = false;

  lisaaTiedote() {
    this.muokkaa({});
    this.aloitaMuokkaus();
  }

  async muokkaa(rivi: any) {
    this.muokattavaTiedote = _.cloneDeep(rivi);
    this.opintopolkuJulkaisu = _.includes(rivi.julkaisupaikat, julkaisupaikka.opintopolku_etusivu);
    this.opsJulkaisu = _.includes(rivi.julkaisupaikat, julkaisupaikka.ops);
    this.lopsJulkaisu = _.includes(rivi.julkaisupaikat, julkaisupaikka.lops);
    this.amosaaJulkaisu = _.includes(rivi.julkaisupaikat, julkaisupaikka.amosaa);
    this.vstJulkaisu = _.includes(rivi.julkaisupaikat, julkaisupaikka.vst);

    this.koulutusryypiRyhmaValinnat = [
      ..._.chain(this.koulutustyyppiRyhmaItems)
        .filter(item => _.some(item.value.object, koulutustyyppi => _.includes(rivi.koulutustyypit, koulutustyyppi)))
        .map(item => {
          return {
            ...item.value,
          } as KoulutustyyppiRyhmaValinta;
        })
        .value(),
    ];

    this.opintopolkuJulkaisuKoulutustyyppiTutkinto = !_.isEmpty(this.koulutusryypiRyhmaValinnat);

    this.muokattavaTiedote.perusteet = _.map(this.muokattavaTiedote.perusteet, peruste => this.perusteToKevytDto(peruste));

    if (this.muokattavaTiedote.luotu) {
      const kayttaja = (await Kayttajat.getKayttaja((this.muokattavaTiedote.muokkaaja as any))).data;
      if (kayttaja) {
        this.muokkaavanKayttajanNimi = parsiEsitysnimi(kayttaja);
      }
      else {
        this.muokkaavanKayttajanNimi = (this.muokattavaTiedote.muokkaaja as any);
      }
    }

    if (this.peruste) {
      this.liitaPeruste = true;
    }

    (this as any).$refs.tiedoteMuokkausModal.show();
  }

  get esittavaMuokkaustieto() {
    return {
      ...this.muokattavaTiedote,
      filteredJulkaisupaikat: [
        ..._.chain(this.muokattavaTiedote.koulutustyypit)
          .map(koulutustyyppi => themes[koulutustyyppi])
          .uniq()
          .value(),
      ],
      filteredJulkaisusovellukset: [
        ..._.chain([julkaisupaikka.ops, julkaisupaikka.lops, julkaisupaikka.amosaa])
          .filter(julkaisupaikka => _.includes(this.muokattavaTiedote.julkaisupaikat, julkaisupaikka))
          .map(julkaisupaikka => this.$t('tiedote-julkaisupaikka-' + julkaisupaikka))
          .value(),
      ],
      filteredPerusteet: [
        ..._.chain(this.muokattavaTiedote.perusteet)
          .filter(peruste => !_.isEmpty(this.perusteetById[(peruste as any).id]))
          .map(peruste => this.$kaanna((this.perusteetById[(peruste as any).id] as any).nimi))
          .uniq()
          .value(),
      ],
    };
  }

  get perusteetById() {
    return _.keyBy(this.perusteet, 'id');
  }

  aloitaMuokkaus() {
    this.editing = true;
  }

  suljeTiedote() {
    this.editing = false;
    (this as any).$refs.tiedoteMuokkausModal.hide();
  }

  get valitutKoulutustyypit(): string[] {
    return _.chain(this.koulutusryypiRyhmaValinnat)
      .map('object')
      .flatMap()
      .value();
  }

  async tallennaTiedote() {
    this.muokattavaTiedote.julkaisupaikat = _.chain(_.values(julkaisupaikka))
      .filter(value => value !== julkaisupaikka.opintopolku_etusivu || this.opintopolkuJulkaisu)
      .filter(value => value !== julkaisupaikka.ops || this.opsJulkaisu)
      .filter(value => value !== julkaisupaikka.lops || this.lopsJulkaisu)
      .filter(value => value !== julkaisupaikka.amosaa || this.amosaaJulkaisu)
      .filter(value => value !== julkaisupaikka.vst || this.vstJulkaisu)
      .value() as any;

    this.muokattavaTiedote.koulutustyypit = (this.valitutKoulutustyypit as any);

    if (this.peruste) {
      if (this.liitaPeruste) {
        if (!_.includes(_.map(this.muokattavaTiedote.perusteet, 'id'), this.peruste.id)) {
          this.muokattavaTiedote.perusteet = [
            ..._.map(this.muokattavaTiedote.perusteet),
            this.perusteToKevytDto(this.peruste),
          ];
        }
      }
      else {
        this.muokattavaTiedote.perusteet = _.filter(this.muokattavaTiedote.perusteet, peruste => peruste.id !== this.peruste.id);
      }
    }

    if (this.tiedotteetStore.save) {
      await this.tiedotteetStore.save(this.muokattavaTiedote);
      this.suljeTiedote();
      success('tiedote-tallennettu');
    }
  }

  private perusteToKevytDto(peruste): PerusteKevytDto {
    return {
      id: peruste.id,
      nimi: peruste.nimi,
    } as PerusteKevytDto;
  }

  async poista() {
    this.suljeTiedote();

    if (await this.vahvistaPoisto() && this.tiedotteetStore.delete) {
      await this.tiedotteetStore.delete(this.muokattavaTiedote);
      success('tiedote-poistettu');
    }
  }

  public async vahvistaPoisto() {
    const vahvistusSisalto = this.$createElement('div', {},
      [
        this.$createElement('div', this.$t('poista-tiedote-vahvistus') as string),
        this.$createElement('div', '"' + (this as any).$kaanna(this.muokattavaTiedote.otsikko) + '"'),
        this.$createElement('br', ''),
        this.$createElement('div', this.$t('poista-tiedote-varmistus') as string),
      ]
    ).children;

    return this.$bvModal.msgBoxConfirm((vahvistusSisalto as any), {
      title: this.$t('poista-tiedote-kysymys'),
      okVariant: 'primary',
      okTitle: this.$t('poista') as any,
      cancelVariant: 'link',
      cancelTitle: this.$t('peruuta') as any,
      centered: true,
      ...{} as any,
    });
  }

  get koulutustyyppiRyhmaItems(): MultiListSelectItem[] {
    return [
      ..._.chain(koulutustyyppiRyhmat())
        .map((koulutustyyppiryhma: KoulutustyyppiRyhma) => {
          return {
            text: this.$t(koulutustyyppiryhma.ryhma),
            value: {
              type: koulutustyyppiryhma.ryhma,
              object: koulutustyyppiryhma.koulutustyypit,
            },
          } as MultiListSelectItem;
        })
        .sortBy(koulutustyyppiryhma => koulutustyyppiRyhmaSort[koulutustyyppiryhma.value.type])
        .value(),
    ];
  }

  get perusteItems(): MultiListSelectItem[] {
    return [
      ..._.chain(_.keys(ktToState))
        .filter(koulutustyyppi => !_.isEmpty(_.keyBy(this.perusteet, 'koulutustyyppi')[koulutustyyppi]))
        .map((koulutustyyppi) => {
          return [
            {
              text: this.$t(koulutustyyppi),
              value: {
                type: 'koulutustyyppi',
                object: koulutustyyppi,
              },
              unselectable: true,
            } as MultiListSelectItem,
            ..._.chain(this.perusteet)
              .filter((peruste) => peruste.koulutustyyppi === koulutustyyppi)
              .map(peruste => {
                return {
                  text: (this as any).$kaanna(peruste.nimi),
                  value: this.perusteToKevytDto(peruste),
                  child: true,
                } as MultiListSelectItem;
              })
              .value(),
          ];
        })
        .flatten()
        .value(),
    ];
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

  .peruste-linkitys-ohje {
    font-size: 0.8rem;
    color: $gray;
  }
</style>
