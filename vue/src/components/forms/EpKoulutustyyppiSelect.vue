<template>
  <EpMultiSelect :value="model"
                 @input="changed($event)"
                 :placeholder="placeholder"
                 :search-identity="identity"
                 v-if="isEditing"
                 :options="selectVaihtoehdot"
                 group-values="koulutustyypit"
                 group-label="ryhma"
                 :group-select="false"
                 :searchable="false"
                 :maxHeight="500"
                 :multiple="multiple">

    <template slot="singleLabel" slot-scope="{ option }">
      <span :class="{'text-nowrap': !textWrap}">
        <EpColorIndicator :size="10" :kind="option.koulutustyyppi" v-if="!nocolor"/>
        <span class="ml-2">{{ $t(option.koulutustyyppi) }}</span>
      </span>
    </template>
    <template slot="option" slot-scope="{ option }">
      <hr class="mt-0 mb-0" v-if="option.$groupLabel" />

      <span v-else class="option text-nowrap" :class="{'text-nowrap': !textWrap}">
        <EpColorIndicator :size="10" :kind="option.koulutustyyppi" v-if="option.koulutustyyppi !== 'kaikki' && !nocolor"/>
        <span :class="{'font-weight-bold': option.koulutustyyppi === 'kaikki', 'ml-2': option.koulutustyyppi !== 'kaikki'}">
          {{ $t(option.koulutustyyppi) }}
        </span>
      </span>
    </template>
    <template v-slot:checkbox="{ option }"><span/></template>
    <!-- <template slot="tag" slot-scope="{ option }">
      <span>{{ $t(option) }}</span>
    </template> -->
  </EpMultiSelect>
  <div v-else>
    <span class="text-nowrap" :class="{'text-nowrap': !textWrap}">
      <EpColorIndicator :size="10" :kind="value" v-if="!nocolor" class="mr-2"/>
      <span>{{ $t(value) }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import EpSelect from '@shared/components/forms/EpSelect.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import { EperusteetKoulutustyypit, EperusteetKoulutustyyppiRyhmat } from '../../utils/perusteet';
import * as _ from 'lodash';

@Component({
  components: {
    EpColorIndicator,
    EpInput,
    EpMultiSelect,
    EpSelect,
    EpSpinner,
  },
})
export default class KoulutustyyppiSelect extends Vue {
  @Prop({ required: true })
  value!: string | string[];

  @Prop({ default: false })
  isEditing!: boolean;

  @Prop({ type: Boolean })
  required!: Boolean;

  @Prop({ default: false, type: Boolean })
  nocolor!: Boolean;

  @Prop({ default: () => EperusteetKoulutustyypit })
  koulutustyypit!: string[];

  @Prop({ default: () => [] })
  eiTuetutKoulutustyypit!: string[];

  @Prop({ default: false, type: Boolean })
  textWrap!: Boolean;

  @Prop({ default: false, type: Boolean })
  multiple!: Boolean;

  identity(tr: any) {
    return _.toLower(this.$kaanna(tr.nimi));
  }

  get model() {
    return this.value;
  }

  // get toValue() {
  //   return _.chain(this.vaihtoehdot)
  //     .map(vaihtoehto => vaihtoehto.koulutustyypit)
  //     .flatMap()
  //     .find(kt => kt.koulutustyyppi === this.value)
  //     .value();
  // }

  private changed(value: any) {
    console.log(' KoulutustyyppiSelect changed ', value);

    if (_.get(value, 'koulutustyyppi') === 'kaikki') {
      this.$emit('input', this.multiple ? [] : undefined);
    }
    else {
      if (!this.multiple) {
        this.$emit('input', _.get(value, 'koulutustyyppi'));
      }
      else {
        this.$emit('input', value);
        // const koulutustyyppi = _.map(value, 'koulutustyyppi');

        // console.log([...this.value, ...koulutustyyppi]);

        // if (_.find((this.value as any), koulutustyyppi)) {
        //   this.$emit('input', _.without(this.value as any, koulutustyyppi));
        // }
        // else {
        //   this.$emit('input', [...this.value, ...koulutustyyppi]);
        // }
      }
    }
  }

  get placeholder() {
    if (this.required) {
      return this.$t('valitse');
    }
    else {
      return this.$t('kaikki');
    }
  }

  get selectVaihtoehdot() {
    if (this.required) {
      return this.vaihtoehdot;
    }
    else {
      return this.kaikkiVaihtoehdot;
    }
  }

  get kaikkiVaihtoehdot() {
    return [
      {
        ryhma: 'kaikki',
        koulutustyypit: [{ koulutustyyppi: 'kaikki' }],
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
          koulutustyypit: _.chain(EperusteetKoulutustyyppiRyhmat[ryhma])
            .filter(koulutustyyppi => _.isEmpty(this.koulutustyypit) || _.includes(this.koulutustyypit, koulutustyyppi))
            .reject(koulutustyyppi => _.includes(this.eiTuetutKoulutustyypit, koulutustyyppi))
            .map(koulutustyyppi => ({ koulutustyyppi }))
            .value(),
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

::v-deep .multiselect__option {
 padding: 0px;
 min-height: 0px;
}

::v-deep .multiselect__option--disabled .option, ::v-deep .multiselect__option .option{
 padding: 12px;
 min-height: 40px;
 display: block;
}

</style>
