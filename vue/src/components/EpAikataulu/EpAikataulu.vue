<template>
  <div>
    <div class="pohja">
      <div
        class="kulunut-aika"
        :style="'width:'+kulunutAikaWidth +'%'"
      >
      &nbsp;
      </div>
      <div
        v-for="(aikataulu, i) in aikatauluTavoitteet"
        :id="'aikataulu-popover-'+i"
        :key="i"
        class="aikataulu d-inline-block"
        :style="'right:' + aikataulu.rightPosition +'%'"
        :class="aikataulu.tapahtuma"
      >
        <b-popover
          v-if="showPopover"
          :target="'aikataulu-popover-'+i"
          triggers="hover click"
          placement="topleft"
        >
          <template #title>
            {{ $sd(aikataulu.tapahtumapaiva) }}
          </template>

          <div style="width: 15vw">
            {{ $kaanna(aikataulu.tavoite) }}
          </div>
        </b-popover>
      </div>
    </div>

    <div class="alainfo">
      <div class="d-inline-block">
        <div v-if="julkaisuAikaPosition < luomisaikaPalloPoint">
          <div class="luomispaiva">
            {{ $sd(luomisPaiva) }}
          </div>
          <div class="paiva-alatieto">
            <slot name="luomispaiva-topic">
              <span v-html="$t('luotu')" />
            </slot>
          </div>
        </div>
        <div v-else>
        &nbsp;
        </div>
      </div>

      <div
        class="d-inline-block text-right julkaisu"
        :style="'right:'+julkaisuAikaPosition +'%'"
      >
        <div class="julkaisupaiva">
          <span v-if="julkaisuPaiva">{{ $sd(julkaisuPaiva) }}</span>
          <span v-else>&nbsp;</span>
        </div>
        <div class="paiva-alatieto">
          <slot name="julkaisupaiva-topic">
            <span v-html="$t('suunniteltu-julkaisupaiva')" />
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import _ from 'lodash';
import { aikataulutapahtuma, Tapahtuma } from '../../utils/aikataulu';

const props = defineProps({
  aikataulut: { type: Array as () => Tapahtuma[], required: true },
  showPopover: { type: Boolean, default: true },
});

const luomisaikaPalloPoint = 75;

const luomisAikataulu = computed(() => {
  return _.head(_.filter(props.aikataulut, (aikataulu) => aikataulu.tapahtuma === aikataulutapahtuma.luominen));
});

const julkaisuAikataulu = computed(() => {
  return _.head(_.filter(props.aikataulut, (aikataulu) => aikataulu.tapahtuma === aikataulutapahtuma.julkaisu));
});

const luomisPaiva = computed(() => {
  return luomisAikataulu.value?.tapahtumapaiva;
});

const julkaisuPaiva = computed(() => {
  return julkaisuAikataulu.value?.tapahtumapaiva;
});

const aikataulutSorted = computed(() => {
  return _.chain(props.aikataulut)
    .filter('tapahtumapaiva')
    .sortBy('tapahtumapaiva')
    .value();
});

const viimeinenTapahtuma = computed(() => {
  return _.chain(aikataulutSorted.value)
    .filter('tapahtumapaiva')
    .reverse()
    .head()
    .value();
});

const viimeinenPaiva = computed(() => {
  return viimeinenTapahtuma.value?.tapahtumapaiva;
});

const aikatauluTavoitteet = computed(() => {
  return _.chain(props.aikataulut)
    .filter(aikataulu => !(aikataulu.tapahtuma === aikataulutapahtuma.luominen && julkaisuAikaPosition.value < luomisaikaPalloPoint))
    .filter(aikataulu => aikataulu.tapahtuma !== aikataulutapahtuma.julkaisu)
    .filter('tapahtumapaiva')
    .map(aikataulu => {
      return {
        ...aikataulu,
        rightPosition: aikatauluPosition(aikataulu),
      };
    })
    .value();
});

const kulunutAikaWidth = computed(() => {
  if (julkaisuPaiva.value) {
    return Math.min(timelinePosition(new Date().getTime()), 100);
  }
  return 1;
});

const julkaisuAikaPosition = computed(() => {
  if (julkaisuPaiva.value) {
    return Math.min(100 - timelinePosition(julkaisuPaiva.value), 88);
  }
  return 0;
});

function aikatauluPosition(aikataulu) {
  if (aikataulu.tapahtuma === aikataulutapahtuma.luominen) {
    return 99;
  }
  return Math.min(Math.max(100 - timelinePosition(aikataulu.tapahtumapaiva), 0), 99);
}

function timelinePosition(time) {
  return Math.floor((Math.max(time, luomisPaiva.value) - luomisPaiva.value)
          / (viimeinenPaiva.value - luomisPaiva.value) * 100);
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

  .pohja {
    margin: 10px 0px;
    background-color: $gray-lighten-8;
    border-radius: 15px;
    height: 10px;
    position: relative;

    .kulunut-aika {
      background-color: $green-lighten-3;
      border-radius: 15px;
      height: 10px;
      position: absolute;
    }

    .aikataulu {
      height: 14px;
      width: 14px;
      border-radius: 30px;
      position: absolute;
      top: -2px;

      &.tavoite, &.luominen, &.lausuntokierros, &.johtokunnankasittely, &.arvioitujulkaisupaiva {
        background-color: $blue-lighten-5;
      }

      &.julkaisu {
        background-color: $blue-lighten-2;
      }
    }

  }

  .alainfo {
    position: relative;
    height: 75px;

    .julkaisu {
      position: absolute;
    }
  }

  .luomispaiva {
    border-left: 1px solid $gray-lighten-3;
    padding-left: 5px;
  }

  .julkaisupaiva {
    border-right: 1px solid $gray-lighten-3;
    padding-right: 5px;
  }

  .paiva-alatieto {
    color: $gray-lighten-1;
  }

</style>
