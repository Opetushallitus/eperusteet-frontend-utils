<template>
  <div>
    <slot name="default" :open="openDialog">
      <div class="bg-danger">Painike puuttuu</div>
    </slot>
    <!-- <ep-button @click="openDialog" icon="plus" variant="outline"> -->
    <!--   {{ $t('lisaa-osaamisala') }}                                -->
    <!-- </ep-button>                                                  -->
    <b-modal ref="editModal" size="xl">
      <template #modal-header>
        <slot name="header">
          <h2>{{ $t('lisaa-koodi') }}</h2>
        </slot>
      </template>

      <template #default>
        <div class="d-flex">
          <div class="flex-grow-1">
            <ep-search v-model="query"></ep-search>
          </div>
          <div>
            <ep-spinner v-if="isLoading" />
          </div>
        </div>
        <div v-if="items">
          <b-table
            responsive
            borderless
            striped
            fixed
            hover
            :items="items"
            :fields="fields">

            <template v-slot:cell(arvo)="{ item }">
              <span class="font-weight-bold">
                {{ item.koodiArvo }}
              </span>
            </template>

            <template v-slot:cell(nimi)="{ item }">
              <div role="button" @click="selectKoodi(item)">
                {{ $kaanna(item.nimi) }}
              </div>
            </template>

            <template v-slot:cell(versio)="{ item }">
              {{ item.versio }}
            </template>

            <template v-slot:cell(voimaantulo)="{ item }">
              {{ $ago(item.voimassaAlkuPvm) }}
            </template>

            <template v-slot:cell(paattyminen)="{ item }">
              <span v-if="item.voimassaLoppuPvm">{{ $ago(item.voimassaLoppuPvm) }}</span>
            </template>

          </b-table>

          <b-pagination
            v-model="sivu"
            :total-rows="raw.kokonaismäärä"
            :per-page="raw.sivukoko"
            aria-controls="tiedotteet"
            align="center" />
        </div>
        <ep-spinner v-else />
      </template>
    </b-modal>
  </div>
</template>


<script lang="ts">
import { Vue, Watch, Component, Prop } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import EpSearch from '../forms/EpSearch.vue';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import { KoodistoSelectStore } from './KoodistoSelectStore';
import _ from 'lodash';


@Component({
  components: {
    EpButton,
    EpSearch,
    EpSpinner,
  },
})
export default class EpKoodistoSelect extends Vue {
  @Prop({ required: true })
  private store!: KoodistoSelectStore;

  private isLoading = false;
  private query = '';

  get raw() {
    if (!this.store) {
      return null;
    }
    return this.store.data.value;
  }

  get items() {
    if (!this.raw) {
      return null;
    }

    return _(this.raw?.data)
      .map(x => {
        const nimi = _.mapValues(_.keyBy(x.metadata, v => _.toLower(v.kieli)), v => v.nimi);
        const kuvaus = _.mapValues(_.keyBy(x.metadata, v => _.toLower(v.kieli)), v => v.kuvaus);
        return {
          ...x,
          nimi,
          kuvaus,
        };
      })
      .value();
  }

  get sivu() {
    if (!this.raw) {
      return 1;
    }
    return this.raw.sivu + 1;
  }

  set sivu(value: number) {
    this.store.query(newValue, value - 1);
  }

  @Watch('query')
  async onQueryChange(newValue) {
    this.isLoading = true;
    await this.store.query(newValue, this.sivu - 1);
    this.isLoading = false;
  }

  openDialog() {
    (this.$refs.editModal as any).show();
    this.onQueryChange("");
  }

  selectKoodi(item: any) {
    this.$emit('add', item);
  }

  get fields() {
    return [{
      key: 'arvo',
      label: this.$t('arvo'),
    }, {
      key: 'nimi',
      label: this.$t('nimi'),
    }, {
      key: 'versio',
      label: this.$t('versio'),
    }, {
      key: 'voimaantulo',
      label: this.$t('voimaantulo'),
    }, {
      key: 'paattyminen',
      label: this.$t('voimaantulo-paattyminen'),
    }];
  }

}
</script>
