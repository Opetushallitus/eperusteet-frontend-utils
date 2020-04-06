<template>
  <EpMultiSelect v-model="value"
                 :placeholder="$t('valitse-koulutustyyppi')"
                 :search-identity="identity"
                 v-if="isEditing"
                 :options="vaihtoehdot">
  <template slot="singleLabel" slot-scope="{ option }">
    <span class="text-nowrap">
      <EpColorIndicator :size="10" :kind="option" />
      <span class="ml-2">{{ $t(option) }}</span>
    </span>
  </template>
  <template slot="option" slot-scope="{ option }">
    <span class="text-nowrap">
      <EpColorIndicator :size="10" :kind="option" />
      <span class="ml-2">{{ $t(option) }}</span>
    </span>
  </template>
  </EpMultiSelect>
  <div v-else>
    <span class="text-nowrap">
      <EpColorIndicator :size="10" :kind="value" />
      <span class="ml-2">{{ $t(value) }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { Watch, Prop, Component, Vue } from 'vue-property-decorator';
import EpMainView from '@shared/components/EpMainView/EpMainView.vue';
import EpIcon from '@shared/components/EpIcon/EpIcon.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpSelect from '@shared/components/forms/EpSelect.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpSteps from '@shared/components/EpSteps/EpSteps.vue';
import EpAikataulu from '@shared/components/EpAikataulu/EpAikataulu.vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import { PerusteprojektiLuontiDto, PerusteQuery, PerusteprojektiKevytDto, PerusteprojektiListausDto } from '@shared/api/eperusteet';
import { PerusteprojektiStore } from '@/stores/PerusteprojektiStore';
import { PerusteetStore } from '@/stores/PerusteetStore';
import { UlkopuolisetStore } from '@/stores/UlkopuolisetStore';
import { Page } from '@shared/tyypit';
import { EperusteetKoulutustyypit } from '@/utils/perusteet';
import { BvTableFieldArray } from 'bootstrap-vue';
import * as _ from 'lodash';

@Component({
  components: {
    EpColorIndicator,
    EpIcon,
    EpInput,
    EpMultiSelect,
    EpSelect,
    EpSpinner,
  },
})
export default class KoulutustyyppiSelect extends Vue {
  @Prop({ required: true })
  value!: string;

  @Prop({ default: false })
  isEditing!: boolean;

  @Prop({ default: EperusteetKoulutustyypit })
  koulutustyypit!: string[];

  identity(tr: any) {
    return _.toLower(this.$kaanna(tr.nimi));
  }

  get vaihtoehdot() {
    return _.sortBy(this.koulutustyypit, kt => this.$t(kt));
  }
}
</script>

<style lang="scss" scoped>

.tieto {
  padding: 20px;

  .nimi {
    font-weight: 600;
  }
}

</style>
