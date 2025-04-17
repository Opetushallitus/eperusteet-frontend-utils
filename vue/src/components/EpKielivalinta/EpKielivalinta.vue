<template>
  <b-dropdown
    size="sm"
    class="kielivalinta"
    right
  >
    <template #button-content>
      <span>{{ $t("kieli-sisalto") }}:
        <span class="valittukieli">{{ $t(sisaltoKieli) }}</span>
        <EpMaterialIcon>expand_more</EpMaterialIcon>
      </span>
    </template>
    <b-dropdown-item
      v-for="kieli in sovelluksenKielet"
      :key="kieli"
      :disabled="kieli === sisaltoKieli"
      @click="valitseSisaltoKieli(kieli)"
    >
      {{ $t(kieli) }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Kielet, UiKielet } from '@shared/stores/kieli';
import { Kieli } from '@shared/tyypit';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const sisaltoKieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const sovelluksenKielet = computed(() => {
  return UiKielet;
});

function valitseSisaltoKieli(kieli: Kieli) {
  Kielet.setSisaltoKieli(kieli);
}
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

  ::v-deep .dropdown-toggle::after {
    display:none;
  }

  ::v-deep .btn {
    background-color: $white !important;
    color: $black  !important;
    border-color: $white !important;
    box-shadow: 0;
  }

  ::v-deep .btn-secondary,
  ::v-deep .btn-secondary:not(:disabled):not(.disabled):active:focus,
  ::v-deep .btn-secondary:not(:disabled):not(.disabled).active:focus,
  ::v-deep .show > .btn-secondary.dropdown-toggle:focus {
    box-shadow: none;
  }

  .valittukieli {
    padding: 5px 70px 5px 10px;
    border: 1px solid $gray-lighten-3;
    border-radius: 5px;
  }

  .valintanuoli {
    margin-left: -20px;
  }

</style>
