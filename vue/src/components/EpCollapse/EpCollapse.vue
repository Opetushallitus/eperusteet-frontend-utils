<template>
<div>
  <div :class="classess" v-if="!disableHeader">
    <!-- Button tagia ei voida käyttää, sillä ml-auto ei toimi.-->
    <!-- Käytetään button rolea saavutettavuuden takaamiseksi.-->
    <div class="collapse-button d-flex"
         @click="toggle()"
         @keyup.enter="toggle()"
         role="button"
         tabindex="0"
         :aria-expanded="toggled">
      <slot name="icon" :toggled="toggled" v-if="chevronLocation === 'left'">
        <div class="align-self-start mr-2">
          <fas icon="chevron-up" v-if="toggled"></fas>
          <fas icon="chevron-down" v-else></fas>
        </div>
      </slot>
      <div class="align-self-start">
        <div class="header">
          <slot name="header"></slot>
        </div>
      </div>
      <slot name="icon" :toggled="toggled" v-if="chevronLocation === 'right'">
        <div class="ml-auto align-self-start">
          <fas icon="chevron-up" v-if="toggled"></fas>
          <fas icon="chevron-down" v-else></fas>
        </div>
      </slot>
    </div>
    <div v-if="toggled">
      <slot></slot>
    </div>
  </div>
  <slot v-else></slot>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { setItem, getItem } from '../../utils/localstorage';

@Component
export default class EpCollapse extends Vue {
  @Prop({ default: true })
  private expandedByDefault!: boolean;

  @Prop({ default: false })
  private disableHeader!: boolean;

  @Prop({ default: '' })
  private tyyppi!: string;

  @Prop({ default: false })
  private borderTop!: boolean;

  @Prop({ default: true })
  private borderBottom!: boolean;

  @Prop({ default: 'right' })
  private chevronLocation!: 'right' | 'left';

  private toggled = false;

  get classess() {
    let result = 'ep-collapse';
    if (this.borderTop) {
      result += ' topborder';
    }
    if (this.borderBottom) {
      result += ' bottomborder';
    }
    return result;
  }

  isToggled() {
    try {
      if (this.tyyppi) {
        const item = getItem('toggle-' + this.tyyppi);
        if (_.isObject(item)) {
          return (item as any).toggled;
        }
      }
      return true;
    }
    catch (err) {
      return true;
    }
  }

  mounted() {
    this.toggled = this.tyyppi
      ? this.isToggled()
      : this.expandedByDefault;
  }

  toggle(toggle: boolean | null = null) {
    if (!toggle) {
      this.toggled = !this.toggled;
    }
    else {
      this.toggled = toggle;
    }
    if (this.tyyppi) {
      setItem('toggle-' + this.tyyppi, {
        toggled: this.toggled,
      });
    }
  }
}

</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.topborder {
  border-top: 1px;
  border-top-style: solid;
  border-top-color: #eeeeee;
}

.bottomborder {
  border-bottom: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
}

.ep-collapse {
  margin-top: 5px;
  padding-top: 20px;
  padding-bottom: 20px;

  .collapse-button {
    cursor: pointer;
    outline: none;
  }

  .header {
    user-select: none;
    margin-bottom: 10px;
    margin-top: 5px;
  }
}

</style>
