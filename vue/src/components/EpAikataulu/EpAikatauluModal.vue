<template>
  <div>
    <ep-button v-if="aikataulut && aikataulut.length > 0"
      @click="openModal"
      buttonClass="pr-1"
      variant="link"
      icon="kyna">
      {{ $t('muokkaa') }}
    </ep-button>

    <b-modal ref="aikataulumodal" id="aikataulumodal" size="lg" :hide-header-close="true" @ok="tallenna" :ok-disabled="invalid">

      <template v-slot:modal-title>
        {{ aikataulut && aikataulut.length > 0 ? $t('muokkaa-aikataulua') : $t('ota-aikataulu-kayttoon') }}
      </template>

      <slot name="selite"></slot>

      <ep-aikataulu-listaus ref="epAikatauluListaus" :aikataulutProp="aikataulutClone" :rootModel="rootModel" @setInvalid="setInvalid"/>

      <template v-slot:modal-cancel>
        {{ $t('peruuta')}}
      </template>
      <template v-slot:modal-ok >
        {{ $t('tallenna')}}
      </template>

    </b-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import _ from 'lodash';
import { aikataulutapahtuma } from '../../utils/aikataulu';
import EpAikataulu from './EpAikataulu.vue';
import EpAikatauluListaus from './EpAikatauluListaus.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpDatepicker from '@shared/components/forms/EpDatepicker.vue';
import EpFormContent from'@shared/components/forms/EpFormContent.vue';
import EpField from'@shared/components/forms/EpField.vue';
import { Kielet } from '@shared/stores/kieli';

@Component({
  components: {
    EpAikataulu,
    EpButton,
    EpDatepicker,
    EpFormContent,
    EpField,
    EpAikatauluListaus,
  },
})
export default class EpAikatauluModal extends Vue {

  @Prop({ required: true})
  private rootModel!: any;

  @Prop({ required: true})
  private aikataulut!: any[];

  private invalid: boolean = false;
  private aikataulutClone: any[]= [];

  openModal() {
    if (_.size(this.aikataulut) === 0){
      this.setInvalid(true);

      this.aikataulutClone = [
        {
          tapahtuma: aikataulutapahtuma.luominen,
          opetussuunnitelmaId: this.rootModel.id,
          tapahtumapaiva: this.rootModel.luotu,
          tavoite: {
            [Kielet.getSisaltoKieli.value]: this.$t('projektin-luomispaiva')
          },
        },
        {
          tapahtuma: aikataulutapahtuma.julkaisu,
          opetussuunnitelmaId: this.rootModel.id,
          tapahtumapaiva: null,
          tavoite: {
            [Kielet.getSisaltoKieli.value]: this.$t('projektin-suunniteltu-julkaisupaiva')
          },
        }
      ];
    }
    else {
      this.aikataulutClone = _.cloneDeep(this.aikataulut);
    }

    (this as any).$refs.aikataulumodal.show();

  }

  tallenna() {
    this.$emit('tallenna', (this as any).$refs.epAikatauluListaus.getAikataulu());
  }

  setInvalid(invalid) {
    this.invalid = invalid;
  }

}
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

</style>
