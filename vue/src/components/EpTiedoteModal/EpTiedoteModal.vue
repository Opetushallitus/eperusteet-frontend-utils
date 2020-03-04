<template>
  <div>

    <ep-button icon="plussa" variant="outline" v-b-modal.tiedoteMuokkausModal @click="lisaaTiedote">{{ $t('lisaa-tiedote') }}</ep-button>

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
        <ep-form-content name="tiedotteen-otsikko">
          <ep-input v-model="muokattavaTiedote.otsikko" :is-editing="editing" :validation="$v.muokattavaTiedote.otsikko"/>
        </ep-form-content>

        <ep-form-content name="tiedoteteksti">
          <ep-content v-model="muokattavaTiedote.sisalto" :is-editable="editing" layout="normal" :validation="$v.muokattavaTiedote.sisalto"> </ep-content>
        </ep-form-content>

        <ep-form-content name="valitse-missa-tiedote-julkaistaan">

          <ep-toggle class="pb-2 mt-3" v-model="opintopolkuJulkaisu" :isSWitch="false" :is-editing="editing"> {{ $t('tiedote-julkaisupaikka-opintopolku_etusivu')}} </ep-toggle>

          <div v-if="perusteet">
            <ep-toggle class="pb-2" v-model="opintopolkuJulkaisuKoulutustyyppiTutkinto" :isSWitch="false" :is-editing="editing">
              {{ $t('tiedote-julkaisupaikka-opintopolku-koulutus-ja-tutkintonakyma')}}
            </ep-toggle>

            <ep-multi-list-select
              v-if="opintopolkuJulkaisuKoulutustyyppiTutkinto"
              class="pl-5 pb-2"
              tyyppi="koulutustyyppi-tai-tutkinto"
              :items="koulutustyyppiTaiTutkintoItems"
              v-model="koulutustyypitTaiTutkinnot"
              :is-editing="editing"
              :required="true">

              <template v-slot:option="{option}">
                <ep-color-indicator :size="10" v-if="option.value && option.value.type && option.value.type !=='peruste'" :tooltip="false" :kind="option.value.type"/>
                {{option.text}}
              </template>

            </ep-multi-list-select>
          </div>

          <ep-toggle class="pb-2" v-model="opsJulkaisu" :isSWitch="false" :is-editing="editing"> {{ $t('tiedote-julkaisupaikka-ops')}} </ep-toggle>
          <ep-toggle class="pb-2" v-model="lopsJulkaisu" :isSWitch="false" :is-editing="editing"> {{ $t('tiedote-julkaisupaikka-lops')}} </ep-toggle>
          <ep-toggle class="pb-2" v-model="amosaaJulkaisu" :isSWitch="false" :is-editing="editing"> {{ $t('tiedote-julkaisupaikka-amosaa')}} </ep-toggle>

        </ep-form-content>

        <ep-form-content name="linkita-perusteprojekti-tiedotteeseen" v-if="!peruste && perusteet">
          <div class="peruste-linkitys-ohje mb-2">{{$t('valitsemasi-peruste-linkitetaan-osaksi-tiedotetta')}}</div>
          <ep-multi-list-select
              tyyppi="perusteprojekti"
              :items="perusteItems"
              v-model="tutkinnot"
              :is-editing="editing"
              :required="false"/>
        </ep-form-content>

      </div>

      <div v-else>
        <div><h3>{{$kaanna(esittavaMuokkaustieto.otsikko)}}</h3></div>
        <div class="tiedote-muokkaustieto">
          {{$sdt(esittavaMuokkaustieto.muokattu)}}
          <span class="pl-3">{{muokkaavanKayttajanNimi}}</span>
        </div>

        <div class="mb-5 mt-4" v-html="$kaanna(esittavaMuokkaustieto.sisalto)"></div>

        <h6 v-if="esittavaMuokkaustieto.filteredJulkaisupaikat.length > 0 || esittavaMuokkaustieto.filteredJulkaisusovellukset.length > 0">
          {{$t('tiedote-julkaistu')}}:
        </h6>

        <div v-if="esittavaMuokkaustieto.filteredJulkaisupaikat.length > 0">
          {{$t('tiedote-julkaisupaikka-opintopolku')}}
          <ul>
            <li v-for="(julkaisupaikka, index) in esittavaMuokkaustieto.filteredJulkaisupaikat" :key="index+'filteredjulkaisupaikka'">
              {{julkaisupaikka}}
            </li>
          </ul>
        </div>

        <div v-for="(julkaisusovellus, index) in esittavaMuokkaustieto.filteredJulkaisusovellukset" :key="index+'julkaisusovellus'">
          {{julkaisusovellus}}
        </div>

        <div v-if="esittavaMuokkaustieto.filteredPerusteet.length > 0" class="mt-4">
          <h6>{{$t('linkitetyt-perusteprojektit')}}:</h6>
          <div v-for="(peruste, index) in esittavaMuokkaustieto.filteredPerusteet" :key="index+'filteredPerusteet'">
            {{peruste}}
          </div>
        </div>

      </div>

      <template v-slot:modal-footer>

        <div v-if="editing">
          <ep-button @click="suljeTiedote" variant="link">{{ $t('peruuta') }}</ep-button>
          <ep-button @click="tallennaTiedote" class="ml-3" :disabled="$v.$invalid">{{ muokattavaTiedote.id ? $t('tallenna') : $t('julkaise-tiedote') }}</ep-button>
        </div>

        <div v-else class="d-flex justify-content-between w-100">
          <div>
            <ep-button icon="kyna" variant="link" @click="editing = true">{{ $t('muokkaa') }}</ep-button>
            <ep-button icon="roskalaatikko" variant="link" @click="poista">{{ $t('poista') }}</ep-button>
          </div>

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
import { parsiEsitysnimi } from '@shared/stores/kayttaja';
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
import { KoulutustyyppiTaiTutkinto, KoulutustyyppiTaiTutkintoItem, julkaisupaikkaSort, julkaisupaikka } from '@shared/utils/tiedote';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import EpKielivalinta from '@shared/components/EpKielivalinta/EpKielivalinta.vue';
import { themes, ktToState, perustetila, koulutustyyppiRyhmat, KoulutustyyppiRyhma, koulutustyyppiRyhmaSort } from '@shared/utils/perusteet';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';

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
  },
  validations: {
    muokattavaTiedote: {
      otsikko: {
        required,
      },
      sisalto: {
        required,
      },
    },
  },
} as any)
export default class EpTiedoteModal extends Mixins(validationMixin) {
  @Prop({ required: false })
  private perusteet!: PerusteHakuDto[];

  @Prop({ required: false })
  private peruste!: PerusteDto;

  @Prop({ required: true })
  private tiedotteetStore!: ITiedotteetProvider;

  private koulutustyypitTaiTutkinnot: KoulutustyyppiTaiTutkinto[] = [];
  private tutkinnot: KoulutustyyppiTaiTutkinto[] = [];

  private opintopolkuJulkaisu: boolean = false;
  private opintopolkuJulkaisuKoulutustyyppiTutkinto: boolean = false;
  private opsJulkaisu: boolean = false;
  private lopsJulkaisu: boolean = false;
  private amosaaJulkaisu: boolean = false;
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

    this.koulutustyypitTaiTutkinnot = [
      ..._.chain(this.koulutustyyppiTaiTutkintoItems)
        .filter(item => item.value && item.value.type !== 'peruste')
        .filter(item => _.some(item.value.object, koulutustyyppi => _.includes(rivi.koulutustyypit, koulutustyyppi)))
        .map(item => {
          return {
            ...item.value,
          } as KoulutustyyppiTaiTutkinto;
        })
        .value(),
      ..._.chain(this.koulutustyyppiTaiTutkintoItems)
        .filter(item => item.value && item.value.type === 'peruste')
        .filter(item => !_.isEmpty(_.keyBy(rivi.perusteet, 'id')[item.value.object]))
        .map(item => {
          return {
            ...item.value,
          } as KoulutustyyppiTaiTutkinto;
        })
        .value(),
    ];

    this.opintopolkuJulkaisuKoulutustyyppiTutkinto = !_.isEmpty(this.koulutustyypitTaiTutkinnot);

    this.tutkinnot = _.chain(rivi.perusteet)
      .map(peruste => {
        return {
          type: 'peruste',
          object: peruste.id,
        } as KoulutustyyppiTaiTutkinto;
      })
      .value();

    if (this.muokattavaTiedote.luotu) {
      const kayttaja = (await Kayttajat.getKayttaja((this.muokattavaTiedote.muokkaaja as any))).data;
      if (kayttaja) {
        this.muokkaavanKayttajanNimi = parsiEsitysnimi(kayttaja);
      }
      else {
        this.muokkaavanKayttajanNimi = (this.muokattavaTiedote.muokkaaja as any);
      }
    }

    (this as any).$refs.tiedoteMuokkausModal.show();
  }

  get esittavaMuokkaustieto() {
    return {
      ...this.muokattavaTiedote,
      filteredJulkaisupaikat: [
        ..._.chain(this.opintopolkuJulkaisu ? [this.opintopolkuJulkaisu] : [])
          .map(julkaisukanava => this.$t('etusivu'))
          .value(),
        ..._.chain(this.muokattavaTiedote.koulutustyypit)
          .map(koulutustyyppi => this.$t(themes[koulutustyyppi]))
          .uniq()
          .value(),
        ..._.chain(this.muokattavaTiedote.perusteet)
          .filter(peruste => _.includes(this.tutkintonakymaKoulutustyypit, peruste.koulutustyyppi))
          .filter(peruste => !_.isEmpty(this.perusteetById[(peruste as any).id]))
          .map(peruste => this.$kaanna((this.perusteetById[(peruste as any).id] as any).nimi))
          .uniq()
          .value()
      ],
      filteredJulkaisusovellukset: [
        ..._.chain([julkaisupaikka.ops, julkaisupaikka.lops, julkaisupaikka.amosaa])
          .filter(julkaisupaikka => _.includes(this.muokattavaTiedote.julkaisupaikat, julkaisupaikka))
          .map(julkaisupaikka => this.$t('tiedote-julkaisupaikka-' + julkaisupaikka))
          .value(),
      ],
      filteredPerusteet: [
        ..._.chain(this.muokattavaTiedote.perusteet)
          .filter(peruste => !_.includes(this.tutkintonakymaKoulutustyypit, peruste.koulutustyyppi))
          .filter(peruste => !_.isEmpty(this.perusteetById[(peruste as any).id]))
          .map(peruste => this.$kaanna((this.perusteetById[(peruste as any).id] as any).nimi))
          .uniq()
          .value()
      ]
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

  get valitutKoulutustyypit() {
    return _.chain(this.koulutustyypitTaiTutkinnot)
      .filter((koulutustyyppiTaiTutkinto: KoulutustyyppiTaiTutkinto) => koulutustyyppiTaiTutkinto.type !== 'peruste')
      .map('object')
      .flatMap()
      .value();
  }

  get valitutPerusteet() {
    return [
      ..._.chain(this.koulutustyypitTaiTutkinnot)
        .filter((koulutustyyppiTaiTutkinto: KoulutustyyppiTaiTutkinto) => koulutustyyppiTaiTutkinto.type === 'peruste')
        .map('object')
        .value(),
      ..._.chain(this.tutkinnot)
        .map('object')
        .value()
    ];
  }

  async tallennaTiedote() {
    this.muokattavaTiedote.julkaisupaikat = _.chain(_.values(julkaisupaikka))
      .filter(value => value !== julkaisupaikka.opintopolku_etusivu || this.opintopolkuJulkaisu)
      .filter(value => value !== julkaisupaikka.ops || this.opsJulkaisu)
      .filter(value => value !== julkaisupaikka.lops || this.lopsJulkaisu)
      .filter(value => value !== julkaisupaikka.amosaa || this.amosaaJulkaisu)
      .value() as any;

    if (!this.peruste) {
      this.muokattavaTiedote.perusteet = _.map(this.valitutPerusteet, (perusteId) => this.perusteHakuToPerusteKevyt(this.perusteetById[perusteId]));
      this.muokattavaTiedote.koulutustyypit = this.valitutKoulutustyypit;
    }
    else {
      if (!this.muokattavaTiedote.id) {
        this.muokattavaTiedote.perusteet = [this.perusteToPerusteKevyt(this.peruste)];
      }
    }

    await this.tiedotteetStore.save(this.muokattavaTiedote);
    this.suljeTiedote();
    success('tiedote-tallennettu');
  }

  private perusteHakuToPerusteKevyt(perusteHaku: PerusteHakuDto): PerusteKevytDto {
    return {
      id: perusteHaku.id,
      nimi: perusteHaku.nimi,
    } as PerusteKevytDto;
  }

  private perusteToPerusteKevyt(peruste: PerusteDto): PerusteKevytDto {
    return {
      id: peruste.id,
      nimi: peruste.nimi,
    } as PerusteKevytDto;
  }

  async poista() {
    this.suljeTiedote();

    if (await this.vahvistaPoisto()) {
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

  get koulutustyyppiTaiTutkintoItems(): MultiListSelectItem[] {
    return [
      {
        text: this.$t('paanakymat'),
        unselectable: true,
      } as MultiListSelectItem,
      ..._.chain(koulutustyyppiRyhmat())
        .map((koulutustyyppiryhma: KoulutustyyppiRyhma) => {
          return {
            text: this.$t(koulutustyyppiryhma.ryhma),
            value: {
              type: koulutustyyppiryhma.ryhma,
              object: koulutustyyppiryhma.koulutustyypit,
            },
            child: true,
          } as MultiListSelectItem;
        })
        .sortBy(koulutustyyppiryhma => koulutustyyppiRyhmaSort[koulutustyyppiryhma.value.type])
        .value(),
      {
        text: this.$t('tutkintojen-nakymat'),
        unselectable: true,
      } as MultiListSelectItem,
      ..._.chain(this.perusteet)
        .filter((peruste) => _.includes(this.tutkintonakymaKoulutustyypit, peruste.koulutustyyppi))
        .map(peruste => {
          return {
            text: (this as any).$kaanna(peruste.nimi),
            value: {
              type: 'peruste',
              object: peruste.id,
            },
            child: true,
          } as MultiListSelectItem;
        })
        .value(),
    ];
  }

  get tutkintonakymaKoulutustyypit() {
    return ['koulutustyyppi_1', 'koulutustyyppi_11', 'koulutustyyppi_12', 'koulutustyyppi_18', 'koulutustyyppi_5'];
  }

  get perusteItems(): MultiListSelectItem[] {
    return [
      ..._.chain(_.keys(ktToState))
        .filter((koulutustyyppi) => !_.includes(this.tutkintonakymaKoulutustyypit, koulutustyyppi))
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
                  value: {
                    type: 'peruste',
                    object: peruste.id,
                  },
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
@import '@/styles/_variables';

  .peruste-linkitys-ohje {
    font-size: 0.8rem;
    color: $gray;
  }
</style>
