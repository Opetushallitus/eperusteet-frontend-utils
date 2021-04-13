<template>
  <div>
    <draggable
      v-bind="tavoitteetOptions"
      tag="div"
      v-model="tavoitteet">
      <b-row v-for="(tavoite, tavoiteIndex) in tavoitteet" :key="tavoite+tavoiteIndex" class="pb-2">
        <b-col cols="11">
          <EpKoodistoSelect
            :store="tavoitteetlukutaidotKoodisto"
            v-model="tavoitteet[tavoiteIndex]"
            :is-editing="true"
            :naytaArvo="false">
            <template #default="{ open }">
              <b-input-group>
                <EpInput
                  v-model="tavoite.nimi"
                  :is-editing="true"
                  :disabled="!!tavoite.uri"
                  class="input-wrapper"
                  :validation="$v.tavoitteet.$each.$iter[tavoiteIndex].nimi">
                  <div class="order-handle m-2" slot="left">
                    <fas icon="grip-vertical"></fas>
                  </div>
                </EpInput>
                <b-input-group-append>
                  <b-button @click="open" icon="plus" variant="primary">
                    {{ $t('hae-koodistosta') }}
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </template>
          </EpKoodistoSelect>
        </b-col>
        <b-col cols="1">
          <fas icon="roskalaatikko" class="default-icon clickable mt-2" @click="poistaTavoite(tavoite)"/>
        </b-col>
      </b-row>
    </draggable>

    <ep-button variant="outline" icon="plus" @click="lisaaTavoite()">
      {{ $t('lisaa-tavoite') }}
    </ep-button>
  </div>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'vue-property-decorator';
import _ from 'lodash';
import { KoodistoSelectStore } from '../EpKoodistoSelect/KoodistoSelectStore';
import { Koodisto } from '@shared/api/eperusteet';
import draggable from 'vuedraggable';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpKoodistoSelect from '@shared/components/EpKoodistoSelect/EpKoodistoSelect.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import { koodistoKoodiValidator } from '@shared/validators/required';
import { Validations } from 'vuelidate-property-decorators';

@Component({
  components: {
    EpKoodistoSelect,
    EpButton,
    draggable,
    EpInput,
  },
})
export default class EpTavoitealueTavoitteet extends Vue {
  @Prop({ required: true })
  private value!: any[];

  get tavoitteet() {
    return this.value;
  }

  set tavoitteet(value) {
    this.$emit('input', value);
  }

  @Validations()
    validations = {
      tavoitteet: {
        $each: {
          ...koodistoKoodiValidator(),
        },
      },
    }

  private readonly tavoitteetlukutaidotKoodisto = new KoodistoSelectStore({
    async query(query: string, sivu = 0) {
      const { data } = (await Koodisto.kaikkiSivutettuna('tavoitteetlukutaidot', query, {
        params: {
          sivu,
          sivukoko: 10,
        },
      }));
      return data as any;
    },
  });

  lisaaTavoite() {
    this.tavoitteet = [
      ...this.tavoitteet,
      {},
    ];
  }

  poistaTavoite(tavoite) {
    this.tavoitteet = _.filter(this.tavoitteet, rivi => rivi !== tavoite);
  }

  get defaultDragOptions() {
    return {
      animation: 300,
      emptyInsertThreshold: 10,
      handle: '.order-handle',
      ghostClass: 'dragged',
    };
  }

  get tavoitteetOptions() {
    return {
      ...this.defaultDragOptions,
      group: {
        name: 'tavoitteet',
      },
    };
  }
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

  ::v-deep .input-group-append {
    display: inline-block;
  }
</style>
