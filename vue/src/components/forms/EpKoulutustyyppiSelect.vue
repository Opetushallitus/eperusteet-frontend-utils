<template>
  <EpMultiSelect :value="value"
                 @input="changed($event)"
                 :placeholder="$t('kaikki')"
                 :search-identity="identity"
                 v-if="isEditing"
                 :options="kaikkiVaihtoehdot"
                 group-values="koulutustyypit"
                 group-label="ryhma"
                 :group-select="false"
                 :searchable="false"
                 :maxHeight="500">

  <template slot="singleLabel" slot-scope="{ option }">
    <span class="text-nowrap">
      <EpColorIndicator :size="10" :kind="option"/>
      <span class="ml-2">{{ $t(option) }}</span>
    </span>
  </template>
  <template slot="option" slot-scope="{ option }">
    <hr class="mt-0 mb-0" v-if="option.$groupLabel" />

    <span v-else class="text-nowrap">
      <EpColorIndicator :size="10" :kind="option" v-if="option !== 'kaikki'"/>
      <span :class="{'font-weight-bold': option === 'kaikki', 'ml-2': option !== 'kaikki'}">
        {{ $t(option) }}
      </span>
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
import { EperusteetKoulutustyypit, EperusteetKoulutustyyppiRyhmat } from '../../utils/perusteet';
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

  @Prop({ default: () => EperusteetKoulutustyypit })
  koulutustyypit!: string[];

  identity(tr: any) {
    return _.toLower(this.$kaanna(tr.nimi));
  }

  private changed(value: any) {
    if (value === 'kaikki') {
      value = undefined;
    }
    this.$emit('input', value);
  }

  get kaikkiVaihtoehdot() {
    return [
      {
        ryhma: 'kaikki',
        koulutustyypit: ['kaikki'],
      },
      ...this.vaihtoehdot,
    ];
  }

  get vaihtoehdot() {
    return _.chain(EperusteetKoulutustyyppiRyhmat)
      .keys()
      .map(ryhma => {
        return {
          ryhma,
          koulutustyypit: _.filter(EperusteetKoulutustyyppiRyhmat[ryhma], koulutustyyppi => _.isEmpty(this.koulutustyypit) || _.includes(this.koulutustyypit, koulutustyyppi)),
        };
      })
      .value();
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

::v-deep .multiselect__option--disabled {
  padding: 0;
  min-height: 0;
}

</style>
