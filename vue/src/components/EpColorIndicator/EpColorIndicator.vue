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
import { colorize, kouluturtyyppiRyhmat, themeColors, themes, rgb2string } from '../../utils/perusteet';
import * as _ from 'lodash';

const moduuliColors = {
  'normaali': [0, 0, 0],
  'pakollinen': [189, 219, 138],
  'valinnainen': [241, 102, 192],
  'paikallinen': [255, 165, 0],
};

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
  | 'taiteenperusopetus'
  | 'vapaasivistystyo'
  | 'tutkintoonvalmentava'
  | 'kotoutumiskoulutus';

@Component
export default class EpColorIndicator extends Vue {
  @Prop({ default: 'normaali' })
  kind!: IndicatorKind;

  @Prop({ default: true })
  tooltip!: boolean;

  @Prop({ default: 10 })
  size!: number;

  @Prop({ required: false })
  backgroundColor!: string;

  get spanClass() {
    return `ball ball-${this.kind}${this.tooltip ? ' ball-tooltip' : ''}`;
  }

  get background() {
    return themeColors[themes[this.kind]] || themeColors[this.kind] || moduuliColors[this.kind] || [0, 0, 0];
  }

  get dynstyle() {
    const result = {
      'min-height': this.size + 'px',
      'min-width': this.size + 'px',
      'background': this.backgroundColor ? this.backgroundColor : rgb2string(this.background),
    };

    return result;
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
  background: #000000;
}

.ball-pakollinen {
  background: #bddb8a;
}

.ball-valinnainen {
  background: #f166c0;
}

.ball-paikallinen {
  background: #ffa500;
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
