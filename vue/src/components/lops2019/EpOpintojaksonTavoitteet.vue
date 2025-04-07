<template>
  <div>
    <div
      v-for="(moduuli, idx) in value.moduulit"
      :key="idx + '-moduuli'"
      class="perustesisalto"
    >
      <div v-if="moduuli && moduulitMap[moduuli.koodiUri]">
        <div class="moduuliotsikko">
          <h4>{{ $kaanna(moduulitMap[moduuli.koodiUri].nimi) }} {{ moduulitMap[moduuli.koodiUri].laajuus }} {{ $t('op') }}</h4>
        </div>
        <ep-prefix-list
          :value="moduulitMap[moduuli.koodiUri].tavoitteet"
          kohde="kohde"
          arvot="tavoitteet"
        />
      </div>
    </div>

    <div
      v-for="(paikallinenOpintojakso, idx) in value.paikallisetOpintojaksot"
      :key="idx + '-opintojakso'"
    >
      <div
        v-if="paikallinenOpintojakso.tavoitteet.length > 0"
        class="perustesisalto"
      >
        <div class="moduuliotsikko">
          <h4>{{ $kaanna(paikallinenOpintojakso.nimi) }}</h4>
        </div>
        <ep-list
          v-model="paikallinenOpintojakso.tavoitteet"
          :is-editable="false"
          lisays="lisaa-tavoite"
          kentta="kuvaus"
        />
      </div>
    </div>

    <div
      v-if="value.tavoitteet.length > 0 || showEmptyAlert"
      class="moduuliotsikko"
    >
      <h4>{{ $t('paikallinen-lisays-tavoitteet') }}</h4>
    </div>
    <div
      v-if="!isEditing && value.tavoitteet && value.tavoitteet.length === 0 && showEmptyAlert"
      class="alert alert-info"
    >
      {{ $t('ei-paikallista-tarkennusta') }}
    </div>
    <ep-list
      v-model="value.tavoitteet"
      :is-editable="isEditing"
      lisays="lisaa-tavoite"
      kentta="kuvaus"
    />
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';

import EpPrefixList from '@shared/components/EpPrefixList/EpPrefixList.vue';
import EpList from '@shared/components/forms/EpList.vue';

@Component({
  components: {
    EpPrefixList,
    EpList,
  },
})
export default class EpOpintojaksonTavoitteet extends Vue {
  @Prop({ required: true })
  private value!: any;

  @Prop({ required: false, default: false })
  private isEditing!: boolean;

  @Prop({ required: true })
  private moduulitMap!: any;

  @Prop({ required: false, default: true })
  private showEmptyAlert!: boolean;
}
</script>

<style lang="scss">
</style>
