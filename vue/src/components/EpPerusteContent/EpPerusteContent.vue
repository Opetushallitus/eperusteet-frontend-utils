<template>
  <div class="mt-4">
    <slot
      v-if="perusteObject"
      name="header"
    >
      <h3>{{ $kaanna(perusteObject[otsikko]) }}</h3>
    </slot>
    <ep-collapse
      v-if="perusteObject && perusteObject[teksti]"
      tyyppi="perusteteksti"
      :border-bottom="false"
      :border-top="false"
      :expanded-by-default="perusteTekstiAvattu"
    >
      <template #header>
        <h4>{{ $t('perusteen-teksti') }}</h4>
      </template>
      <ep-content-viewer
        :value="$kaanna(perusteObject[teksti])"
        :kuvat="kuvat"
        :termit="termit"
      />
    </ep-collapse>

    <ep-collapse
      v-if="pohjaObject && pohjaObject[teksti]"
      class="mb-4"
      :use-padding="false"
      tyyppi="pohjateksti"
      :border-bottom="false"
      :border-top="false"
      :expanded-by-default="perusteTekstiAvattu"
    >
      <template #header>
        <h4>{{ $kaanna(pohjaNimi) }}</h4>
      </template>
      <span v-html="$kaanna(pohjaObject[teksti])" />
    </ep-collapse>

    <div v-if="object && (naytaSisaltoTyhjana || hasContent)">
      <slot name="otsikko" />
      <template v-if="isEditing">
        <h4>{{ $t('paikallinen-teksti') }}</h4>
        <ep-content
          v-if="isEditing || hasContent"
          v-model="object[teksti]"
          layout="normal"
          :is-editable="isEditing"
        />
      </template>

      <EpPaikallinenTarkennus
        v-if="!isEditing"
        headerh4
      >
        <ep-content-viewer
          v-if="hasContent"
          :value="$kaanna(object[teksti])"
          :kuvat="kuvat"
          :termit="termit"
        />
      </EpPaikallinenTarkennus>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, InjectReactive } from 'vue-property-decorator';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import EpAlert from '@shared/components/EpAlert/EpAlert.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';

@Component({
  components: {
    EpCollapse,
    EpContent,
    EpAlert,
    EpContentViewer,
  },
} as any)
export default class EpPerusteContent extends Vue {
  @Prop({ required: false })
  private perusteObject!: any;

  @Prop({ required: false })
  private pohjaObject!: any;

  @Prop({ required: false })
  private object!: any;

  @Prop({ default: false })
  private isEditing!: boolean;

  @Prop({ default: 'otsikko' })
  private otsikko!: string;

  @Prop({ default: 'teksti' })
  private teksti!: string;

  @Prop({ default: false })
  private perusteTekstiAvattu!: boolean;

  @Prop({ default: false })
  private naytaSisaltoTyhjana!: boolean;

  @Prop({ required: false })
  private kuvat!: any[];

  @Prop({ required: false })
  private termit!: any[];

  @InjectReactive('opetussuunnitelma')
  private opetussuunnitelma!: any;

  get hasContent() {
    return this.object != null && this.object[this.teksti] != null;
  }

  get pohjaNimi() {
    return this.opetussuunnitelma?.pohja?.nimi;
  }
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

</style>
