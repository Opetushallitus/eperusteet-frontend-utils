<template>
<div>
  <ep-button v-b-modal.tekstikappalelisays variant="link" buttonClass="text-decoration-none">
     <fas class="mr-2" icon="plussa" />
    <span>{{ $t('uusi-tekstikappale') }}</span>
  </ep-button>
  <b-modal ref="tekstikappalelisaysModal"
           id="tekstikappalelisays"
           size="lg"
           centered
           :ok-disabled="okDisabled"
           @hidden="clear"
           @ok="save">
    <template v-slot:modal-title>
      {{ $t('lisaa-uusi-tekstikappale') }}
    </template>

    <ep-form-content name="tekstikappale-nimi-ohje">
      <ep-field class="mb-5" v-model="otsikko" :is-editing="true" />
    </ep-form-content>

    <ep-form-content name="tekstikappaleen-sijainti-valikossa">

      <div v-if="paatasovalinta">
        <b-form-radio v-model="taso" name="taso" value="paataso" class="mb-1">{{$t('paatasolla')}}</b-form-radio>
        <b-form-radio v-model="taso" name="taso" value="alataso">{{$t('toisen-tekstikappaleen-alla')}}</b-form-radio>
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
      {{ $t('lisaa-tekstikappale')}}
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

  private taso: 'paataso' | 'alataso' = 'paataso';

  mounted() {
    this.taso = this.paatasovalinta ? 'paataso' : 'alataso';
  }

  get okDisabled() {
    return _.isEmpty(this.otsikko) || (this.taso === 'alataso' && _.isEmpty(this.valittuTekstikappale));
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
