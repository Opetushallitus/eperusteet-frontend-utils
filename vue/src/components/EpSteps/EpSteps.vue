<template>
<div class="ep-steps">
  <div class="steps d-flex justify-content-center mr-5 ml-5 mb-5">
    <div role="button" v-for="(step, idx) in steps" :key="step.key" class="text-center p-4 step" @click="stepIdx = idx">
      <div :class="{ ball: true, active: idx === stepIdx }">
        {{ idx + 1 }}
      </div>
      <div :class="{ name: true, active: idx === stepIdx }">
        {{ step.name }}
      </div>
    </div>
  </div>

  <h2 class="heading">
    {{ currentStep.name }}
  </h2>
  <p class="description">
    {{ currentStep.description }}
  </p>

  <div>
    <slot :name="currentStep.key" />
  </div>

  <div class="clearfix">
    <div class="float-right mt-5">
      <ep-button variant="link" @click="previous" v-if="stepIdx > 0">{{ $t('edellinen') }}</ep-button>
      <ep-button @click="next" v-if="stepIdx < steps.length - 1">{{ $t('seuraava') }}</ep-button>
      <ep-button @click="onSave" v-else>
        <slot name="luo">{{ $t('tallenna') }}</slot>
      </ep-button>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'vue-property-decorator';
import EpButton from '@shared/components/EpButton/EpButton.vue';


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
  private steps!: Step[];

  @Prop({ default: 0 })
  private initialStep!: number;

  @Prop({ required: true })
  private onSave!: () => Promise<void>;

  private stepIdx = 0;

  @Watch('initialStep', { immediate: true })
  onInitialStepUpdate(value: number) {
    this.stepIdx = value;
  }

  mounted() {
  }

  get currentStep() {
    return this.steps[this.stepIdx];
  }

  previous() {
    --this.stepIdx;
  }

  next() {
    if (!this.currentStep.isValid || this.currentStep.isValid()) {
      ++this.stepIdx;
    }
    else {
    }
  }

}
</script>

<style scoped lang="scss">

.ep-steps {

  .steps {
    color: #767676;

    .step {
      user-select: none;
      cursor: pointer;
    }
  }

  .ball {
    border-radius: 100%;
    color: #b2b2b2;
    // border: 2px solid #b2b2b2;
  }

  .active {
    font-weight: 600;
    color: black;
  }
}

</style>
