<template>
  <div>

    <ep-button v-if="aikataulut && aikataulut.length > 0"
      v-b-modal.aikataulumodal
      buttonClass="pr-1"
      variant="outline-primary"
      icon="plussa">
      {{ $t('lisaa-tavoite') }}
    </ep-button>

    <b-modal ref="aikataulumodal" id="aikataulumodal" size="lg" :hide-header-close="true">

      <template v-slot:modal-title>
        {{ $t('ota-aikataulu-kayttoon') }}
      </template>

      <p>{{ $t('aikataulu-modal-selite')}}</p>

      <ep-aikataulu :aikataulut ="aikataulut" />

      <ep-form-content name="tavoitteen-kuvaus">
        <ep-field :is-editing="true">
        </ep-field>
      </ep-form-content>

      <ep-form-content name='tavoitteen-paivamaara'>
        <ep-datepicker :is-editing="true" :hide-header="true" :validation="$v.aikataulu.tapahtumapaiva">
        </ep-datepicker>
      </ep-form-content>

      <template v-slot:modal-cancel>
        {{ $t('peruuta')}}
      </template>
      <template v-slot:modal-ok>
        {{ $t('valmis')}}
      </template>

    </b-modal>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Mixins } from 'vue-property-decorator';
import _ from 'lodash';
import { aikataulutapahtuma } from '../../utils/aikataulu';
import EpAikataulu from './EpAikataulu.vue';
import { minLength, required } from 'vuelidate/lib/validators';
import EpValidation from '@/mixins/EpValidation';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpDatepicker from '@shared/components/forms/EpDatepicker.vue';
import EpFormContent from'@shared/components/forms/EpFormContent.vue';
import EpField from'@shared/components/forms/EpField.vue';

@Component({
  components: {
    EpAikataulu,
    EpButton,
    EpDatepicker,
    EpFormContent,
    EpField,
  }
})
export default class EpAikatauluModal extends Mixins(EpValidation) {

  @Prop( {required: true})
  private aikataulut!: any[];

  openModal() {
    (this as any).$refs['aikataulumodal'].show();
  }

  get modalTopic() {
    return 'lorem';
  }

  get validationConfig() {
    return {
      aikataulu: {
        tapahtumapaiva: {
          required,
        }
      },
    };
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

</style>
