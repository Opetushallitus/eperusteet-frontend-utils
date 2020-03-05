<template>
<div>
  <div class="ep-collapse" v-if="!disableHeader">
    <!-- Button tagia ei voida käyttää, sillä ml-auto ei toimi.-->
    <!-- Käytetään button rolea saavutettavuuden takaamiseksi.-->
    <div class="collapse-button d-flex"
         @click="toggle()"
         @keyup.enter="toggle()"
         role="button"
         tabindex="0"
         :aria-expanded="toggled">
      <div class="align-self-start">
        <div class="header">
          <slot name="header"></slot>
        </div>
      </div>
      <slot name="icon" :toggled="toggled">
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

  private toggled = false;

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

  toggle() {
    this.toggled = !this.toggled;
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

.ep-collapse {
  border-bottom: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
  margin-bottom: 5px;

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
