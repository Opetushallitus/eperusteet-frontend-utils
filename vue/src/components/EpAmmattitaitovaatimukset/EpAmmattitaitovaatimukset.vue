<template>
<div v-if="inner">
  <div v-if="isEditing">
    <b-form-group :label="$t('otsikko')">
      <ep-input v-model="inner.kohde" :is-editing="true" :validation="validation && validation.kohde" :warning="true" />
    </b-form-group>
    <b-form-group :label="$t('vaatimukset')">
      <draggable
        v-bind="vaatimusOptions"
        tag="div"
        v-model="inner.vaatimukset">
        <div v-for="(v, vaatimusIdx) in inner.vaatimukset"
             :key="vaatimusIdx"
             class="d-flex mt-1">
          <div class="flex-grow-1">
            <vaatimus-field :koodisto="koodisto"
                            v-model="inner.vaatimukset[vaatimusIdx]"
                            :validation="vaatimusValidation(null, vaatimusIdx)" />
          </div>
          <div>
            <Kayttolistaus v-if="inner.vaatimukset[vaatimusIdx].koodi"
                           :koodi="inner.vaatimukset[vaatimusIdx].koodi" />
          </div>
          <div>
            <b-button @click="poistaVaatimus(inner, v)" variant="link">
              <fas icon="roskalaatikko" />
            </b-button>
          </div>
        </div>
      </draggable>
      <div class="mt-2">
        <ep-button variant="outline"
                   @click="lisaaVaatimus(inner)"
                   icon="plus">
                   {{ $t('lisaa-ammattitaitovaatimus-ilman-kohdealuetta') }}
        </ep-button>
      </div>
    </b-form-group>
    <b-form-group :label="$t('ammattitaito-kohdealueet')">
      <draggable
        v-bind="kohdealueOptions"
        tag="div"
        v-model="inner.kohdealueet">
        <div v-for="(kohdealue, kohdealueIdx) in inner.kohdealueet" class="kohdealue mt-2" :key="kohdealueIdx">
          <div class="float-right">
            <ep-button @click="poistaKohdealue(inner, kohdealue)" variant="link">
              <fas icon="roskalaatikko" />
              {{ $t('poista-kohdealue') }}
            </ep-button>
          </div>
          <b-form-group>
            <div slot="label">
              <span class="handle-kohdealue text-muted">
                <fas icon="dragindicator" size="lg" />
              </span>
              <span class="font-weight-bold">{{ $t('kohdealueen-otsikko') }}</span>
            </div>
            <ep-input v-model="kohdealue.kuvaus" :is-editing="true" :validation="validation && validation.kohdealueet.$each.$iter[kohdealueIdx].kuvaus" />
          </b-form-group>
          <b-form-group :label="$t('vaatimukset')" class="">
            <div class="otsikko font-italic">
              {{ $kaanna(inner.kohde) }}
            </div>
            <draggable
              v-bind="vaatimusOptions"
              tag="div"
              v-model="kohdealue.vaatimukset">
              <div v-for="(v, vaatimusIdx) in kohdealue.vaatimukset" :key="vaatimusIdx" class="mt-1 d-flex align-items-center">
                <div class="flex-grow-1">
                  <vaatimus-field :koodisto="koodisto"
                                  v-model="kohdealue.vaatimukset[vaatimusIdx]"
                                  :validation="vaatimusValidation(kohdealueIdx, vaatimusIdx)" />
                </div>
                <div>
                  <Kayttolistaus v-if="kohdealue.vaatimukset[vaatimusIdx].koodi"
                                :koodi="kohdealue.vaatimukset[vaatimusIdx].koodi" />
                </div>
                <div>
                  <ep-button @click="poistaVaatimus(kohdealue, v)" variant="link">
                    <fas icon="roskalaatikko" />
                  </ep-button>
                </div>
              </div>
            </draggable>
            <div class="mt-2">
              <ep-button @click="lisaaKohdealueVaatimus(kohdealue)"
                variant="outline"
                icon="plus">
                {{ $t('lisaa-vaatimus') }}
              </ep-button>
            </div>
          </b-form-group>
        </div>
      </draggable>
      <div class="mt-2">
        <ep-button @click="lisaaKohdealue(inner)"
          variant="outline"
          icon="plus">
          {{ $t('lisaa-kohdealue') }}
        </ep-button>
      </div>
    </b-form-group>
  </div>
  <div v-else>
    <div class="otsikko font-weight-bold">
      {{ $kaanna(inner.kohde) }}
    </div>
    <ul>
      <li v-for="(v, vidx) in inner.vaatimukset" :key="vidx">
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
      <div v-for="(kohdealue, kaIdx) in inner.kohdealueet" class="mt-4" :key="kaIdx">
        <div class="otsikko font-weight-bold">
          {{ $kaanna(kohdealue.kuvaus) }}
        </div>
        <div class="otsikko font-italic">
          {{ $kaanna(inner.kohde) }}
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
import EpErrorWrapper from '../forms/EpErrorWrapper.vue';
import EpInput from '../forms/EpInput.vue';
import EpExternalLink from '../EpExternalLink/EpExternalLink.vue';
import VaatimusField from './VaatimusField.vue';
import { Ammattitaitovaatimukset2019Dto } from '../../api/eperusteet';
import draggable from 'vuedraggable';
import { KoodistoSelectStore } from '@shared/components/EpKoodistoSelect/KoodistoSelectStore';
import { Koodisto } from '@shared/api/eperusteet';
import _ from 'lodash';
import Kayttolistaus from './Kayttolistaus.vue';


@Component({
  components: {
    EpButton,
    EpErrorWrapper,
    EpExternalLink,
    EpInput,
    Kayttolistaus,
    VaatimusField,
    draggable,
  },
})
export default class EpAmmattitaitovaatimukset extends Vue {
  @Prop({ required: true })
  private value!: Ammattitaitovaatimukset2019Dto | null;

  @Prop({ default: false })
  private isEditing!: boolean;

  @Prop({ default: null })
  public validation!: any;

  get inner() {
    return this.value || {
      kohde: null,
      vaatimukset: [],
      kohdealueet: [],
    };
  }

  set inner(value) {
    this.$emit('input', value);
  }

  get kohdealueOptions() {
    return {
      animation: 300,
      emptyInsertThreshold: 10,
      handle: '.handle-kohdealue',
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
      handle: '.handle',
      group: {
        name: 'vaatimukset',
      },
      disabled: !this.isEditing,
      ghostClass: 'dragged',
    };
  }

  private koodisto = new KoodistoSelectStore({
    async query(query: string, sivu = 0) {
      return (await Koodisto.kaikkiSivutettuna('ammattitaitovaatimukset', query, {
        params: {
          sivu,
          sivukoko: 10,
        },
      })).data as any;
    },
  });

  async poistaKohdealue(value: any, el: any) {
    if (await this.$vahvista(this.$t('poista-kohdealue') as string, this.$t('poista-kohdealue-kuvaus') as string)) {
      Vue.set(value, 'kohdealueet', _.without(value.kohdealueet, el));
    }
  }

  async poistaVaatimus(value: any, el: any) {
    if (await this.$vahvista(this.$t('poista-vaatimus') as string, this.$t('poista-vaatimus-kuvaus') as string)) {
      Vue.set(value, 'vaatimukset', _.without(value.vaatimukset, el));
    }
  }

  lisaaKohdealue(value: Ammattitaitovaatimukset2019Dto) {
    Vue.set(this.inner, 'kohdealueet', [...(this.inner.kohdealueet || []), {
      kuvaus: null as any,
      vaatimukset: [] as any[],
    }]);
  }

  lisaaKohdealueVaatimus(kohdealue: any) {
    Vue.set(kohdealue, 'vaatimukset', [...(kohdealue.vaatimukset || []), {
      vaatimus: null,
      koodi: null,
    }]);
  }

  lisaaVaatimus() {
    Vue.set(this.inner, 'vaatimukset', [...(this.inner.vaatimukset || []), {
      vaatimus: null,
      koodi: null,
    }]);
  }

  vaatimusValidation(kohdealueIdx: number | null, vaatimusIdx: number) {
    if (!kohdealueIdx) {
      return this.validation?.vaatimukset?.$each?.$iter[vaatimusIdx]?.vaatimus;
    }
    else {
      return this.validation?.kohdealueet?.$each?.$iter[kohdealueIdx]?.vaatimukset?.$each?.$iter[vaatimusIdx]?.vaatimus;
    }
  }
}
</script>

<style scoped lang="scss">
.kohdealue {
  padding: 0px 8px 8px 8px;
  border: 1px solid #eee;
}

.dragged {
  background: white;
}
</style>
