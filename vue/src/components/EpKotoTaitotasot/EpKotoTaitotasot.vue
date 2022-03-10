<template>
  <div>
    <template v-if="isEditing">
      <draggable
        v-bind="taitotasotOptions"
        tag="div"
        v-model="taitotasot">
        <div v-for="(taitotaso, index) in taitotasot" :key="taitotaso+index" class="px-3 py-2 mb-4 taitotaso">

          <div class="order-handle mb-1" slot="left">
            <fas icon="grip-vertical"></fas>
            <span class="otsikko"> {{$t(sisalto['koodisto-otsikko'])}}</span>
          </div>

          <EpKoodistoSelect
            :store="koodisto"
            v-model="taitotaso.nimi"
            :is-editing="true"
            :naytaArvo="false">
            <template #default="{ open }">
              <b-input-group>
                <b-form-input
                  :value="taitotaso.nimi ? $kaanna(taitotaso.nimi.nimi) : ''"
                  disabled></b-form-input>
                <b-input-group-append>
                  <b-button @click="open" icon="plus" variant="primary">
                    {{ $t('hae-koodistosta') }}
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </template>
          </EpKoodistoSelect>

          <b-form-group :label="$t('tavoitteet')" required class="mt-4">
            <ep-content v-model="taitotaso.tavoitteet"
                          layout="normal"
                          :is-editable="isEditing"
                          :kasiteHandler="kasiteHandler"
                          :kuvaHandler="kuvaHandler"></ep-content>
          </b-form-group>

          <h5 class="mt-4">{{$t('opiskelijan-osaaminen')}}</h5>

          <b-form-group v-for="(sisalto, index) in sisalto.keskeisetsisallot" :key="'sisalto'+index" :label="$t(sisalto['otsikko'])" class="mt-4">
            <ep-content v-model="taitotaso[sisalto['object']]"
                        layout="normal"
                        :is-editable="isEditing"
                        :kasiteHandler="kasiteHandler"
                        :kuvaHandler="kuvaHandler"></ep-content>

          </b-form-group>

          <div class="text-right">
            <ep-button variant="link" icon="roskalaatikko" @click="poistaTaitotaso(taitotaso)">
              {{ $t(sisalto['poista-taitotaso']) }}
            </ep-button>
          </div>
        </div>
      </draggable>

      <ep-button variant="outline" icon="plus" @click="lisaaTaitotaso()">
        {{ $t(sisalto['lisaa-taitotaso']) }}
      </ep-button>
    </template>

    <div v-else>
      <div v-for="(taitotaso, index) in taitotasot" :key="taitotaso+index">
        <hr v-if="index > 0" class="mb-4"/>

        <h2 v-if="taitotaso.nimi">{{$kaanna(taitotaso.nimi.nimi)}}</h2>

        <b-form-group class="mt-3">
          <h3 slot="label">{{$t('tavoitteet')}}</h3>
          <ep-content v-if="kuvaHandler" :value="taitotaso.tavoitteet" :kasiteHandler="kasiteHandler" :kuvaHandler="kuvaHandler"/>
          <ep-content-viewer v-else :value="$kaanna(taitotaso.tavoitteet)" :termit="termit" :kuvat="kuvat" />
        </b-form-group>

        <h3>{{$t('opiskelijan-osaaminen')}}</h3>

        <div v-for="(keskeinenSisalto, index) in keskeisetSisallot" :key="'sisalto'+index">
          <b-form-group class="mt-3 mb-2 p-0" v-if="taitotaso[keskeinenSisalto['object']]">
            <h4 slot="label">{{$t(keskeinenSisalto['otsikko'])}}</h4>
            <ep-content v-if="kuvaHandler" :value="taitotaso[keskeinenSisalto['object']]" :kasiteHandler="kasiteHandler" :kuvaHandler="kuvaHandler"/>
            <ep-content-viewer v-else :value="$kaanna(taitotaso[keskeinenSisalto['object']])" :termit="termit" :kuvat="kuvat" />
          </b-form-group>
        </div>

      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'vue-property-decorator';
import _ from 'lodash';
import { KoodistoSelectStore } from '../EpKoodistoSelect/KoodistoSelectStore';
import { Koodisto, TermiDto } from '@shared/api/eperusteet';
import draggable from 'vuedraggable';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpKoodistoSelect from '@shared/components/EpKoodistoSelect/EpKoodistoSelect.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import { IKasiteHandler } from '../EpContent/KasiteHandler';
import { IKuvaHandler, ILiite } from '../EpContent/KuvaHandler';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import { LiiteDtoWrapper } from '@shared/tyypit';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';

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

  set taitotasot(value) {
    this.$emit('input', value);
  }

  private readonly koodisto = new KoodistoSelectStore({
    async query(query: string, sivu = 0) {
      const { data } = (await Koodisto.kaikkiSivutettuna('kotoutumiskoulutustavoitteet', query, {
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
            otsikko: 'aihealueet',
            object: 'aihealueet',
          },
          {
            otsikko: 'opiskelijan-taidot',
            object: 'opiskelijantaidot',
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
            otsikko: 'vuorovaikutus-ja-meditaatio',
            object: 'vuorovaikutusJaMeditaatio',
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
        otsikko: 'suullinen-vastaanottaminen',
        object: 'suullinenVastaanottaminen',
      },
      {
        otsikko: 'suullinen-tuottaminen',
        object: 'suullinenTuottaminen',
      },
      {
        otsikko: 'vuorovaikutus-ja-meditaatio',
        object: 'vuorovaikutusJaMeditaatio',
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
