<template>
  <div>
    <ep-aikataulu
      :aikataulut="kaikkiAikataulut"
      class="pt-3"
      :show-popover="false"
    >
      <template #luomispaiva-topic>
        <slot name="luomispaiva-topic" />
      </template>
      <template #julkaisupaiva-topic>
        <slot name="julkaisupaiva-topic" />
      </template>
    </ep-aikataulu>

    <div class="pt-5">
      <div
        v-for="(aikataulu, i) in paatavoitteet"
        :key="'paatavoite'+i"
        class="row paatavoite"
      >
        <div class="col">
          <ep-form-content class="mb-3">
            <label v-if="aikataulu.tapahtuma !== 'julkaisu'">{{ $kaanna(aikataulu.tavoite) }}</label>
            <slot
              v-else
              name="aikataululistaus-julkaisu-header"
            >
              <label>{{ $t('suunniteltu-julkaisupaiva') }}</label>
            </slot>
            <ep-datepicker
              v-model="aikataulu.tapahtumapaiva"
              :is-editing="true"
              :show-valid-validation="true"
            />
            <ep-toggle
              v-if="julkinenValinta"
              v-model="aikataulu.julkinen"
              class="mb-2"
            >
              {{ $t('julkinen') }}
            </ep-toggle>
          </ep-form-content>
        </div>
        <div class="col" />
        <div class="col-1" />
      </div>

      <hr class="mb-4">

      <div
        v-for="(aikataulu, i) in yleistavoitteet"
        :key="'yleistavoite'+i"
        class="row yleistavoite"
      >
        <div class="col">
          <ep-form-content class="mb-3">
            <label>{{ $t('tavoitteen-paivamaara') }}</label>
            <ep-datepicker
              v-model="aikataulu.tapahtumapaiva"
              :is-editing="true"
              :validation="$v.aikataulut.$each.$iter[i+1].tapahtumapaiva"
              :show-valid-validation="true"
            />
            <ep-toggle
              v-if="julkinenValinta"
              v-model="aikataulu.julkinen"
              class="mb-2"
            >
              {{ $t('julkinen') }}
            </ep-toggle>
          </ep-form-content>
        </div>
        <div class="col">
          <div>
            <ep-form-content name="tavoitteen-kuvaus">
              <ep-field
                v-model="aikataulu.tavoite"
                :is-editing="true"
                :validation="$v.aikataulut.$each.$iter[i+1].tavoite"
                :show-valid-validation="false"
              />
            </ep-form-content>
          </div>
        </div>
        <div class="col-1 text-center pt-4">
          <div class="pt-2">
            <ep-button
              variant="link"
              icon="delete"
              @click="poistaTavoite(aikataulu)"
            />
          </div>
        </div>
      </div>
    </div>

    <ep-button
      variant="outline-primary"
      icon="add"
      @click="lisaaTavoite"
    >
      {{ $t('lisaa-tavoite') }}
    </ep-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import EpAikataulu from './EpAikataulu.vue';
import { requiredIf } from 'vuelidate/lib/validators';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpDatepicker from '@shared/components/forms/EpDatepicker.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import { Kielet } from '@shared/stores/kieli';
import { validationMixin } from 'vuelidate';
import { Validations } from 'vuelidate-property-decorators';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import { aikataulutapahtuma, aikatauluTapahtumaSort, aikatauluTapahtumapaivaSort } from '@shared/utils/aikataulu';

@Component({
  components: {
    EpAikataulu,
    EpButton,
    EpDatepicker,
    EpFormContent,
    EpField,
    EpToggle,
  },
} as any)
export default class EpAikatauluListaus extends Mixins(validationMixin) {
  @Prop({ required: true })
  private aikataulutProp!: any[];

  @Prop({ required: false })
  private immutableAikataulut!: any[];

  @Prop({ required: false, default: false, type: Boolean })
  private julkinenValinta!: boolean;

  @Prop({ required: false, default: () => ['julkaisu', 'tavoite'] })
  private pakollisetTapahtumat!: string[];

  private aikataulut: any[] = [];

  mounted() {
    this.aikataulut = _.chain(this.aikataulutProp)
      .sortBy([aikatauluTapahtumaSort, aikatauluTapahtumapaivaSort])
      .value();
  }

  @Validations()
    validations = {
      aikataulut: {
        $each: {
          tapahtumapaiva: {
            required: requiredIf((value) => _.includes(this.pakollisetTapahtumat, value.tapahtuma)),
          },
          tavoite: {
            [Kielet.getSisaltoKieli.value]: {
              required: requiredIf((value) => _.includes(this.pakollisetTapahtumat, value.tapahtuma)),
            },
          },
        },
      },
    };

  get kaikkiAikataulut() {
    return [
      ..._.toArray(this.immutableAikataulut),
      ...this.aikataulut,
    ];
  }

  lisaaTavoite() {
    this.aikataulut = [
      ...this.aikataulut,
      {
        tapahtuma: aikataulutapahtuma.tavoite,
        tapahtumapaiva: null,
        tavoite: {},
        julkinen: false,
      },
    ];
  }

  poistaTavoite(poistettavaAikataulu) {
    this.aikataulut = _.filter(this.aikataulut, (aikataulu) => aikataulu !== poistettavaAikataulu);
  }

  get paatavoitteet() {
    return _.chain(this.aikataulut)
      .filter((aikataulu) => aikataulu.tapahtuma !== aikataulutapahtuma.luominen)
      .filter((aikataulu) => aikataulu.tapahtuma !== aikataulutapahtuma.tavoite)
      .value();
  }

  get yleistavoitteet() {
    return _.chain(this.aikataulut)
      .filter((aikataulu) => aikataulu.tapahtuma === aikataulutapahtuma.tavoite)
      .value();
  }

  @Watch('aikataulut', { deep: true })
  aikataulutChange(val) {
    this.$v.$touch();
    this.$emit('setInvalid', this.$v.$invalid);
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
