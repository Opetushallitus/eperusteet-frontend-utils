<template>
  <div>
    <h4 v-if="file">{{$t('kuva')}}</h4>
    <h4 v-else>{{$t('lataa-uusi-kuva')}}</h4>
    <div class="ops-dokumentti-tiedosto-lataus" :class="file ? 'tiedosto' : 'ei-tiedosto'">
      <div class="h-100">

        <b-form-file v-if="!file" accept="image/jpeg, image/png" :placeholder="placeholder" :drop-placeholder="dropPlaceholder" :browse-text="browseText" @input="onInput"></b-form-file>

        <div class="justify-content-around align-items-center h-100" v-if="file">
          <div class="h-100 justify-content-around align-items-center">
            <figure><img v-if="previewUrl" :src="previewUrl" :width="previewWidth" :height="previewHeight"/>
              <figcaption v-if="!saved">{{ $t('fu-valittu-tiedosto') }}: {{ file ? file.name : '' }}</figcaption>
            </figure>
          </div>

          <div class="mb-3" v-if="!saved">
            <div class="d-flex align-items-center">
              <ep-form-content name="kuvan-leveys" class="mb-3">
                <div class="d-flex align-items-center">
                  <ep-field v-model="value.width" :is-editing="true" type="number"></ep-field>
                  <span class="ml-1 mr-3">px</span>
                </div>
              </ep-form-content>

              <ep-form-content name="kuvan-korkeus" class="mb-3">
                <div class="d-flex align-items-center">
                  <ep-field v-model="value.height" :is-editing="true" type="number"></ep-field>
                  <span class="ml-1">px</span>
                </div>
              </ep-form-content>

            </div>

            <ep-toggle :is-switch="false" v-model="keepAspectRatio">{{$t('sailyta-mittasuhteet')}}</ep-toggle>
          </div>

          <div class="justify-content-center">
            <div v-if="!saved">
              <ep-button @click="saveImage()" class="mr-3" v-if="fileValidi">
                <slot name="tallenna">{{ $t('tallenna') }}</slot>
              </ep-button>
              <ep-button @click="cancel" variant="link">
                <slot name="peruuta">{{ $t('peruuta') }}</slot>
              </ep-button>
            </div>
            <div v-else>
              <ep-button @click="cancel" variant="link">
                {{ $t('valitse-toinen-kuva') }}
              </ep-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';

import EpButton from '../EpButton/EpButton.vue';
import { fail } from '@shared/utils/notifications';
import _ from 'lodash';
import EpField from '@shared/components/forms/EpField.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';

export interface ImageData {
  file: File ;
  height: number;
  width: number;
  preview: string;
  previewUrl: string;
}

@Component({
  components: {
    EpButton,
    EpField,
    EpFormContent,
    EpToggle,
  },
})
export default class EpKuvaLataus extends Vue {
  private fileMaxSize = 1 * 1024 * 1024;
  private fileTypes: string [] = ['image/jpeg', 'image/png'];
  private keepAspectRatio: boolean = true;
  private changeBlock: boolean = false;
  private originalHeightRatio: number = 0;
  private originalWidthRatio: number = 0;
  private previewWidth: number = 0;
  private previewHeight: number = 0;

  mounted() {
    if (this.value) {
      this.originalHeightRatio = this.height / this.width;
      this.originalWidthRatio = this.width / this.height;
      this.recalcPreview();
    }
  }

  @Prop()
  private value!: ImageData;

  @Prop()
  private saved!: boolean;

  get previewUrl() {
    if (this.value) {
      return this.value.previewUrl;
    }
  }

  get file() {
    if (this.value) {
      return this.value.file;
    }
  }

  get placeholder() {
    return this.$t('fu-placeholder');
  }

  get dropPlaceholder() {
    return this.$t('fu-placeholder');
  }

  get browseText() {
    return this.$t('fu-browse-text');
  }

  get fileValidi() {
    return this.file != null && (this.file as any).size <= this.fileMaxSize && _.includes(this.fileTypes, (this.file as any).type);
  }

  // Luodaan esikatselukuva kuvan valitsemisen jälkeen
  async onInput(file: File) {
    if (file != null && file.size > this.fileMaxSize) {
      fail('pdf-tiedosto-kuva-liian-suuri');
    }

    if (file != null && !_.includes(this.fileTypes, file.type)) {
      fail('pdf-tiedosto-kuva-vaara-tyyppi');
    }

    if (file != null) {
      // Luodaan uusi lukija ja rekisteröidään kuuntelija
      const reader = new FileReader();

      // Ladataan kuva Base64 muodossa
      reader.readAsDataURL(file);
      reader.onload = (evt: any) => {
        let img = new Image();
        img.onload = () => {
          this.$emit('input', {
            file,
            width: img.width,
            height: img.height,
            preview: reader.result,
            previewUrl: evt.target.result,
          } as ImageData);
        };
        img.src = evt.target.result;
      };
    }
  }

  async saveImage() {
    this.$emit('saveImage');
  }

  cancel() {
    this.$emit('cancel');
  }

  get width() {
    return this.value?.width;
  }

  get height() {
    return this.value?.height;
  }

  @Watch('width')
  widthChange(newVal) {
    if (newVal && this.keepAspectRatio && !this.changeBlock) {
      this.changeBlock = true;
      this.value.height = this.round(this.width * this.originalHeightRatio);
    }
    else if (this.changeBlock) {
      this.changeBlock = false;
    }

    this.recalcPreview();
  }

  @Watch('height')
  heightChange(newVal) {
    if (newVal && this.keepAspectRatio && !this.changeBlock) {
      this.changeBlock = true;
      this.value.width = this.round(this.height * this.originalWidthRatio);
    }
    else if (this.changeBlock) {
      this.changeBlock = false;
    }

    this.recalcPreview();
  }

  recalcPreview() {
    this.previewWidth = this.width;
    this.previewHeight = this.height;
    if (this.width > this.height) {
      if (this.width > 500) {
        this.previewWidth = 500;
      }
      this.previewHeight = this.round(this.previewWidth * ((this.height / this.width)));
    }
    else {
      if (this.height > 500) {
        this.previewHeight = 500;
      }
      this.previewWidth = this.round(this.previewHeight * (this.width / this.height));
    }
  }

  round(number) {
    return _.toNumber(parseFloat(number).toFixed(0));
  }
}

</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

.kuvaus {
  font-size: 0.8rem;
  color: $gray;
}

.ops-dokumentti-tiedosto-lataus {
  margin: 0px 0px;
  width:100%;
  border-width: 1px;
  border-color: $gray-lighten-2;
  border-style: dashed;
  border-radius: 10px;
  position: relative;

  img {
    max-width: 500px;
    max-height: 500px;
  }

  &.tiedosto {
    background-color: $white;
    border-style: none;
  }

  &.ei-tiedosto {
    height: 150px;
    background-color: $gray-lighten-7;
  }

  .custom-file::v-deep{
    height: 100%;
    flex-direction: column;
    justify-content: center;
    display: flex;

    input {
      display: none;
    }

    .custom-file-label {
      width: 90%;
      background-image: url('../../../public/img/icons/lataus_ikoni.svg');
      background-repeat: no-repeat;
      background-position: left;
      border: 0px;
      margin-left: 30px;
      height: 50px;
      background-color: inherit;
      padding-top: 0px;
      padding-left: 60px;
      position: relative;
      border-radius: 0;
    }

    .custom-file-label::after {
      padding: 60px 310px 0px 0px;
      text-decoration: underline;
      color: blue;
      padding: 0;
      display: inline;
      position: relative;
      background-color: $gray-lighten-7;
    }
  }
}

</style>
