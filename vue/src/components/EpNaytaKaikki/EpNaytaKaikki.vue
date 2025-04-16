<template>
  <div>
    <div
      v-for="(modelObject, index) in model"
      :key="'item'+index"
      class="row"
      :class="striped ? 'striped' : ''"
    >
      <slot
        :data="modelObject"
        :index="index"
      />
    </div>
    <div
      v-if="totalListLength > collapsedSize"
      class="nayta-btn"
      @click="toggleNaytaKaikki()"
    >
      <span v-html="naytaKaikki ? $t('nayta-vahemman') : $t('nayta-kaikki')" />
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class EpNaytaKaikki extends Vue {
  @Prop({ required: true })
  private value!: any[];

  @Prop({ required: false, default: 3 })
  private collapsedSize!: number;

  @Prop({ required: false, default: false, type: Boolean })
  private striped!: boolean;

  private naytaKaikki: boolean = false;

  get model() {
    return this.naytaKaikki ? this.value : this.value.slice(0, this.collapsedSize);
  }

  get totalListLength() {
    return this.value.length;
  }

  toggleNaytaKaikki() {
    this.naytaKaikki = !this.naytaKaikki;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.striped {
  &:nth-of-type(even) {
    background-color: $table-even-row-bg-color;
  }
  &:nth-of-type(odd) {
    background-color: $table-odd-row-bg-color;
  }
}
.row {
  padding: 0.5rem;
}

.nayta-btn {
  margin-top: 10px;
  color: #3367E3;
  font-weight: 600;
  cursor: pointer;
}
</style>
