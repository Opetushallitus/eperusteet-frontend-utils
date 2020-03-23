<template>
<div v-if="value">
  <div v-if="isEditing">
    <b-form-group :label="$t('otsikko')">
      <ep-input v-model="value.kohde" :is-editing="true" />
    </b-form-group>
    <b-form-group :label="$t('vaatimukset')">
      <draggable
        v-bind="vaatimusOptions"
        tag="div"
        v-model="value.vaatimukset">
        <div v-for="(v, idx) in value.vaatimukset" :key="idx" class="d-flex align-items-center mt-1">
          <div class="flex-grow-1">
            <vaatimus-field :koodisto="koodisto" v-model="value.vaatimukset[idx]" />
          </div>
          <div>
            <ep-button @click="poistaVaatimus(value, v)" variant="link">
              <fas icon="roskalaatikko" />
            </ep-button>
          </div>
        </div>
      </draggable>
      <div class="mt-2">
        <ep-button variant="outline"
          @click="lisaaVaatimus(value)"
                   icon="plus">
                   {{ $t('lisaa-ammattitaitovaatimus-ilman-kohdealuetta') }}
        </ep-button>
      </div>
    </b-form-group>
    <b-form-group :label="$t('ammattitaito-kohdealueet')">
      <draggable
        v-bind="kohdealueOptions"
        tag="div"
        v-model="value.kohdealueet">
        <div v-for="(kohdealue, kohdealueIdx) in value.kohdealueet" class="kohdealue mt-2" :key="kohdealueIdx">
          <div class="float-right">
            <ep-button @click="poistaKohdealue(value, kohdealue)" variant="link">
              <fas icon="roskalaatikko" />
              {{ $t('poista-kohdealue') }}
            </ep-button>
          </div>
          <b-form-group :label="$t('kohdealueen-otsikko')">
            <ep-input v-model="kohdealue.kuvaus" :is-editing="true" />
          </b-form-group>
          <b-form-group :label="$t('vaatimukset')" class="">
            <div class="otsikko font-italic">
              {{ $kaanna(value.kohde) }}
            </div>
            <draggable
              v-bind="vaatimusOptions"
              tag="div"
              v-model="kohdealue.vaatimukset">
              <div v-for="(v, idx) in kohdealue.vaatimukset" :key="idx" class="mt-1 d-flex align-items-center">
                <div class="flex-grow-1">
                  <vaatimus-field :koodisto="koodisto" v-model="kohdealue.vaatimukset[idx]" />
                </div>
                <div>
                  <ep-button @click="poistaVaatimus(kohdealue, v)" variant="link">
                    <fas icon="roskalaatikko" />
                  </ep-button>
                </div>
              </div>
            </draggable>
            <div class="mt-2">
              <ep-button @click="lisaaVaatimus(kohdealue)"
                variant="outline"
                icon="plus">
                {{ $t('lisaa-vaatimus') }}
              </ep-button>
            </div>
          </b-form-group>
        </div>
      </draggable>
      <div class="mt-2">
        <ep-button @click="lisaaKohdealue(value)"
          variant="outline"
          icon="plus">
          {{ $t('lisaa-kohdealue') }}
        </ep-button>
      </div>
    </b-form-group>
  </div>
  <div v-else>
    <div class="otsikko font-weight-bold">
      {{ $kaanna(value.kohde) }}
    </div>
    <ul>
      <li v-for="(v, vidx) in value.vaatimukset" :key="vidx">
        <span v-if="v.koodi">
          <span>{{ $kaanna(v.koodi.nimi) }}</span>
          <span class="ml-1">
            (<a :href="'https://virkailija.opintopolku.fi/koodisto-ui/html/koodi/' + v.koodi.uri"
              target="_blank"
              rel="nofollow noopener noreferrer">{{ v.koodi.arvo }}</a>)
          </span>
        </span>
        <span v-else>
          <span>{{ $kaanna(v.vaatimus) }}</span>
          <span class="ml-2"></span>
        </span>
      </li>
    </ul>
    <div>
      <div v-for="(kohdealue, kaIdx) in value.kohdealueet" class="mt-4" :key="kaIdx">
        <div class="otsikko font-weight-bold">
          {{ $kaanna(kohdealue.kuvaus) }}
        </div>
        <div class="otsikko font-italic">
          {{ $kaanna(value.kohde) }}
        </div>
        <ul>
          <li v-for="(v, kvIdx) in kohdealue.vaatimukset" :key="kvIdx">
            <span v-if="v.koodi">
              <span>{{ $kaanna(v.koodi.nimi) }}</span>
              <span class="ml-1">
                (<a :href="'https://virkailija.opintopolku.fi/koodisto-ui/html/koodi/' + v.koodi.uri"
                  target="_blank"
                  rel="nofollow noopener noreferrer">{{ v.koodi.arvo }}</a>)
              </span>
            </span>
            <span v-else>
              <span>{{ $kaanna(v.vaatimus) }}</span>
              <span class="ml-2"></span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import EpInput from '../forms/EpInput.vue';
import EpExternalLink from '../EpExternalLink/EpExternalLink.vue';
import VaatimusField from './VaatimusField.vue';
import { Ammattitaitovaatimukset2019Dto } from '../../api/eperusteet';
import draggable from 'vuedraggable';
import { KoodistoSelectStore } from '@shared/components/EpKoodistoSelect/KoodistoSelectStore';
import { Koodisto } from '@shared/api/eperusteet';
import _ from 'lodash';

@Component({
  components: {
    draggable,
    EpButton,
    EpExternalLink,
    EpInput,
    VaatimusField,
  },
})
export default class EpAmmattitaitovaatimukset extends Vue {
  @Prop({ required: true })
  private value!: Ammattitaitovaatimukset2019Dto;

  @Prop({ default: false })
  private isEditing!: boolean;

  private koodisto = new KoodistoSelectStore({
    async query(query: string, sivu = 0) {
      return (await Koodisto.kaikkiSivutettuna('ammattitaitovaatimukset', query, {
        params: {
          sivu,
          sivukoko: 10,
        }
      })).data as any;
    },
  });

  poistaKohdealue(value: any, el: any) {
    value.kohdealueet = _.without(value.kohdealueet, el);
  }

  poistaVaatimus(value: any, el: any) {
    value.vaatimukset = _.without(value.vaatimukset, el);
  }

  lisaaKohdealue(value: Ammattitaitovaatimukset2019Dto) {
    value.kohdealueet = [...value.kohdealueet || [], {
      kuvaus: null,
      koodi: null as any,
      vaatimukset: [] as any[],
    }];
  }

  get kohdealueOptions() {
    return {
      animation: 300,
      emptyInsertThreshold: 10,
      group: {
        name: 'kohdealueet-drag-list',
      },
      disabled: !this.isEditing,
      ghostClass: 'dragged',
    };
  }

  get vaatimusOptions() {
    return {
      animation: 300,
      emptyInsertThreshold: 10,
      group: {
        name: 'vaatimukset',
      },
      disabled: !this.isEditing,
      ghostClass: 'dragged',
    };
  }

  lisaaVaatimus(value: any) {
    value.vaatimukset = [...value.vaatimukset || [], {
      vaatimus: null,
      koodi: null,
    }];
  }
}
</script>

<style scoped lang="scss">
.kohdealue {
  border: 1px solid #eee;
}

.dragged {
  background: white;
}
</style>
