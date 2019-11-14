<template>
<div v-if="valueFormatted">
  <div class="teksti" v-html="valueFormatted" />
  <div v-for="(viite, idx) in termitWrapped"
       :key="idx">
    <b-popover v-if="viite && viite.el && viite.termi"
               :target="viite.el"
               triggers="click blur"
               placement="bottom">
      <template v-slot:title v-if="viite.termi.selitys">{{ $kaanna(viite.termi.termi) }}</template>
      <div v-if="!viite.termi.selitys">{{ $kaanna(viite.termi.termi) }}</div>
      <ep-content-viewer v-if="viite.termi.selitys"
                         :value="$kaanna(viite.termi.selitys)"
                         :termit="termit"
                         :kuvat="kuvat" />
    </b-popover>
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { TermiDto, LiiteDtoWrapper, ServiceType } from '../../api/tyypit';
import { Kielet } from '../../stores/kieli';

@Component
export default class EpContentViewer extends Vue {

  @Prop({ required: false, type: String })
  private value!: string; // Käännetty versio

  @Prop({ required: false, type: Array })
  private termit!: TermiDto[];

  @Prop({ required: false, type: Array })
  private kuvat!: LiiteDtoWrapper[];

  @Prop({ default: 'eperusteet-service', type: String })
  private service!: ServiceType;
  // Todo: toteuta ylops ja amosaa

  private termiElements: Element[] = [];

  get valueFormatted() {
    if (this.value) {
      const template = document.createElement('template');
      template.innerHTML = this.value;

      const tables = template.content.querySelectorAll('table');
      _.each(tables, table => {
        table.setAttribute('class', 'table table-striped table-bordered');
      });

      return template.innerHTML;
    }
  }

  get termitWrapped() {
    return _.map(this.termiElements, el => {
      const termi: any = _.find(this.termit, {'avain': el.getAttribute('data-viite') });
      if (termi) {
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        el.setAttribute('title', Kielet.kaanna(termi.termi));
        return {
          el,
          termi,
        };
      }
    });
  }

  @Watch('value', { immediate: true })
  async onValueChanged(newVal) {
    await this.$nextTick(); // Odotetaan DOM-elementtien rendausta
    if (newVal) {

      // Termit
      const abbrs = this.$el.querySelectorAll('abbr');
      _.each(abbrs, abbr => {
        this.termiElements.push(abbr);
      });

      // kuvat
      const imgs = this.$el.querySelectorAll('img');
      _.each(imgs, img => {
        const kuva = _.find(this.kuvat, {'id': img.getAttribute('data-uid') }) as LiiteDtoWrapper;
        if (kuva) {
          img.setAttribute('src', kuva.src);
          if (kuva.kuva.nimi) {
            img.setAttribute('alt', kuva.kuva.nimi);
          }
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/_mixins.scss';

.teksti {
  @include teksti-sisalto;
}
</style>
