<template>
  <span
    ref="ball"
    class="material-icons"
    :style="dynstyle"
    :title="$t(kind)"
    :class="spanClass"
    aria-hidden="true"
  >
    circle
    <b-popover
      v-if="tooltip"
      :target="() => ball"
      :placement="'top'"
      triggers="hover"
      variant="primary"
    >
      <span>{{ $t(kind) }}</span>
    </b-popover>
  </span>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { themeColors, themes, rgb2string } from '../../utils/perusteet';

const moduuliColors = {
  'normaali': [0, 0, 0],
  'pakollinen': [189, 219, 138],
  'valinnainen': [241, 102, 192],
  'paikallinen': [255, 165, 0],
  'valittu': [128, 255, 192],
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
  | 'lukiokoulutus'
  | 'perusopetus'
  | 'varhaiskasvatus'
  | 'taiteenperusopetus'
  | 'vapaasivistystyo'
  | 'tutkintoonvalmentava'
  | 'kotoutumiskoulutus';

const props = defineProps({
  kind: {
    type: String as () => IndicatorKind,
    default: 'normaali',
  },
  tooltip: {
    type: Boolean,
    default: true,
  },
  size: {
    type: Number,
    default: 10,
  },
  backgroundColor: {
    type: String,
    required: false,
  },
});

const ball = useTemplateRef('ball');

const spanClass = computed(() => {
  return `ball ball-${props.kind}${props.tooltip ? ' ball-tooltip' : ''}`;
});

const background = computed(() => {
  return themeColors[themes[props.kind]] || themeColors[props.kind] || moduuliColors[props.kind] || [0, 0, 0];
});

const dynstyle = computed(() => {
  const result = {
    'color': props.backgroundColor ? props.backgroundColor : rgb2string(background.value),
  };

  return result;
});
</script>

<style lang="scss" scoped>
@import '../../styles/_variables.scss';

.ball {
  font-size: 0.7rem;
  color: black;
}

.ball-normaali {
  color: #000000;
}

.ball-pakollinen {
  color: #bddb8a;
}

.ball-valinnainen {
  color: #f166c0;
}

.ball-paikallinen {
  color: #ffa500;
}

.ball-offline {
  color: #DADADA;
}

.ball-online {
  color: #7CD443;
}

.ball-tooltip {
  cursor: help;
}

</style>
