<template>
  <notifications
    width="30%"
    position="top right"
    :max="5"
    :ignoreDuplicates="true"
    :closeOnClick="false">
    <template slot="body" slot-scope="{ item, close }">
      <div class="notification" :class="item.type">
        <button class="notification-close-button ml-2" @click="close">
          <fas icon="sulje"></fas>
        </button>
        <p class="notification-title" v-if="item.type === 'error'">
          <fas icon="huutomerkki-ympyra" fixed-width></fas> {{ $t('virhe-nakyma-otsikko') }}
        </p>
        <p class="notification-title" v-if="item.type === 'warn'">
          <fas icon="huutomerkki-ympyra" fixed-width></fas> {{ $t('huom') }}
        </p>
        <p>
          <fas icon="checkmark" v-if="item.type === 'success'" fixed-width></fas>
          {{ item.title }}
        </p>
        <p class="notification-content">
          {{ item.text }}
        </p>
      </div>
    </template>
  </notifications>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EpRoundButton from '@shared/components/EpButton/EpRoundButton.vue';

@Component({
  components: {
    EpRoundButton,
  },
})
export default class EpNotification extends Vue {
};
</script>

<style scoped lang="scss">

.notification {
  // styling
  margin: 0 10px 10px;
  padding: 15px;
  font-size: 12px;
  color: #ffffff;
  box-shadow: 0 3px 3px 0 #7a7a7a;

  // default (blue)
  background: #44A4FC;

  .notification-title {
    font-size: large;
  }

  .notification-content {
  }

  .notification-close-button {
    border: none;
    color: white;
    background: none;
    float: right;
  }

  // types (green, amber, red)
  &.success {
    background: #388b00;
  }

  &.warn {
    background: #e18e10;
  }

  &.error {
    background: #eb3021;
  }
}
</style>
