<template>
  <div>
    <template v-if="isEditing">
      <draggable
        v-bind="defaultDragOptions"
        tag="div"
        v-model="innerModel">
        <b-row v-for="(model, i) in innerModel" :key="group+i" class="pb-2">
          <b-col cols="11">
            <EpInput
              v-model="innerModel[i]"
              :is-editing="isEditing">
              <div class="order-handle m-2" slot="left">
                <fas icon="grip-vertical"/>
              </div>
            </EpInput>
          </b-col>
          <b-col cols="1" v-if="isEditing" class="text-center">
            <fas
              icon="roskalaatikko"
              class="default-icon clickable mt-2"
              @click="poistaTeksti(i)"/>
          </b-col>
        </b-row>
      </draggable>
      <EpButton
        variant="outline"
        icon="plus"
        @click="lisaaTeksti()"
        v-if="isEditing">
        <slot name="default">{{ $t('lisaa-teksti') }}</slot>
      </EpButton>
    </template>
    <template v-else-if="innerModel.length > 0">
      <ul>
        <li v-for="(model, i) in innerModel" :key="group+i">
          {{$kaanna(model)}}
        </li>
      </ul>
    </template>
  </div>

</template>

<script lang="ts">
import { Vue, Watch, Component, Prop } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import _ from 'lodash';
import EpInput from '@shared/components/forms/EpInput.vue';
import draggable from 'vuedraggable';

@Component({
  components: {
    EpButton,
    EpInput,
    draggable,
  },
})
export default class EpSortableTextList extends Vue {
  @Prop({ required: true })
  private value!: any[];

  @Prop({ default: false })
  private isEditing!: boolean;

  @Prop({ required: false, default: 'sortableTextList' })
  private group!: string;

  get innerModel() {
    return this.value;
  }

  set innerModel(innerModel) {
    this.$emit('input', innerModel);
  }

  lisaaTeksti() {
    this.innerModel = [
      ...this.innerModel,
      {},
    ];
  }

  poistaTeksti(poistettavaIndex) {
    this.innerModel = _.filter(this.innerModel, (teksti, index) => index !== poistettavaIndex);
  }

  get defaultDragOptions() {
    return {
      animation: 300,
      emptyInsertThreshold: 10,
      handle: '.order-handle',
      disabled: !this.isEditing,
      ghostClass: 'dragged',
      group: {
        name: this.group,
      },
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

</style>
