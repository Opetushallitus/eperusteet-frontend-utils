<template>
  <div>

    <ep-aikataulu :aikataulut ="aikataulut" class="pt-3" :showPopover="false"/>

    <div class="pt-5">
      <div class="row" v-for="(aikataulu, i) in aikataulutFilter" :key="i">
        <div class="col">
          <ep-form-content :name="aikataulu.tapahtuma !== 'julkaisu' ? 'tavoitteen-paivamaara' : 'suunniteltu-julkaisupaiva'">
            <ep-datepicker v-model="aikataulu.tapahtumapaiva" :is-editing="true" :hide-header="true" :validation="$v.aikataulut.$each.$iter[i+1].tapahtumapaiva" :showValidValidation="false" >
            </ep-datepicker>
          </ep-form-content>
        </div>
        <div class="col">
          <div v-if="aikataulu.tapahtuma !== 'julkaisu'">
            <ep-form-content name="tavoitteen-kuvaus">
              <ep-field :is-editing="true" v-model="aikataulu.tavoite" :validation="$v.aikataulut.$each.$iter[i+1].tavoite" :showValidValidation="false">
              </ep-field>
            </ep-form-content>
          </div>
        </div>
        <div class="col-1 text-center pt-4">
          <div class="pt-2" v-if="aikataulu.tapahtuma !== 'julkaisu'">
            <ep-button
              @click="poistaTavoite(aikataulu)"
              variant="link"
              icon="roskalaatikko">
            </ep-button>
          </div>
        </div>
      </div>
    </div>

    <ep-button
      @click="lisaaTavoite"
      variant="outline-primary"
      icon="plussa">
      {{ $t('lisaa-tavoite') }}
    </ep-button>

  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import EpAikataulu from './EpAikataulu.vue';
import { minLength, required } from 'vuelidate/lib/validators';
import EpValidation from '@shared/mixins/EpValidation';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpDatepicker from '@shared/components/forms/EpDatepicker.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import { Kielet } from '@shared/stores/kieli';
import { validationMixin } from 'vuelidate';
import { aikataulutapahtuma, aikatauluTapahtumaSort, aikatauluTapahtumapaivaSort } from '@shared/utils/aikataulu';

@Component({
  components: {
    EpAikataulu,
    EpButton,
    EpDatepicker,
    EpFormContent,
    EpField,
  },
  validations: {
    aikataulut: {
      $each: {
        tapahtumapaiva: {
          required,
        },
        tavoite: {
          [Kielet.getSisaltoKieli.value]: {
            required
          },
        },
      }
    },
  },
} as any)
export default class EpAikatauluListaus extends Mixins(validationMixin) {
  // @Prop({ required: false })
  // private rootModel!: any;

  @Prop({ required: true })
  private aikataulutProp!: any[];

  private aikataulut: any[] = [];

  mounted() {
    this.aikataulut = _.chain(this.aikataulutProp)
      .sortBy([aikatauluTapahtumaSort, aikatauluTapahtumapaivaSort])
      .value();
  }

  lisaaTavoite() {
    this.aikataulut = [
      ...this.aikataulut,
      {
        tapahtuma: aikataulutapahtuma.tavoite,
        // opetussuunnitelmaId: this.rootModel?.id,
        tapahtumapaiva: null,
        tavoite: {},
      }
    ];
  }

  poistaTavoite(poistettavaAikataulu) {
    this.aikataulut = _.filter(this.aikataulut, (aikataulu) => aikataulu !== poistettavaAikataulu);
  }

  get aikataulutFilter() {
    return _.chain(this.aikataulut)
      .filter((aikataulu) => aikataulu.tapahtuma !== aikataulutapahtuma.luominen)
      .value();
  }

  @Watch('$v.$invalid')
  validCheck(val) {
    this.$emit('setInvalid', val);
  }

  getAikataulu() {
    return this.aikataulut;
  }
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

  .roskalaatikko {
    color: $blue;
  }

</style>
