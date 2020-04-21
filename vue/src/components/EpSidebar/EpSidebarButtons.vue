<template>
<div class="sidebar-buttons btn-group-sm" :class="groupClasses">
  <b-button variant="link"
            aria-pressed="true"
            :aria-label="inline ? $t('sulje-navigaatio') : $t('avaa-navigaatio')"
            v-b-tooltip.hover
            :title="inline ? $t('sulje-navigaatio') : $t('avaa-navigaatio')"
            @click="toggle()">
    <fas fixed-width icon="bars"></fas>
  </b-button>
  <!--
  <b-button variant="link"
            :aria-label="$t('lisaa-suosikkeihin')"
            v-b-tooltip.hover
            :title="$t('lisaa-suosikkeihin')">
    <fas fixed-width icon="star"></fas>
  </b-button>
  -->
  <b-button variant="link"
            v-if="showSocial"
            :aria-label="$t('jaa-sosiaalisessa-mediassa')"
            v-b-tooltip.hover
            :title="$t('jaa-sosiaalisessa-mediassa')"
            :id="shareButtonId">
    <fas fixed-width icon="share-alt"></fas>
  </b-button>
  <b-popover v-if="showSocial"
             :target="shareButtonId"
             triggers="click blur">
            
    <template v-slot:title>{{ $t('jaa-sosiaalisessa-mediassa') }}</template>
    <social-sharing :url="url"
                    :quote="quote"
                    :hashtags="hashtags"
                    network-tag="li"
                    inline-template>
      <ul class="social-sharing">
        <network network="facebook">
          <fas fixed-width :icon="['fab', 'facebook-f']"></fas> Facebook
        </network>
        <network network="twitter">
          <fas fixed-width :icon="['fab', 'twitter']"></fas> Twitter
        </network>
        <network network="linkedin">
          <fas fixed-width :icon="['fab', 'linkedin']"></fas> LinkedIn
        </network>
        <network network="reddit">
          <fas fixed-width :icon="['fab', 'reddit']"></fas> Reddit
        </network>
        <network network="whatsapp">
          <fas fixed-width :icon="['fab', 'whatsapp']"></fas> Whatsapp
        </network>
        <network network="telegram">
          <fas fixed-width :icon="['fab', 'telegram']"></fas> Telegram
        </network>
      </ul>
    </social-sharing>
  </b-popover>
  <!--
  <b-button variant="link"
            :aria-label="$t('avaa-asetukset')"
            v-b-tooltip.hover
            :title="$t('avaa-asetukset')"
            :id="settingsButtonId">
    <fas fixed-width icon="cog"></fas>
  </b-button>
  <b-popover :target="settingsButtonId" triggers="click blur">
    <template v-slot:title>{{ $t('lisaasetukset') }}</template>
    <ep-toggle v-model="innerValue.autoScroll">{{ $t('automaattinen-nayton-vieritys')}}</ep-toggle>
    <ep-toggle v-model="innerValue.showSubchapter" :is-editing="false">{{ $t('avaa-paalukujen-aliluvut-automaattisesti')}}</ep-toggle>
  </b-popover>
  <b-button variant="link"
            :aria-label="$t('avaa-ohjeet')"
            v-b-tooltip.hover
            :title="$t('avaa-ohjeet')">
    <fas fixed-width icon="question"></fas>
  </b-button>
  -->
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpToggle from '../forms/EpToggle.vue';


@Component({
  components: {
    EpToggle,
  },
})
export default class EpSidebarButtons extends Vue {
  @Prop({ required: true, type: Boolean })
  private mobile!: boolean;

  @Prop({ required: true, type: Boolean })
  private inline!: boolean;

  @Prop({ required: true })
  private value!: boolean;

  @Prop({ required: true })
  private showSocial!: boolean;

  get groupClasses() {
    return {
      'btn-group': this.inline || this.mobile,
      'btn-group-vertical': !this.inline && !this.mobile,
      'd-inline-flex d-md-none': this.mobile,
      'd-none d-md-inline-flex': !this.mobile,
    };
  }
  
  get settingsButtonId() {
    return this.mobile ? 'popover-settings-button-mobile' : 'popover-settings-button-desktop';
  }
  
  get shareButtonId() {
    return this.mobile ? 'popover-share-button-mobile' : 'popover-share-button-desktop';
  }
  
  get url() {
    return window.location.href;
  }
  
  get quote() {
    return document.title;
  }
  
  get hashtags() {
    return this.$t('avainsanalista');
  }
  
  get innerValue() {
    return this.value;
  }
  set innerValue(value) {
    this.$emit('input', value);
  }
  private toggle() {
    return this.$emit('toggle', !this.inline);
  }
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";
ul.social-sharing {
  list-style-type: none;
  margin: 0;
  padding: 0;
  & /deep/ li {
    cursor: pointer;
    color: #007bff;
    &:hover {
      color: #0056b3;
    }
  }
}
</style>
