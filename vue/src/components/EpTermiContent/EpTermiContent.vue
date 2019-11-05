<template>
<div>
  <div class="teksti" v-html="value" id="popover-3" />
  <b-popover :target="viite.viite"
             triggers="hover focus"
             placement="top"
             v-for="(viite, idx) in viiteTermit"
             :key="idx">
    <template v-slot:title>{{ $kaanna(viite.termi.termi)}}</template>
    <div v-html="$kaanna(viite.termi.selitys)"></div>
  </b-popover>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { TermiDto } from '../../api/tyypit';
import { Kielet } from '../../stores/kieli';

@Component
export default class EpTermiContent extends Vue {

  @Prop({ required: true, type: String })
  private value!: string; // Käännetty versio

  @Prop()
  private termit!: TermiDto[];

  private viitteet: any[] = [];

  get viiteTermit() {
    return _.map(this.viitteet, viite => {
      const termi: any = _.find(this.termit, {'avain': viite.getAttribute('id') });
      viite.setAttribute('title', Kielet.kaanna(termi.termi));
      return {
        viite,
        termi
      };
    });
  }

  @Watch('value', { immediate: true })
  async luoTermit() {
    await this.$nextTick();

    const abbrs = this.$el.querySelectorAll('abbr');
    _.each(abbrs, abbr => {
      const dataViite = abbr.getAttribute('data-viite');
      if (dataViite) {
        abbr.setAttribute('id', dataViite);
        abbr.setAttribute('tabindex', '0');
        this.viitteet.push(abbr);
      }
    });
  }

}
</script>

<style lang="scss" scoped>
@import '../../styles/_mixins.scss';

.teksti {
  @include teksti-sisalto;
}
</style>
