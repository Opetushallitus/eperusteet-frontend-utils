<template>
  <div>
    <hr v-if="first && !borderTop" />
    <div :class="classess" v-if="!disableHeader" :style="styles.collapse" @click="togglefull ? toggle(): null" @keyup.enter="togglefull ? toggle(): null">
      <!-- Button tagia ei voida käyttää, sillä ml-auto ei toimi.-->
      <!-- Käytetään button rolea saavutettavuuden takaamiseksi.-->
      <div v-if="$slots.header"
           class="collapse-button d-flex align-items-center mb-2"
           @click="!togglefull ? toggle(): null"
           @keyup.enter="!togglefull ? toggle(): null"
           role="button"
           tabindex="0"
           :aria-expanded="toggled">
        <slot name="icon" :toggled="toggled" v-if="chevronLocation === 'left' && collapsable">
          <div class="align-self-start mr-2">
            <fas fixed-width icon="chevron-up" v-if="toggled"></fas>
            <fas fixed-width icon="chevron-down" v-else></fas>
          </div>
        </slot>
        <div class="align-self-start header">
          <div :class="{'header-toggled': toggled}" :style="styles.header">
            <slot name="header" :toggled="toggled"></slot>
          </div>
        </div>
        <slot name="icon" :toggled="toggled" v-if="chevronLocation === 'right'  && collapsable">
          <div class="ml-auto ">
            <fas fixed-width icon="chevron-up" v-if="toggled"></fas>
            <fas fixed-width icon="chevron-down" v-else></fas>
          </div>
        </slot>
      </div>
      <div v-if="toggled">
        <slot></slot>
      </div>
    </div>
    <slot v-else></slot>
    <hr v-if="borderBottom" />
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

  @Prop({ default: true })
  private usePadding!: boolean;

  @Prop({ default: '' })
  private tyyppi!: string;

  @Prop({ default: false })
  private borderTop!: boolean;

  @Prop({ default: true })
  private borderBottom!: boolean;

  @Prop({ default: 'right' })
  private chevronLocation!: 'right' | 'left';

  @Prop({ default: true })
  private collapsable!: boolean;

  @Prop({ default: false })
  private first!: boolean;

  private toggled = false;

  get styles() {
    if (this.usePadding) {
      return {
        header: {
          'margin-bottom': '10px',
          'margin-top': '10px',
        },
        collapse: {
          'padding-top': '20px',
          'padding-bottom': '20px',
        },
      };
    }
    return {
      header: {},
      collapse: {},
    };
  }

  @Prop({ required: false, default: false })
  private shadow!: boolean;

  @Prop({ required: false, default: false })
  private togglefull!: boolean;

  get classess() {
    let result = 'ep-collapse';
    if (this.borderTop) {
      result += ' topborder';
    }

    if (this.shadow) {
      result += ' shadow-tile';
    }

    if (this.togglefull) {
      result += ' togglefull';
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
    if (this.collapsable) {
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
}

</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';
@import '../../styles/_mixins.scss';

@include shadow-tile;

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

  .collapse-button {
    cursor: pointer;
    outline: none;

    label {
      cursor: pointer;
    }
  }

  .header-toggled {
    user-select: none;
  }

  &.togglefull {
    cursor: pointer;
  }
}

.shadow-tile {
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 0.7rem;
}

</style>
