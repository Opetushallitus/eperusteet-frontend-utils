<template>
<span ref="ball"
      :style="dynstyle"
      :title="$t(kind)"
      :class="spanClass">
  <b-tooltip v-if="tooltip"
             :target="() => $refs['ball']"
             placement="top"
             triggers="hover">
    {{ $t(kind) }}
  </b-tooltip>
</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { colorize, kouluturtyyppiRyhmat } from '../../utils/perusteet';
import * as _ from 'lodash';

export type IndicatorKind = 'normaali'
  | 'pakollinen'
  | 'valinnainen'
  | 'laadinta'
  | 'julkaistu'
  | 'valmis'
  | 'poistettu'
  | 'paikallinen'
  | 'offline'
  | 'online'
  | 'ammatillinen'
  | 'esiopetus'
  | 'lukio'
  | 'perusopetus'
  | 'varhaiskasvatus'
  | 'taiteenperusopetus';



@Component
export default class EpColorIndicator extends Vue {
  @Prop({ default: 'normaali' })
  kind!: IndicatorKind;

  @Prop({ default: true })
  tooltip!: boolean;

  @Prop({ default: 10 })
  size!: number;

  get spanClass() {
    return `ball ball-${this.kind}${this.tooltip ? ' ball-tooltip' : ''}`;
  }

  get dynstyle() {
    const background = colorize(this.kind) || 'black';
    return {
      'min-height': this.size + 'px',
      'min-width': this.size + 'px',
      background: _.includes(kouluturtyyppiRyhmat, this.kind),
    };
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/_variables.scss';

.ball {
  background: black;
  border-radius: 100%;
  display: inline-block;
}

.ball-normaali {
  background: black;
}

.ball-pakollinen {
  background: #bddb8a;
}

.ball-valinnainen {
  background: #F166C0;
}

.ball-paikallinen {
  background: orange;
}

.ball-offline {
  background: #DADADA;
}

.ball-online {
  background: #7CD443;
}

.ball-tooltip {
  cursor: help;
}

</style>
