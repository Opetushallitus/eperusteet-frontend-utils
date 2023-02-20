<template>
  <div>
   <draggable
      v-bind="defaultDragOptions"
      tag="div"
      v-model="model">

        <EpCollapse
          v-for="(toteutus, toteutusIndex) in model"
          :key="'toteutus'+toteutusIndex"
          class="toteutus p-3 mb-4 w-100"
          :borderBottom="false"
          :collapsable="!isEditing"
          :usePadding="false">

          <div slot="header" v-if="!isEditing">
            <h4 class="ml-3">{{$kaanna(toteutus.otsikko)}}</h4>
          </div>

          <div class="d-flex">
            <div class="order-handle mr-3">
              <fas icon="grip-vertical" v-if="isEditing"></fas>
            </div>

            <div class="w-100">
              <h4 v-if="isEditing">{{$t('toteutuksen-otsikko')}}</h4>
              <ep-input v-model="toteutus.otsikko" :is-editing="isEditing" v-if="isEditing"/>

              <h4 class="mt-4">{{$t('tavat-ja-ymparisto')}}</h4>
              <ep-content layout="normal" v-model="toteutus.tavatjaymparisto" :is-editable="isEditing" />

              <h4 class="mt-4">{{$t('osaamisen-arvioinnista')}}</h4>
              <ep-content layout="normal" v-model="toteutus.arvioinnista" :is-editable="isEditing"> </ep-content>

              <hr v-if="toteutus.vapaat && toteutus.vapaat.length > 0" class="mt-4"/>
              <EpVapaatTekstit v-model="toteutus.vapaat" :isEditing="isEditing" class="mt-2"/>

              <ep-button class="float-right mt-4" @click="poistaToteutus(toteutus)" variant="link" icon="roskalaatikko" v-if="isEditing">
                {{ $t('poista-toteutus') }}
              </ep-button>

            </div>
          </div>
        </EpCollapse>
    </draggable>

    <ep-button @click="lisaaToteutus()" variant="outline" icon="plus" v-if="isEditing">
      {{ $t('lisaa-toteutus') }}
    </ep-button>

  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpVapaatTekstit from '@/components/common/EpVapaatTekstit.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import draggable from 'vuedraggable';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import { OmaOsaAlueToteutusDto } from '@shared/api/amosaa';
import { DEFAULT_DRAGGABLE_PROPERTIES } from '@shared/utils/defaults';

@Component({
  components: {
    EpVapaatTekstit,
    EpInput,
    draggable,
    EpCollapse,
    EpContent,
    EpButton,
  },
})
export default class EpOsaAlueToteutukset extends Vue {
  @Prop({ required: true })
  value!: OmaOsaAlueToteutusDto[];

  @Prop({ required: false, default: false })
  isEditing!: boolean;

  set model(value) {
    this.$emit('input', value);
  }

  get model() {
    return this.value;
  }

  lisaaToteutus() {
    this.$emit('input', [
      ...this.value,
      { vapaat: [] },
    ]);
  }

  poistaToteutus(poistettavaOsaalue) {
    this.$emit('input', _.filter(this.value, toteutus => toteutus !== poistettavaOsaalue));
  }

  get defaultDragOptions() {
    return {
      ...DEFAULT_DRAGGABLE_PROPERTIES,
      disabled: !this.isEditing,
    };
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.toteutus {
  @include tile-background-shadow;
  border-radius: 10px;
}
</style>
