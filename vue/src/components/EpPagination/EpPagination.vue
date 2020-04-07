<template>
<div>
  moro
  <!-- <b-pagination align="center"        -->
  <!--   no-local-sorting                  -->
  <!--   v-model="sivu"        -->
  <!--   :per-page="perPage"   -->
  <!--   :total-rows="total"/> -->
</div>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import _ from 'lodash';

interface Step {
  key: string;
  name: string;
  description: string;
  isValid?: () => boolean;
}

@Component({
  components: {
    EpButton,
  },
})
export default class EpSteps extends Vue {
  @Prop({ required: true })
  private value!: number;

  @Prop({ required: true })
  private perPage!: number;

  @Prop({ required: true })
  private totalRows!: number;
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

.ep-steps {

  .steps {
    color: #767676;

    .step {
      user-select: none;
      cursor: pointer;

      .connection {
        border-top: 2px solid $gray-lighten-3;
        position: relative;
        width: 100%;
        top: 38px;
        z-index: 1;

        &.right {
          width: 50%;
          left: 50%;
        }

        &.left {
          width: 50%;
        }
      }

    }
  }

  .ball {
    padding: 1px 9px;
    margin-bottom: 10px;
    border-radius: 100%;
    color: $white;
    background-color: $blue-lighten-5;
    position: relative;
    z-index: 10;
  }

  .active:not(.ball) {
    font-weight: 600;
    color: black;
  }
}

</style>

