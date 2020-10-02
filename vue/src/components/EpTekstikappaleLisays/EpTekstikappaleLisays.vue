<template>
<div>
  <div v-b-modal="modalId">
    <slot name="lisays-btn">
      <ep-button id="tekstikappalelisaysBtn" variant="link" buttonClass="text-decoration-none">
          <fas class="mr-2" icon="plussa" />
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
           :ok-disabled="okDisabled"
           @hidden="clear"
           @ok="save">
    <template v-slot:modal-title>
      <slot name="modal-title">
        {{ $t('lisaa-uusi-tekstikappale') }}
      </slot>
    </template>

    <ep-form-content name="tekstikappale-nimi-ohje" v-if="otsikkoRequired">
      <ep-field class="mb-5" v-model="otsikko" :is-editing="true" />
    </ep-form-content>

    <ep-form-content>
      <div slot="header">
        <h3>
          <slot name="header">
            {{$t('tekstikappaleen-sijainti-valikossa')}}
          </slot>
        </h3>
      </div>

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
    </ep-form-content>

    <template v-slot:modal-cancel>
      {{ $t('peruuta')}}
    </template>
    <template v-slot:modal-ok>
      <slot name="footer-lisays-btn-text">
        {{ $t('lisaa-tekstikappale')}}
      </slot>
    </template>

  </b-modal>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Component, Mixins, Vue } from 'vue-property-decorator';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpSelect from '@shared/components/forms/EpSelect.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';

@Component({
  components: {
    EpButton,
    EpField,
    EpSelect,
    EpFormContent,
  },
})
export default class EpTekstikappaleLisays extends Vue {
  private otsikko: any = {};
  private valittuTekstikappale: any = {};

  @Prop({ required: true })
  private tekstikappaleet!: any[];

  @Prop({ required: false, default: false })
  private paatasovalinta!: boolean;

  @Prop({ required: false, default: true })
  private otsikkoRequired!: boolean;

   @Prop({ required: false, default: 'tekstikappalelisays' })
  private modalId!: string;

  private taso: 'paataso' | 'alataso' = 'paataso';

  mounted() {
    this.taso = this.paatasovalinta ? 'paataso' : 'alataso';
  }

  get okDisabled() {
    return (this.otsikkoRequired && _.isEmpty(this.otsikko)) || (this.taso === 'alataso' && _.isEmpty(this.valittuTekstikappale));
  }

  async save() {
    if (this.taso === 'paataso') {
      this.valittuTekstikappale = {};
    }
    this.$emit('save', this.otsikko, this.valittuTekstikappale);
  }

  clear() {
    this.otsikko = {};
    this.valittuTekstikappale = {};
    this.taso = 'paataso';
  }
}

</script>

<style scoped lang="scss">

</style>
