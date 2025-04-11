<template>
  <div>
    <template v-if="isEditing">
      <draggable
        v-bind="taitotasotOptions"
        v-model="taitotasot"
        tag="div"
      >
        <div
          v-for="(taitotaso, index) in taitotasot"
          :key="taitotaso+index"
          class="px-3 py-2 mb-4 taitotaso"
        >
          <div
            slot="left"
            class="order-handle mb-1"
          >
            <EpMaterialIcon>drag_indicator</EpMaterialIcon>
            <span class="otsikko"> {{ $t(sisalto['koodisto-otsikko']) }}</span>
          </div>

          <EpKoodistoSelect
            v-model="taitotaso.nimi"
            :store="koodisto"
            :is-editing="true"
            :nayta-arvo="false"
          >
            <template #default="{ open }">
              <b-input-group>
                <b-form-input
                  :value="taitotaso.nimi ? $kaanna(taitotaso.nimi.nimi) : ''"
                  disabled
                />
                <b-input-group-append>
                  <b-button
                    variant="primary"
                    @click="open"
                  >
                    {{ $t('hae-koodistosta') }}
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </template>
          </EpKoodistoSelect>

          <b-form-group
            v-if="isOpintokokonaisuus"
            class="col-5 mt-2"
          >
            <div class="d-flex align-items-center">
              <b-form-group :label="$t('laajuus-vahintaan')">
                <ep-input
                  v-model="taitotaso.tyoelamaOpintoMinimiLaajuus"
                  type="number"
                  is-editing
                />
              </b-form-group>
              <div class="ml-2 pt-3">
                -
              </div>
              <b-form-group
                :label="$t('laajuus-enintaan')"
                class="ml-2"
              >
                <ep-input
                  v-model="taitotaso.tyoelamaOpintoMaksimiLaajuus"
                  type="number"
                  is-editing
                />
              </b-form-group>
              <div class="ml-2 pt-3">
                {{ $t('op') }}
              </div>
            </div>
          </b-form-group>

          <b-form-group
            :label="tavoitteetOtsikko"
            required
            class="mt-4"
          >
            <ep-content
              v-model="taitotaso.tavoitteet"
              layout="normal"
              :is-editable="isEditing"
              :kasite-handler="kasiteHandler"
              :kuva-handler="kuvaHandler"
            />
          </b-form-group>

          <h3 class="mt-4">
            {{ $t('opiskelijan-osaaminen') }}
          </h3>

          <b-form-group
            v-for="(sisalto, index) in sisalto.keskeisetsisallot"
            :key="'sisalto'+index"
            :label="sisalto['otsikko'] ? $t(sisalto['otsikko']) : ''"
            :label-class="sisalto['otsikko'] ? 'mt-4' : ''"
          >
            <h6>{{ $t('opiskelija') }}</h6>
            <ep-content
              v-model="taitotaso[sisalto['object']]"
              layout="normal"
              :is-editable="isEditing"
              :kasite-handler="kasiteHandler"
              :kuva-handler="kuvaHandler"
            />
          </b-form-group>

          <div class="text-right">
            <!--            funktio puuttuu...-->
            <!--            <ep-button variant="link" @click="poistaTavoitealue(tavoitealue)">-->
            <!--              <EpMaterialIcon icon-shape="outlined" :color="'inherit'" :background="'inherit'">delete</EpMaterialIcon>-->
            <!--              {{ $t('poista-tavoitteet-ja-sisaltoalueet') }}-->
            <!--            </ep-button>-->
            <ep-button
              variant="link"
              icon="delete"
              @click="poistaTaitotaso(taitotaso)"
            >
              {{ $t(sisalto['poista-taitotaso']) }}
            </ep-button>
          </div>
        </div>
      </draggable>

      <ep-button
        variant="outline"
        icon="add"
        @click="lisaaTaitotaso()"
      >
        {{ $t(sisalto['lisaa-taitotaso']) }}
      </ep-button>
    </template>

    <div v-else>
      <div
        v-for="(taitotaso, index) in taitotasot"
        :key="taitotaso+index"
      >
        <hr
          v-if="index > 0"
          class="mb-4"
        >

        <h2 v-if="taitotaso.nimi">
          {{ taitotasoOtsikko(taitotaso) }}
        </h2>

        <b-form-group class="mt-3">
          <h3 slot="label">
            {{ tavoitteetOtsikko }}
          </h3>
          <ep-content
            v-if="kuvaHandler"
            :value="taitotaso.tavoitteet"
            :kasite-handler="kasiteHandler"
            :kuva-handler="kuvaHandler"
            layout="normal"
          />
          <ep-content-viewer
            v-else
            :value="$kaanna(taitotaso.tavoitteet)"
            :termit="termit"
            :kuvat="kuvat"
          />

          <slot
            v-bind="taitotaso"
            name="paikallinentarkennus"
          />
        </b-form-group>

        <h3>{{ $t('opiskelijan-osaaminen') }}</h3>

        <div
          v-for="(keskeinenSisalto, index) in keskeisetSisallot"
          :key="'sisalto'+index"
        >
          <b-form-group
            v-if="taitotaso[keskeinenSisalto['object']]"
            class="mt-3 mb-2 p-0"
          >
            <template v-if="keskeinenSisalto['otsikko']">
              <h4 slot="label">
                {{ $t(keskeinenSisalto['otsikko']) }}
              </h4>
            </template>
            <h6>{{ $t('opiskelija') }}</h6>
            <ep-content
              v-if="kuvaHandler"
              :value="taitotaso[keskeinenSisalto['object']]"
              :kasite-handler="kasiteHandler"
              :kuva-handler="kuvaHandler"
              layout="normal"
            />
            <ep-content-viewer
              v-else
              :value="$kaanna(taitotaso[keskeinenSisalto['object']])"
              :termit="termit"
              :kuvat="kuvat"
            />
          </b-form-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import _ from 'lodash';
import { KoodistoSelectStore } from '../EpKoodistoSelect/KoodistoSelectStore';
import { Koodisto, TermiDto } from '@shared/api/eperusteet';
import draggable from 'vuedraggable';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpKoodistoSelect from '@shared/components/EpKoodistoSelect/EpKoodistoSelect.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import { IKasiteHandler } from '../EpContent/KasiteHandler';
import { IKuvaHandler } from '../EpContent/KuvaHandler';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import { LiiteDtoWrapper } from '@shared/tyypit';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

enum TaitotasoTyyppi {
  opintokokonaisuus = 'opintokokonaisuus',
  kielitaitotaso = 'kielitaitotaso',
}

@Component({
  components: {
    EpKoodistoSelect,
    EpButton,
    draggable,
    EpInput,
    EpContent,
    EpContentViewer,
    EpMaterialIcon,
  },
})
export default class EpKotoTaitotasot extends Vue {
  @Prop({ required: true })
  private value!: any[];

  @Prop({ required: false, default: false, type: Boolean })
  private isEditing!: boolean;

  @Prop({ required: false })
  private kasiteHandler!: IKasiteHandler;

  @Prop({ required: false })
  private kuvaHandler!: IKuvaHandler;

  @Prop({ required: false })
  private taitotasoTyyppi!: TaitotasoTyyppi;

  @Prop({ required: false, type: Array })
  private termit!: TermiDto[];

  @Prop({ required: false, type: Array })
  private kuvat!: LiiteDtoWrapper[];

  get taitotasot() {
    return this.value;
  }

  get isOpintokokonaisuus() {
    return this.taitotasoTyyppi === TaitotasoTyyppi.opintokokonaisuus;
  }

  set taitotasot(value) {
    this.$emit('input', value);
  }

  private readonly koodisto = new KoodistoSelectStore({
    koodisto: 'kotoutumiskoulutustavoitteet',
    async query(query: string, sivu = 0, koodisto: string) {
      const { data } = (await Koodisto.kaikkiSivutettuna(koodisto, query, {
        params: {
          sivu,
          sivukoko: 10,
        },
      }));
      return data as any;
    },
  });

  lisaaTaitotaso() {
    this.taitotasot = [
      ...this.taitotasot,
      {},
    ];
  }

  poistaTaitotaso(taitotaso) {
    this.taitotasot = _.filter(this.taitotasot, rivi => rivi !== taitotaso);
  }

  get defaultDragOptions() {
    return {
      animation: 300,
      emptyInsertThreshold: 10,
      handle: '.order-handle',
      ghostClass: 'dragged',
      forceFallback: true,
    };
  }

  get taitotasotOptions() {
    return {
      ...this.defaultDragOptions,
      group: {
        name: 'taitotasot',
      },
    };
  }

  get tavoitteetOtsikko() {
    if (this.taitotasoTyyppi === TaitotasoTyyppi.kielitaitotaso) {
      return this.$t('tavoitteet');
    }

    return this.$t('tavoitteet-ja-sisallot');
  }

  taitotasoOtsikko(taitotaso) {
    if (this.taitotasoTyyppi === TaitotasoTyyppi.kielitaitotaso) {
      return this.$kaanna(taitotaso.nimi.nimi);
    }

    if (taitotaso.tyoelamaOpintoMinimiLaajuus || taitotaso.tyoelamaOpintoMaksimiLaajuus) {
      const laajuus = this.getLaajuusteksti(taitotaso.tyoelamaOpintoMinimiLaajuus, taitotaso.tyoelamaOpintoMaksimiLaajuus);
      return `${this.$kaanna(taitotaso.nimi.nimi)}, ${laajuus} ${this.$t('op')}`;
    }

    return this.$kaanna(taitotaso.nimi.nimi);
  }

  private getLaajuusteksti(minimi, maksimi) {
    if (!minimi) {
      return maksimi || '';
    }

    if (!maksimi) {
      return `${(this.$t('vahintaan'))} ${minimi}`;
    }

    return `${minimi} - ${maksimi}`;
  }

  get sisalto() {
    return this.tyyppiSisalto[this.taitotasoTyyppi];
  }

  get tyyppiSisalto() {
    return {
      [TaitotasoTyyppi.opintokokonaisuus]: {
        'koodisto-otsikko': 'opintokokonaisuuden-nimi',
        'lisaa-taitotaso': 'lisaa-opintokokonaisuus',
        'poista-taitotaso': 'poista-opintokokonaisuus',
        keskeisetsisallot: [
          {
            object: 'opiskelijanTyoelamataidot',
          },
        ],
      },
      [TaitotasoTyyppi.kielitaitotaso]: {
        'koodisto-otsikko': 'kielitaitotason-nimi',
        'lisaa-taitotaso': 'lisaa-kielitaitotaso',
        'poista-taitotaso': 'poista-kielitaitotaso',
        keskeisetsisallot: [
          {
            otsikko: 'suullinen-vastaanottaminen',
            object: 'suullinenVastaanottaminen',
          },
          {
            otsikko: 'suullinen-tuottaminen',
            object: 'suullinenTuottaminen',
          },
          {
            otsikko: 'vuorovaikutus-ja-mediaatio',
            object: 'vuorovaikutusJaMediaatio',
          },
        ],
      },
    };
  }

  get keskeisetSisallot() {
    return [
      {
        otsikko: 'kielenkayttotarkoitus',
        object: 'kielenkayttotarkoitus',
      },
      {
        otsikko: 'aihealueet',
        object: 'aihealueet',
      },
      {
        otsikko: 'viestintataidot',
        object: 'viestintataidot',
      },
      {
        otsikko: 'opiskelijan-taidot',
        object: 'opiskelijantaidot',
      },
      {
        object: 'opiskelijanTyoelamataidot',
      },
      {
        otsikko: 'suullinen-vastaanottaminen',
        object: 'suullinenVastaanottaminen',
      },
      {
        otsikko: 'suullinen-tuottaminen',
        object: 'suullinenTuottaminen',
      },
      {
        otsikko: 'vuorovaikutus-ja-mediaatio',
        object: 'vuorovaikutusJaMediaatio',
      },
    ];
  }
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

  ::v-deep .input-group-append {
    display: inline-block;
  }

  .taitotaso {
    border: 1px solid $gray-lighten-8;
    border-radius: 3px;

    .otsikko {
      color: $black;
    }
  }
</style>
