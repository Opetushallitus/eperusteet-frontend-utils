<template>
  <ep-koodisto-select :store="koodisto" v-model="value.koodi" v-if="value">
    <template #default="{ open }">
      <ep-error-wrapper :validation="validation">
        <b-input-group>
          <b-form-input :value="value.vaatimus ? value.vaatimus[$slang.value] : ''"
            @input="value.vaatimus = { ...value.vaatimus, [$slang.value]: $event }"
            v-if="!value.koodi"></b-form-input>
          <b-form-input :value="$kaanna(value.koodi.nimi) + ' (' + value.koodi.arvo + ')'"
            disabled
            v-else></b-form-input>
          <b-input-group-append>
            <b-button @click="open" icon="plus" variant="primary">
              {{ $t('hae-koodistosta') }}
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </ep-error-wrapper>
    </template>
  </ep-koodisto-select>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import EpInput from '../forms/EpInput.vue';
import EpErrorWrapper from '../forms/EpErrorWrapper.vue';
import EpExternalLink from '../EpExternalLink/EpExternalLink.vue';
import EpKoodistoSelect from '../EpKoodistoSelect/EpKoodistoSelect.vue';
import { Ammattitaitovaatimukset2019Dto } from '../../api/eperusteet';
import { KoodistoSelectStore } from '@shared/components/EpKoodistoSelect/KoodistoSelectStore';
import { Koodisto } from '@shared/api/eperusteet';
import _ from 'lodash';

@Component({
  components: {
    EpButton,
    EpErrorWrapper,
    EpExternalLink,
    EpInput,
    EpKoodistoSelect,
  },
})
export default class VaatimusField extends Vue {
  @Prop({ required: true })
  private value!: any;

  @Prop({ required: true })
  private koodisto!: KoodistoSelectStore;

  @Prop({ default: null })
  validation!: any;
}
</script>

<style scoped lang="scss">
</style>
