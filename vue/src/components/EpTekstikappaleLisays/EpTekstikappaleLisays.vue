<template>
<div>
  <div v-b-modal="modalId">
    <slot name="lisays-btn">
      <ep-button id="tekstikappalelisaysBtn" variant="link" buttonClass="text-decoration-none">
          <slot name="lisays-btn-icon">
            <EpMaterialIcon :color="'inherit'" :background="'inherit'" size="18px">add</EpMaterialIcon>
          </slot>
          <span>
            <slot name="lisays-btn-text">
              {{ $t('uusi-tekstikappale') }}
            </slot>
          </span>
      </ep-button>
    </slot>
  </div>
  <b-modal ref="tekstikappalelisaysModal"
           :id="modalId"
           size="lg"
           centered
           @hidden="clear">
    <template v-slot:modal-title>
      <slot name="modal-title">
        {{ $t('lisaa-uusi-tekstikappale') }}
      </slot>
    </template>

    <div class="mb-4">
      <template v-if="osaamisalat && osaamisalat.length > 0 ">
        <div class="mb-2">
          <h3>{{ $t('tekstikappaleen-tyyppi') }}</h3>
          <b-form-radio v-model="tekstikappaleTyyppi"
                        value="tekstikappale"
                        name="tekstikappaleTyyppi">{{ $t('tekstikappale') }}</b-form-radio>
          <b-form-radio v-model="tekstikappaleTyyppi"
                        value="osaamisala"
                        name="tekstikappaleTyyppi">{{ $t('osaamisala') }}</b-form-radio>
        </div>

        <div class="mb-5 mt-2 ml-4" v-if="tekstikappaleTyyppi === 'osaamisala'">
          <ep-select
            v-model="osaamisala"
            :items="osaamisalat"
            :is-editing="true"
            :enable-empty-option="true"
            :emptyOptionDisabled="true">
            <template slot-scope="{ item }">
              {{ $kaanna(item.nimi) }}
            </template>
          </ep-select>
        </div>
      </template>

      <ep-form-content :name="contentName" v-if="otsikkoRequired && tekstikappaleTyyppi === 'tekstikappale'">
        <ep-field v-model="otsikko" :is-editing="true" :validation="$v.otsikko" :showValidValidation="true"/>
      </ep-form-content>
    </div>

    <ep-form-content v-if="!hideTaso">
      <div slot="header">
        <h3>
          <slot name="header">
            {{$t('tekstikappaleen-sijainti-valikossa')}}
          </slot>
        </h3>
      </div>

      <div>
        <div v-if="paatasovalinta">
          <b-form-radio v-model="taso" name="taso" value="paataso" class="mb-1">{{$t('paatasolla')}}</b-form-radio>
          <b-form-radio v-model="taso" name="taso" value="alataso" :disabled="tekstikappaleet.length === 0">{{$t('toisen-tekstikappaleen-alla')}}</b-form-radio>
        </div>

        <ep-select class="mb-5 mt-2" :class="{'ml-4': paatasovalinta}"
                  v-model="valittuTekstikappale"
                  :items="tekstikappaleet"
                  :is-editing="true"
                  :enable-empty-option="true"
                  :placeholder="'valitse-ylaotsikko'"
                  :disabled="taso === 'paataso'"
                  :emptyOptionDisabled="true">
          <template slot-scope="{ item }">
            <slot :tekstikappale="item">{{item}}</slot>
          </template>
        </ep-select>
      </div>
    </ep-form-content>

    <template v-slot:modal-footer>
      <ep-button @click="cancel" variant="link">
        {{ $t('peruuta')}}
      </ep-button>
      <ep-button @click="save" :showSpinner="loading" :disabled="okDisabled">
        <slot name="footer-lisays-btn-text">
          {{ $t('lisaa-tekstikappale')}}
        </slot>
      </ep-button>
    </template>

  </b-modal>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import { requiredOneLang } from '@shared/validators/required';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpSelect from '@shared/components/forms/EpSelect.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import { Validations } from 'vuelidate-property-decorators';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { required, requiredIf } from 'vuelidate/lib/validators';

@Component({
  components: {
    EpButton,
    EpField,
    EpSelect,
    EpFormContent,
    EpMaterialIcon,
  },
})
export default class EpTekstikappaleLisays extends Vue {
  private otsikko: any = {};
  private valittuTekstikappale: any = {};
  private osaamisala: any | null = null;

  @Prop({ required: true })
  private tekstikappaleet!: any[];

  @Prop({ required: false, default: false })
  private paatasovalinta!: boolean;

  @Prop({ required: false, default: false })
  private hideTaso!: boolean;

  @Prop({ required: false, default: true })
  private otsikkoRequired!: boolean;

  @Prop({ required: false, default: 'tekstikappalelisays' })
  private modalId!: string;

  @Prop({ required: false })
  private otsikkoNimi!: string;

  @Prop({ required: true })
  private tallenna!: Function;

  @Prop({ required: false })
  private osaamisalat!: any[];

  private taso: 'paataso' | 'alataso' = 'paataso';
  private loading: boolean = false;
  private tekstikappaleTyyppi: 'osaamisala' | 'tekstikappale' = 'tekstikappale';

  @Validations()
  validations = {
    ...(this.tekstikappaleTyyppi === 'tekstikappale' && {
      otsikko: requiredOneLang(),
    }),
  };

  mounted() {
    this.taso = this.paatasovalinta ? 'paataso' : 'alataso';
  }

  get okDisabled() {
    if (this.tekstikappaleTyyppi === 'osaamisala') {
      return !this.osaamisala?.id || (this.taso === 'alataso' && _.isEmpty(this.valittuTekstikappale));
    }

    return (this.otsikkoRequired && this.$v.otsikko.$invalid) || (this.taso === 'alataso' && _.isEmpty(this.valittuTekstikappale));
  }

  get contentName() {
    if (this.otsikkoNimi) {
      return this.otsikkoNimi;
    }
    return this.modalId === 'opintokokonaisuusLisays' ? 'opintokokonaisuuden-nimi' : 'tekstikappale-nimi-ohje';
  }

  async save() {
    if (this.taso === 'paataso') {
      this.valittuTekstikappale = {};
    }

    this.loading = true;
    await this.tallenna(this.otsikko, this.valittuTekstikappale, this.osaamisala);
    this.loading = false;
    this.$bvModal.hide(this.modalId);
  }

  clear() {
    this.otsikko = {};
    this.valittuTekstikappale = {};
    this.taso = 'paataso';
  }

  cancel() {
    this.$bvModal.hide(this.modalId);
  }

  @Watch('tekstikappaleTyyppi')
  onTekstikappaleTyyppiChange() {
    this.osaamisala = null;
    this.otsikko = {};
  }
}

</script>

<style scoped lang="scss">
.osaalue-piilotettu {
  background: gray;
}
</style>
