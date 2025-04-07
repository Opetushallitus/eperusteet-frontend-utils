<template>
  <notifications
    width="30%"
    position="top right"
    :max="5"
    :ignore-duplicates="true"
    :close-on-click="false"
  >
    <template
      slot="body"
      slot-scope="{ item, close }"
    >
      <div
        class="notification"
        :class="item.type"
      >
        <button
          class="notification-close-button ml-2"
          @click="close"
        >
          <EpMaterialIcon>close</EpMaterialIcon>
        </button>
        <p
          v-if="item.type === 'error'"
          class="notification-title"
        >
          <EpMaterialIcon icon-shape="outlined">
            info
          </EpMaterialIcon> {{ $t('virhe-nakyma-otsikko') }}
        </p>
        <p
          v-if="item.type === 'warn'"
          class="notification-title"
        >
          <EpMaterialIcon icon-shape="outlined">
            info
          </EpMaterialIcon> {{ $t('huom') }}
        </p>
        <p>
          <EpMaterialIcon v-if="item.type === 'success'">
            check
          </EpMaterialIcon>
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
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpRoundButton,
    EpMaterialIcon,
  },
})
export default class EpNotification extends Vue {
}
</script>

<style scoped lang="scss">

.notification {
  // styling
  margin: 0 10px 10px;
  padding: 15px;
  font-size: 12px;
  color: #ffffff;
  box-shadow: 0 3px 5px 0 #242424;

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
    font-size: large;
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
