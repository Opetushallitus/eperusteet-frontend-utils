<template>
  <div v-if="isEditing">
    <ep-form-content name="termin-nimi">
      <ep-field
        v-model="muokattava.termi"
        help="termin-nimi"
        :validation="$v.muokattava.termi"
        :is-editing="true"
      />
    </ep-form-content>
    <ep-form-content name="termin-kuvaus">
      <ep-field
        v-model="muokattava.selitys"
        help="termin-kuvaus"
        :validation="$v.muokattava.selitys"
        :is-editing="true"
      />
    </ep-form-content>
    <ep-form-content
      v-if="alaviiteSupported"
      name="alaviitteessa"
    >
      <ep-toggle v-model="muokattava.alaviite">
        {{ $t('nayta-alaviitteessa') }}
      </ep-toggle>
    </ep-form-content>
    <ep-button
      id="tallenna-kasite"
      :disabled="$v.muokattava.$invalid"
      :show-spinner="isLoading"
      @click="tallenna"
    >
      {{ $t('tallenna') }}
    </ep-button>
    <ep-button
      class="ml-2"
      variant="warning"
      :show-spinner="isLoading"
      @click="peruuta"
    >
      {{ $t('peruuta') }}
    </ep-button>
  </div>
  <div v-else>
    <ep-spinner v-if="isLoading" />
    <div v-else>
      <vue-select
        :value="valittu"
        :filter-by="filterBy"
        :placeholder="$t('valitse-kasite')"
        label="avain"
        :options="kasitteet"
        @input="onSelect"
      >
        <template
          slot="selected-option"
          slot-scope="option"
        >
          <span>{{ $kaanna(option.termi) }}</span>
        </template>
        <template
          slot="option"
          slot-scope="option"
        >
          <div>
            <span>{{ $kaanna(option.termi) }}</span>
          </div>
          <div class="pl-3 small font‑weight‑light">
            <span v-html="$kaanna(option.selitys)" />
          </div>
        </template>
      </vue-select>
      <b-button
        v-if="valittu"
        id="muokkaa-termia"
        class="lisaa-painike"
        variant="primary"
        @click="muokkaa(valittu)"
      >
        {{ $t('muokkaa-kasitetta') }}
      </b-button>
      <b-button
        id="lisaa-uusi-termi"
        class="lisaa-painike"
        variant="primary"
        @click="muokkaa()"
      >
        {{ $t('lisaa-uusi-kasite') }}
      </b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Mixins, Prop, Component } from 'vue-property-decorator';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpValidation from '@shared/mixins/EpValidation';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { kasiteValidator } from '@shared/validators/kasite';
import VueSelect from 'vue-select';
import { IKasiteHandler, ITermi } from './KasiteHandler';
import _ from 'lodash';

@Component({
  components: {
    EpButton,
    EpField,
    EpFormContent,
    EpInput,
    EpSpinner,
    EpToggle,
    VueSelect,
  },
})
export default class TermitEditor extends Mixins(EpValidation) {
  @Prop({ required: true })
  private value!: string | null;

  @Prop({ required: true })
  private handler!: IKasiteHandler;

  private kasitteet: ITermi[] = [];

  private isLoading = false;
  private isEditing = false;
  private valittu: ITermi | null = null;
  private muokattava: ITermi = {};

  get validationConfig() {
    return {
      muokattava: {
        ...kasiteValidator(),
      },
    };
  }

  private filterBy(option, label, search) {
    const k = (this as any).$kaanna;
    const v = k(option.termi) + ' ' + k(option.selitys);
    return (v)
      .toLowerCase()
      .indexOf(search.toLowerCase()) > -1;
  }

  async mounted() {
    try {
      this.isLoading = true;
      this.kasitteet = await this.handler.getAll();
      if (this.value) {
        this.valittu = _.find(this.kasitteet, (k) => k.avain === this.value) || null;
      }
    }
    catch (err) {
      throw err;
    }
    finally {
      this.isLoading = false;
    }
  }

  async peruuta() {
    this.isEditing = false;
  }

  async tallenna() {
    try {
      this.isLoading = true;
      const uusi = await this.handler.addOrUpdate(this.muokattava);
      if (!this.muokattava.avain) {
        this.kasitteet.unshift(uusi);
      }
    }
    finally {
      this.isLoading = false;
      this.isEditing = false;
    }
  }

  muokkaa(valittu) {
    if (valittu) {
      this.muokattava = valittu;
    }
    else {
      this.muokattava = {
        alaviite: false,
      };
    }
    this.isEditing = true;
  }

  onSelect(valittu) {
    this.valittu = valittu;
    if (this.valittu && this.valittu.avain) {
      this.$emit('input', this.valittu.avain);
    }
  }

  get alaviiteSupported() {
    return _.has(this.muokattava, 'alaviite');
  }
}
</script>

<style scoped lang="scss">
::v-deep .vs__dropdown-menu {
  overflow-x: hidden !important;
}

::v-deep .vs__dropdown-option {
  overflow-x: hidden !important;
  white-space: normal !important;
  i {
    font-size: small;
  }
}

.lisaa-painike {
  margin-top: 6px;
  width: 100%;
}
</style>
