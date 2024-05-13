<template>
  <div>
    <slot></slot>
    <div v-if="totalListLength > collapsedSize"
         @click="toggleNaytaKaikki()"
         class="nayta-btn">
      <span v-html="naytaKaikki ? $t('nayta-vahemman') : $t('nayta-kaikki')"></span>
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
  private value!: boolean;

  @Prop({ required: true })
  private totalListLength!: number;

  @Prop({ required: true })
  private collapsedSize!: number;

  get naytaKaikki() {
    return this.value;
  }

  set naytaKaikki(val) {
    this.$emit('input', val);
  }

  toggleNaytaKaikki() {
    this.naytaKaikki = !this.naytaKaikki;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.validointi {
  &:nth-of-type(even) {
    background-color: $table-even-row-bg-color;
  }
  &:nth-of-type(odd) {
    background-color: $table-odd-row-bg-color;
  }
}

.nayta-btn {
  margin-top: 10px;
  color: #3367E3;
  font-weight: 600;
  cursor: pointer;
}
</style>
