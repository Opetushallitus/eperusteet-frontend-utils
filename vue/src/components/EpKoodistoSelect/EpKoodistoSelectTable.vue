<template>
  <div>
    <slot name="header"></slot>

    <b-table
      responsive
      borderless
      striped
      fixed
      hover
      :items="value"
      :fields="fields"
      :selectable="true"
      select-mode="single"
      selected-variant=''>

      <template v-slot:cell(nimi)="{ item }">
        <span>
          {{ $kaanna(item.nimi) }}
        </span>
      </template>

      <template v-slot:cell(arvo)="{ item }">
        <span class="font-weight-bold">
          {{ item.koodiArvo }}
        </span>
      </template>

      <template v-slot:cell(poisto)="{ item }" v-if="isEditing">
        <ep-button variant="link" icon="roskalaatikko" @click="remove(item)"/>
      </template>

    </b-table>

    <ep-koodisto-select v-if="isEditing || !nimi"
      :store="store"
      v-model="koodi"
      :is-editing="isEditing"
      :naytaArvo="false">
      <template #default="{ open }">
        <ep-button @click="open" icon="plus" variant="outline">
          <slot name="button-text">lisaa-koodi</slot>
        </ep-button>

      </template>

      <span slot="empty"></span>
    </ep-koodisto-select>

  </div>

</template>

<script lang="ts">
import { Vue, Watch, Component, Prop } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import { KoodistoSelectStore } from './KoodistoSelectStore';
import _ from 'lodash';
import EpKoodistoSelect from '@shared/components/EpKoodistoSelect/EpKoodistoSelect.vue';

@Component({
  components: {
    EpButton,
    EpKoodistoSelect,
  },
})
export default class EpKoodistoSelectTable extends Vue {
  @Prop({ default: null })
  private value!: any;

  @Prop({ default: true })
  private isEditing!: boolean;

  @Prop({ required: true })
  private store!: KoodistoSelectStore;

  get koodi() {
    return [];
  }

  set koodi(koodi) {
    this.$emit('input', koodi);
  }

  remove(koodi) {
    this.$emit('remove', koodi);
  }

  get fields() {
    return [{
      key: 'nimi',
      label: this.$t('nimi'),
    }, {
      key: 'koodi',
      label: this.$t('koodi'),
      thStyle: { width: '10rem' },
    }, {
      key: 'poisto',
      label: '',
      thStyle: { width: '5rem' },
    },
    // ...(this.additionalFields ? this.additionalFields : []),
    ];
  }
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

</style>
