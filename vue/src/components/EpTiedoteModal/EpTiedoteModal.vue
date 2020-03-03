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

          <div v-if="perusteet">
            <ep-toggle class="pb-2" v-model="opintopolkuJulkaisuKoulutustyyppiTutkinto" :isSWitch="false" :is-editing="editing"> {{ $t('koulutustyyppi-tai-tutkintokohtainen-sivu')}} </ep-toggle>

            <ep-multi-list-select
              v-if="opintopolkuJulkaisuKoulutustyyppiTutkinto"
              class="pl-5 pb-2"
              tyyppi="koulutustyyppi-tai-tutkinto"
              :items="koulutustyyppiTaiTutkintoItems"
              v-model="koulutustyypitTaiTutkinnot"
              :is-editing="editing"
              :required="true"/>
          </div>

          <ep-toggle class="pb-2 mt-3" v-model="opintopolkuJulkaisu" :isSWitch="false" :is-editing="editing"> {{ $t('tiedote-julkaisupaikka-opintopolku')}} </ep-toggle>
          <ep-toggle class="ml-5 pb-2" v-if="opintopolkuJulkaisu" v-model="opintopolkuJulkaisuEtusivu" :isSWitch="false" :is-editing="editing"> {{ $t('eperusteet-etusivu')}} </ep-toggle>

          <ep-toggle class="pb-2" v-model="opsJulkaisu" :isSWitch="false" :is-editing="editing"> {{ $t('tiedote-julkaisupaikka-ops')}} </ep-toggle>
          <ep-toggle class="pb-2" v-model="lopsJulkaisu" :isSWitch="false" :is-editing="editing"> {{ $t('tiedote-julkaisupaikka-lops')}} </ep-toggle>
          <ep-toggle class="pb-2" v-model="amosaaJulkaisu" :isSWitch="false" :is-editing="editing"> {{ $t('tiedote-julkaisupaikka-amosaa')}} </ep-toggle>

        </ep-form-content>

      </div>

      <div v-else>
        <div><h3>{{$kaanna(esittavaMuokkaustieto.otsikko)}}</h3></div>
        <div class="tiedote-muokkaustieto">
          {{$sdt(esittavaMuokkaustieto.muokattu)}}
          <span class="pl-3">{{muokkaavanKayttajanNimi}}</span>
        </div>

        <div class="mb-5 mt-4" v-html="$kaanna(muokattavaTiedote.sisalto)"></div>

        <h6>{{$t('tiedote-julkaistu')}}</h6>

        <ul>
          <li v-if="esittavaMuokkaustieto.koulutustyypit && esittavaMuokkaustieto.koulutustyypit.length > 0">
            {{$t('koulutustyypit')}}
            <ul>
              <li v-for="(koulutustyyppi, index) in esittavaMuokkaustieto.koulutustyypit" :key="index">
                {{$t(koulutustyyppi)}}
              </li>
            </ul>
          </li>
            <li v-if="esittavaMuokkaustieto.perusteet && esittavaMuokkaustieto.perusteet.length > 0">
            {{$t('perusteet')}}
            <ul>
              <li v-for="(peruste, index) in esittavaMuokkaustieto.perusteet" :key="index">
                {{$kaanna(peruste.nimi)}}
              </li>
            </ul>
          </li>
          <li v-for="(paikka, index) in esittavaMuokkaustieto.filteredJulkaisupaikat" :key="index">
            {{$t('tiedote-julkaisupaikka-' + paikka)}}
            <ul v-if="paikka === 'opintopolku'">
              <li v-if="esittavaMuokkaustieto.opintopolkuEtusivu">{{ $t('eperusteet-etusivu')}}</li>
            </ul>

          </li>
        </ul>
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
import EpMultiListSelect from '@shared/components/forms/EpMultiListSelect.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import { required } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import { success, fail } from '@shared/utils/notifications';
import { KoulutustyyppiTaiTutkinto, KoulutustyyppiTaiTutkintoItem, julkaisupaikkaSort } from '@shared/utils/tiedote';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import EpKielivalinta from '@shared/components/EpKielivalinta/EpKielivalinta.vue';

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

  @Prop({ required: false })
  private koulutustyyppiTaiTutkintoItems!: KoulutustyyppiTaiTutkintoItem;

  private koulutustyypitTaiTutkinnot: KoulutustyyppiTaiTutkinto[] = [];
  private opintopolkuJulkaisu: boolean = false;
  private opintopolkuJulkaisuEtusivu: boolean = false;
  private opintopolkuJulkaisuKoulutustyyppiTutkinto: boolean = false;
  private opsJulkaisu: boolean = false;
  private lopsJulkaisu: boolean = false;
  private amosaaJulkaisu: boolean = false;
  private muokkaavanKayttajanNimi = '';
  private muokattavaTiedote: TiedoteDto = {};
  private editing: boolean = false;

  @Watch('opintopolkuJulkaisu')
  async onValueChanged(newVal: any) {
    if (!newVal) {
      this.opintopolkuJulkaisuEtusivu = false;
    }
  }

  lisaaTiedote() {
    this.muokkaa({});
    this.aloitaMuokkaus();
  }

  async muokkaa(rivi: any) {
    this.muokattavaTiedote = _.cloneDeep(rivi);
    this.opintopolkuJulkaisu = _.includes(rivi.julkaisupaikat, 'opintopolku');
    this.opsJulkaisu = _.includes(rivi.julkaisupaikat, 'ops');
    this.lopsJulkaisu = _.includes(rivi.julkaisupaikat, 'lops');
    this.amosaaJulkaisu = _.includes(rivi.julkaisupaikat, 'amosaa');
    this.opintopolkuJulkaisuEtusivu = _.includes(rivi.julkaisupaikat, 'opintopolku_etusivu');
    this.opintopolkuJulkaisuKoulutustyyppiTutkinto = !_.isEmpty(rivi.koulutustyypit);

    this.koulutustyypitTaiTutkinnot = [
      ..._.map(rivi.koulutustyypit, (koulutustyyppi) => {
        return {
          type: 'koulutustyyppi',
          object: koulutustyyppi,
        };
      }),
      ..._.map(rivi.perusteet, (peruste) => {
        return {
          type: 'peruste',
          object: peruste.id,
        };
      }),
    ];

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
      filteredJulkaisupaikat: _.chain(this.muokattavaTiedote.julkaisupaikat)
        .filter((julkaisupaikka) => (julkaisupaikka as any) !== 'opintopolku_etusivu')
        .sortBy((julkaisupaikka) => julkaisupaikkaSort[julkaisupaikka])
        .value(),
      opintopolkuEtusivu: _.includes((this.muokattavaTiedote.julkaisupaikat as any), 'opintopolku_etusivu'),
    };
  }

  aloitaMuokkaus() {
    this.editing = true;
  }

  suljeTiedote() {
    this.editing = false;
    (this as any).$refs.tiedoteMuokkausModal.hide();
  }

  async tallennaTiedote() {
    this.muokattavaTiedote.julkaisupaikat = _.chain(['opintopolku', 'opintopolku_etusivu', 'ops', 'lops', 'amosaa'])
      .filter(value => value !== 'opintopolku' || this.opintopolkuJulkaisu)
      .filter(value => value !== 'opintopolku_etusivu' || this.opintopolkuJulkaisuEtusivu)
      .filter(value => value !== 'ops' || this.opsJulkaisu)
      .filter(value => value !== 'lops' || this.opsJulkaisu)
      .filter(value => value !== 'amosaa' || this.amosaaJulkaisu)
      .value() as any;

    this.muokattavaTiedote.koulutustyypit = _.map(_.filter(this.koulutustyypitTaiTutkinnot, (ktt) => ktt.type === 'koulutustyyppi'), 'object');
    const perusteetIdlla = _.keyBy(this.perusteet, 'id');

    if (this.peruste) {
      this.muokattavaTiedote.perusteet = [
        this.perusteToPerusteKevyt(this.peruste)
      ];
    }
    else {
      this.muokattavaTiedote.perusteet = _.map(_.filter(this.koulutustyypitTaiTutkinnot, (ktt) => ktt.type === 'peruste'), (koulutustyyppitutkinto) => this.perusteHakuToPerusteKevyt(perusteetIdlla[koulutustyyppitutkinto.object]));
    }

    if (!this.peruste && !this.opintopolkuJulkaisuKoulutustyyppiTutkinto) {
      this.muokattavaTiedote.koulutustyypit = [];
      this.muokattavaTiedote.perusteet = [];
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
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables';

</style>
