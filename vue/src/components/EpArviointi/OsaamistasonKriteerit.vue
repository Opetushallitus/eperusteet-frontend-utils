<template>
  <div>
    <OsaamistasonKriteeri
          class="mb-3 ml-0 p-1 taulukko-rivi-varitys"
          v-for="(osaamistasonkriteeri, osaamistasoIndex) in osaamistasonKriteerit"
          :key="'osaamistasonkriteeri'+osaamistasonkriteeri._osaamistaso"
          v-model="osaamistasonKriteerit[osaamistasoIndex]"
          :isEditing="isEditing"
          :arviointiasteikko="arviointiasteikko"
        />
  </div>

</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import OsaamistasonKriteeri from '@shared/components/EpArviointi/OsaamistasonKriteeri.vue';

@Component({
  components: {
    OsaamistasonKriteeri,
  },
})
export default class OsaamistasonKriteerit extends Vue {
  @Prop({ required: true })
  private value!: any;

  @Prop({ required: true })
  private isEditing!: boolean;

  @Prop({ required: true })
  private arviointiasteikko!: any;

  get osaamistasonKriteerit() {
    return _.sortBy(this.value, '_osaamistaso');
  }

  set osaamistasonKriteerit(val) {
    this.$emit('input', val);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
