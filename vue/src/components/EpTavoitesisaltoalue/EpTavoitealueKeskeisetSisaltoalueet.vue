<template>
  <div>
    <draggable
      v-bind="keskeisetSisaltoalueetOptions"
      tag="div"
      v-model="keskeisetSisaltoalueet">
      <b-row v-for="(keskeinenSisaltoalue, keskeinenSisaltoalueIndex) in keskeisetSisaltoalueet" :key="keskeinenSisaltoalue+keskeinenSisaltoalueIndex" class="pb-2">
        <b-col cols="11">
          <ep-input v-model="keskeisetSisaltoalueet[keskeinenSisaltoalueIndex]" :is-editing="true" class="flex-grow-1">
            <div class="order-handle m-2" slot="left">
              <fas icon="grip-vertical"></fas>
            </div>
          </ep-input>
        </b-col>
        <b-col cols="1">
          <fas icon="roskalaatikko" class="default-icon clickable mt-2" @click="poistaKeskeinenSisaltoalue(keskeinenSisaltoalue)"/>
        </b-col>
      </b-row>
    </draggable>

    <ep-button variant="outline" icon="plus" @click="lisaaKeskeinenSisaltoalue()" >
      {{ $t('lisaa-keskeinen-sisaltoalue') }}
    </ep-button>
  </div>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'vue-property-decorator';
import _ from 'lodash';
import draggable from 'vuedraggable';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpInput from '@shared/components/forms/EpInput.vue';

@Component({
  components: {
    EpButton,
    draggable,
    EpInput,
  },
})
export default class EpTavoitealueKeskeisetSisaltoalueet extends Vue {
  @Prop({ required: true })
  private value!: any[];

  get keskeisetSisaltoalueet() {
    return this.value;
  }

  set keskeisetSisaltoalueet(value) {
    this.$emit('input', value);
  }

  lisaaKeskeinenSisaltoalue() {
    this.keskeisetSisaltoalueet = [
      ...this.keskeisetSisaltoalueet,
      {},
    ];
  }

  poistaKeskeinenSisaltoalue(keskeinenSisaltoalue) {
    this.keskeisetSisaltoalueet = _.filter(this.keskeisetSisaltoalueet, rivi => rivi !== keskeinenSisaltoalue);
  }

  get defaultDragOptions() {
    return {
      animation: 300,
      emptyInsertThreshold: 10,
      handle: '.order-handle',
      ghostClass: 'dragged',
    };
  }

  get keskeisetSisaltoalueetOptions() {
    return {
      ...this.defaultDragOptions,
      group: {
        name: 'keskeisetsisaltoalueet',
      },
    };
  }
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

</style>
