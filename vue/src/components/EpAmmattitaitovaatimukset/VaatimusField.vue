<template>
  <div>
    <ep-koodisto-select :store="koodisto" v-model="value.koodi" v-if="value">
      <template #default="{ open }">
        <div class="d-flex flex-column">
          <div>
            <ep-error-wrapper :validation="validation">
              <b-input-group>
                <b-form-input
                  :value="value.vaatimus ? value.vaatimus[$slang.value] : ''"
                  @input="onInput"
                  @resize="onResize"
                  @focus="focused = true"
                  @blur="onBlur"
                  ref="input"
                  v-if="!value.koodi"></b-form-input>
                <b-form-input
                  :value="$kaanna(value.koodi.nimi) + ' (' + value.koodi.arvo + ')'"
                  disabled
                  v-if="value.koodi"></b-form-input>
                <b-input-group-append>
                  <b-button @click="open" icon="plus" variant="primary">
                    {{ $t('hae-koodistosta') }}
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </ep-error-wrapper>
          </div>
          <div class="datalist-wrapper" v-if="focused && hasChanged && (isLoading || koodit.length > 0)">
            <div class="datalist-container" ref="datalistContainer">
              <div v-if="isLoading" class="m-2">
                <ep-spinner />
              </div>
              <div class="datalist" v-else>
                <div class="item" v-for="item in koodit" role="button" @click="valitse(item)" ref="datalist">
                  {{ $kaanna(item.nimi) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </ep-koodisto-select>
  </div>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import EpInput from '../forms/EpInput.vue';
import EpErrorWrapper from '../forms/EpErrorWrapper.vue';
import EpExternalLink from '../EpExternalLink/EpExternalLink.vue';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpKoodistoSelect from '../EpKoodistoSelect/EpKoodistoSelect.vue';
import { Ammattitaitovaatimukset2019Dto } from '../../api/eperusteet';
import { KoodistoSelectStore } from '@shared/components/EpKoodistoSelect/KoodistoSelectStore';
import { Koodisto } from '../../api/eperusteet';
import { BrowserStore } from '../../stores/BrowserStore';
import { metadataToLocalized } from '../../utils/perusteet';
import _ from 'lodash';

@Component({
  components: {
    EpButton,
    EpErrorWrapper,
    EpExternalLink,
    EpInput,
    EpSpinner,
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

  private focused = false;
  private hasChanged = false;
  private isLoading = false;

  get koodit() {
    const res = _.map(this.koodisto?.data.value?.data || [], koodi => {
      return {
        ...koodi,
        nimi: metadataToLocalized(koodi.metadata!, 'nimi'),
      };
    });
    return res;
  }

  async fetchKoodisto(query: string) {
    this.hasChanged = true;
    try {
      this.isLoading = true;
      await this.koodisto.query(query || '');
    }
    catch (err) {
      console.error(err);
    }
    finally {
      this.isLoading = false;
    }
  }

  async onInput(ev: string) {
    this.value.vaatimus = { ...this.value.vaatimus, [this.$slang.value]: ev };
    this.fetchKoodisto(ev);
  }

  mounted() {
  }

  onResize() {
  }

  onBlur() {
    setTimeout(() => {
      this.focused = false;
    }, 300);
  }

  valitse(koodi) {
    this.focused = false;
    this.$emit('input', {
      koodi: {
        uri: koodi.koodiUri,
        arvo: koodi.koodiArvo,
        nimi: koodi.nimi,
        versio: koodi.versio,
        koodisto: koodi.koodisto,
      },
    });
  }

  private readonly datalist = _.uniqueId('datalist_');
}
</script>

<style scoped lang="scss">
.datalist-wrapper {
  width: 100%;
  position: relative;
  z-index: 1000;

  .datalist-container {
    margin:  -2px 0 0 2px;
    border-radius: 3px;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
    position: absolute;
    background: white;
    border: 1px solid #ddd;
    left: 0px;
    right: 0px;

    .datalist {
      .item {
        padding: 6px;
        cursor: pointer;

        &:hover {
          background: #eee;
        }
      }
    }
  }
}
</style>
