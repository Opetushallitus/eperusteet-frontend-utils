<template>
  <div>
    <ep-button
      v-if="aikataulut && aikataulut.length > 0"
      v-oikeustarkastelu="{ oikeus: 'muokkaus' }"
      button-class="pr-1"
      variant="link"
      icon="edit"
      @click="openModal"
    >
      {{ $t('muokkaa') }}
    </ep-button>

    <b-modal
      id="aikataulumodal"
      ref="aikataulumodal"
      size="lg"
      :hide-header-close="true"
      :ok-disabled="invalid"
      @ok="tallenna"
    >
      <template #modal-title>
        {{ aikataulut && aikataulut.length > 0 ? $t('muokkaa-aikataulua') : $t('ota-aikataulu-kayttoon') }}
      </template>

      <slot name="selite" />

      <ep-aikataulu-listaus
        ref="epAikatauluListaus"
        :aikataulut-prop="aikataulutClone"
        :immutable-aikataulut="immutableAikataulut"
        :root-model="rootModel"
        :julkinen-valinta="julkinenValinta"
        :pakolliset-tapahtumat="pakollisetTapahtumat"
        @setInvalid="setInvalid"
      >
        <template #luomispaiva-topic>
          <slot name="luomispaiva-topic" />
        </template>
        <template #julkaisupaiva-topic>
          <slot name="julkaisupaiva-topic" />
        </template>
        <template #aikataululistaus-julkaisu-header>
          <slot name="aikataululistaus-julkaisu-header" />
        </template>
      </ep-aikataulu-listaus>

      <template #modal-cancel>
        {{ $t('peruuta') }}
      </template>
      <template #modal-ok>
        {{ $t('tallenna') }}
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import _ from 'lodash';
import { aikataulutapahtuma, AikatauluRootModel } from '../../utils/aikataulu';
import EpAikataulu from './EpAikataulu.vue';
import EpAikatauluListaus from './EpAikatauluListaus.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpDatepicker from '@shared/components/forms/EpDatepicker.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
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
  @Prop({ required: false })
  private rootModel!: AikatauluRootModel;

  @Prop({ required: true })
  private aikataulut!: any[];

  @Prop({ required: false })
  private immutableAikataulut!: any[];

  @Prop({ required: false, default: false, type: Boolean })
  private julkinenValinta!: boolean;

  @Prop({ required: false })
  private pakollisetTapahtumat!: string[];

  private invalid: boolean = false;
  private aikataulutClone: any[] = [];

  openModal() {
    if (_.size(this.aikataulut) === 0) {
      this.setInvalid(true);

      this.aikataulutClone = [
        {
          tapahtuma: aikataulutapahtuma.luominen,
          tapahtumapaiva: this.rootModel.luotu,
          tavoite: {
            [Kielet.getSisaltoKieli.value]: this.$t('luomispaiva'),
          },
        },
        {
          tapahtuma: aikataulutapahtuma.julkaisu,
          tapahtumapaiva: null,
          tavoite: {
            [Kielet.getSisaltoKieli.value]: this.$t('suunniteltu-julkaisupaiva'),
          },
        },
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
@import "../../styles/_variables.scss";

</style>
