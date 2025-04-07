<template>
  <div class="paikallinen-tarkennus-alue">
    <ep-collapse
      v-if="avattava && !noheader"
      tyyppi="paikallinen-teksti"
      :border-bottom="false"
      :use-padding="false"
    >
      <template #header>
        <div class="otsikko">
          <slot name="header">
            <h4
              v-if="headerh4"
              class="mb-0"
            >
              {{ $t('paikallinen-teksti') }}
            </h4>
            <div
              v-else
              class="otsikko"
            >
              {{ $t('paikallinen-teksti') }}
            </div>
          </slot>
        </div>
      </template>
      <slot />
    </ep-collapse>

    <div
      v-else
      class="vain-teksti"
    >
      <slot
        v-if="!noheader"
        name="header"
      >
        <h4 v-if="headerh4">
          {{ $t('paikallinen-teksti') }}
        </h4>
        <div
          v-else
          class="otsikko"
        >
          {{ $t('paikallinen-teksti') }}
        </div>
      </slot>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EpPaikallinenTarkennus extends Vue {
  @Prop({ required: false, default: true, type: Boolean })
  private avattava!: boolean;

  @Prop({ required: false, default: false, type: Boolean })
  private headerh4!: boolean;

  @Prop({ required: false, default: false, type: Boolean })
  private noheader!: boolean;
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.paikallinen-tarkennus-alue {
  border-radius: 1rem;
  background-color: $ylops-paikallinen-color;
  padding: 0.8rem;

  .vain-teksti {
    .otsikko {
      margin-bottom: 8px;
    }
  }

  .otsikko {
    font-weight: 600;
  }
}

</style>
