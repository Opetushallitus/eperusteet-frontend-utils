<template>
  <div
    class="moduulibox d-flex justify-content-between p-2"
    :class="{'moduulibox-valittu': valittu, 'selectable': isEditing}"
    role="button"
    @click="toggle()"
    @keyup.enter="toggle()"
    tabindex="0"
    :title="moduuliNimi">
    <div class="name">{{ moduuliNimi }} ({{ moduuli.koodi.arvo }})</div>
    <div class="d-flex bd-highlight align-items-center">
      <span class="pr-2">{{ moduuli.laajuus }} {{ $t('opintopiste') }}</span>
      <ep-color-indicator :kind="moduuli.pakollinen ? 'pakollinen' : 'valinnainen'"/>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import { Lops2019OpintojaksonModuuliDto, Lops2019ModuuliDto } from '@shared/api/ylops';
import { Kielet } from '@shared/stores/kieli';

@Component({
  components: {
    EpColorIndicator,
  },
})
export default class EpOpintojaksonModuuli extends Vue {
  @Prop({ required: true })
  private moduuli!: Lops2019ModuuliDto;

  @Prop({ required: false })
  private value!: Lops2019OpintojaksonModuuliDto[];

  @Prop({ default: false })
  private isEditing!: boolean;

  get moduuliNimi() {
    if (this.moduuli) {
      return Kielet.kaanna(this.moduuli.nimi);
    }
  }

  get koodi() {
    try {
      return this.moduuli!.koodi!.uri!;
    }
    catch (err) {
      return null;
    }
  }

  get valittu() {
    return this.koodi && this.koodit[this.koodi];
  }

  get koodit() {
    return _.keyBy(this.value, 'koodiUri');
  }

  public toggle() {
    if (!this.isEditing) {
      return;
    }

    const koodiUri = this.koodi;
    if (koodiUri) {
      if (this.koodit[koodiUri]) {
        this.$emit('input', _.reject(this.value, x => x.koodiUri === koodiUri));
      }
      else {
        this.$emit('input', [
          ...this.value,
          { koodiUri },
        ]);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

.moduulibox {
  background-color: #E6F6FF;
  color: $blue-darken-1;
  user-select: none;
  border-radius: 5px;

  &.selectable {
    cursor: pointer;
  }

  &:hover {
    background-color: #C3EAFF;
  }

  .name {
    font-weight: bold;

    &::-webkit-scrollbar {
      width: 0.5em;
    }
    &::-webkit-scrollbar-track {
      background-color: $blue-lighten-4;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $blue-lighten-3;
      border-radius: 0.5em;
    }
  }

  .bottom {
    .icon {
      color: #3367E3;
    }

    .icon-editing {
      cursor: pointer;
    }
  }
}

.moduulibox-valittu {
  color: white;
  animation: fade 0.1s linear;
  background-color: #3367E3;

   &:hover {
    background-color: #3367E3;
  }

  .name {
    &::-webkit-scrollbar-track {
      background-color: $light-blue;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $dark-blue;
    }
  }
}

</style>
