<template>
  <div class="d-flex align-self-center flex-wrap flex-lg-row flex-column toggles">
    <EpToggle v-model="query.tuleva" class="haku-toggle tuleva" :is-s-witch="false">
      <span v-if="query.tuleva" class="sr-only">{{ $t('valittu') }}</span>
      <span class="sr-only">{{ $t('voimassaolo-filtteri') }}</span>
      {{ $t('tulossa-voimaan') }}
    </EpToggle>
    <EpToggle v-model="query.voimassaolo" class="haku-toggle voimassaolo" :is-s-witch="false">
      <span v-if="query.voimassaolo" class="sr-only">{{ $t('valittu') }}</span>
      <span class="sr-only">{{ $t('voimassaolo-filtteri') }}</span>
      {{ $t('voimassa') }}
    </EpToggle>
    <EpToggle v-model="query.poistunut" class="haku-toggle poistunut" :is-s-witch="false">
      <span v-if="query.poistunut" class="sr-only">{{ $t('valittu') }}</span>
      <span class="sr-only">{{ $t('voimassaolo-filtteri') }}</span>
      {{ $t('ei-voimassa') }}
    </EpToggle>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpToggle from '@shared/components/forms/EpToggle.vue';

@Component({
  components: {
    EpToggle,
  },
})
export default class EpVoimassaoloFilter extends Vue {
  @Prop({ required: true })
  private query!: any;
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

  .toggles {
    padding-bottom: 20px;

    .haku-toggle {
      padding: 2px 7px;
      border: 1px solid $gray-lighten-8;
      border-radius: 6px;
      margin-right: 7px;

      ::v-deep .toggle {
        border: 0;
      }

      &.tuleva ::v-deep .toggle {
         background-color: $tuleva-color;
      }

      &.voimassaolo ::v-deep .toggle {
         background-color: $green;
      }

      &.poistunut ::v-deep .toggle {
         background-color: $paattynyt-color;
      }
    }
  }
</style>
