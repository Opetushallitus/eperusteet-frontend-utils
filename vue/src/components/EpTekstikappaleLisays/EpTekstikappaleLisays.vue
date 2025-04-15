<template>
  <div>
    <div v-b-modal="modalId">
      <slot name="lisays-btn">
        <ep-button
          id="tekstikappalelisaysBtn"
          variant="link"
          button-class="text-decoration-none"
        >
          <slot name="lisays-btn-icon">
            <EpMaterialIcon
              :color="'inherit'"
              :background="'inherit'"
              size="18px"
            >
              add
            </EpMaterialIcon>
          </slot>
          <span>
            <slot name="lisays-btn-text">
              {{ $t('uusi-tekstikappale') }}
            </slot>
          </span>
        </ep-button>
      </slot>
    </div>
    <b-modal
      :id="modalId"
      ref="tekstikappalelisaysModal"
      size="lg"
      centered
      @hidden="clear"
    >
      <template #modal-title>
        <slot name="modal-title">
          {{ $t('lisaa-uusi-tekstikappale') }}
        </slot>
      </template>

      <ep-form-content
        v-if="otsikkoRequired"
        :name="contentName"
      >
        <ep-field
          v-model="otsikko"
          class="mb-5"
          :is-editing="true"
          :validation="$v.otsikko"
          :show-valid-validation="true"
        />
      </ep-form-content>

      <ep-form-content v-if="!hideTaso">
        <template #header>
          <h3>
            <slot name="header">
              {{ $t('tekstikappaleen-sijainti-valikossa') }}
            </slot>
          </h3>
        </template>

        <div>
          <div v-if="paatasovalinta">
            <b-form-radio
              v-model="taso"
              name="taso"
              value="paataso"
              class="mb-1"
            >
              {{ $t('paatasolla') }}
            </b-form-radio>
            <b-form-radio
              v-model="taso"
              name="taso"
              value="alataso"
              :disabled="tekstikappaleet.length === 0"
            >
              {{ $t('toisen-tekstikappaleen-alla') }}
            </b-form-radio>
          </div>

          <ep-select
            v-model="valittuTekstikappale"
            class="mb-5 mt-2"
            :class="{'ml-4': paatasovalinta}"
            :items="tekstikappaleet"
            :is-editing="true"
            :enable-empty-option="true"
            :placeholder="'valitse-ylaotsikko'"
            :disabled="taso === 'paataso'"
            :empty-option-disabled="true"
          >
            <template slot-scope="{ item }">
              <slot :tekstikappale="item">
                {{ item }}
              </slot>
            </template>
          </ep-select>
        </div>
      </ep-form-content>

      <template #modal-footer>
        <ep-button
          variant="link"
          @click="cancel"
        >
          {{ $t('peruuta') }}
        </ep-button>
        <ep-button
          :show-spinner="loading"
          :disabled="okDisabled"
          @click="save"
        >
          <slot name="footer-lisays-btn-text">
            {{ $t('lisaa-tekstikappale') }}
          </slot>
        </ep-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Component, Vue } from 'vue-property-decorator';
import { requiredOneLang } from '@shared/validators/required';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpSelect from '@shared/components/forms/EpSelect.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import { Validations } from 'vuelidate-property-decorators';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

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

  private taso: 'paataso' | 'alataso' = 'paataso';
  private loading: boolean = false;

  @Validations()
  validations = {
    otsikko: requiredOneLang(),
  };

  mounted() {
    this.taso = this.paatasovalinta ? 'paataso' : 'alataso';
  }

  get okDisabled() {
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
    await this.tallenna(this.otsikko, this.valittuTekstikappale);
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
}

</script>

<style scoped lang="scss">
.osaalue-piilotettu {
  background: gray;
}
</style>
