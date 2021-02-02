<template>
  <div class="release mb-3 pt-2 pb-4">
    <p class="created-at">{{ $sdt(tiedote.luotu) }}</p>
    <h2 class="font-weight-normal">{{ $kaanna(tiedote.otsikko) }}</h2>
    <div class="release-content">
      <span v-if="!readMore" v-html="$kaanna(tiedote.sisalto).slice(0, charLimit) + '...'"></span>
      <span v-else v-html="$kaanna(tiedote.sisalto)"></span>
      <button class="read-more" @click="onReadMore">
        {{ readMore ? $t('lue-vahemman') : $t('lue-lisaa-2') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { TiedoteDto } from '../../tyypit';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EpTiedote extends Vue {
  @Prop({ required: true })
  private tiedote!: TiedoteDto;

  @Prop({ required: false, default: 400 })
  private charLimit!: number;

  private readMore = false;

  onReadMore() {
    this.readMore = !this.readMore;
  }

}
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

.release {
  border-bottom: 2px solid $gray-lighten-10;
}

.created-at {
  color: $gray-lighten-1;
  font-size: 0.85rem;
}

.read-more {
  appearance: none;
  border: 0;
  background: none;
  padding: 0;
  margin: 0;
  color: $blue-lighten-5;
  outline: none;
  text-transform: lowercase;

  &:focus,
  &:hover {
    text-decoration: underline;
  }
}

.release-content {
  ::v-deep p:last-of-type {
    display: inline;
    margin-right: 0.5rem;
  }
}
</style>
