<template>
  <div
    class="moduulibox d-flex justify-content-between p-2"
    :class="{'moduulibox-valittu': valittu, 'selectable': isEditing}"
    role="button"
    tabindex="0"
    :title="moduuliNimi"
    @click="toggle()"
    @keyup.enter="toggle()"
  >
    <div class="name">
      {{ moduuliNimi }} ({{ moduuli.koodi.arvo }})
    </div>
    <div class="d-flex bd-highlight align-items-center">
      <span class="pr-2">{{ moduuli.laajuus }} {{ $t('opintopiste') }}</span>
      <ep-color-indicator :kind="moduuli.pakollinen ? 'pakollinen' : 'valinnainen'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import { Lops2019OpintojaksonModuuliDto, Lops2019ModuuliDto } from '@shared/api/ylops';
import { Kielet } from '@shared/stores/kieli';

const props = defineProps({
  moduuli: {
    type: Object as () => Lops2019ModuuliDto,
    required: true,
  },
  modelValue: {
    type: Array as () => Lops2019OpintojaksonModuuliDto[],
    required: false,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const moduuliNimi = computed(() => {
  if (props.moduuli) {
    return Kielet.kaanna(props.moduuli.nimi);
  }

  return undefined;
});

const koodi = computed(() => {
  try {
    return props.moduuli!.koodi!.uri!;
  }
  catch (err) {
    return null;
  }
});

const koodit = computed(() => {
  return _.keyBy(props.modelValue, 'koodiUri');
});

const valittu = computed(() => {
  return koodi.value && koodit.value[koodi.value];
});

const toggle = () => {
  if (!props.isEditing) {
    return;
  }

  const koodiUri = koodi.value;
  if (koodiUri) {
    if (koodit.value[koodiUri]) {
      emit('update:modelValue', _.reject(props.modelValue, x => x.koodiUri === koodiUri));
    }
    else {
      emit('update:modelValue', [
        ...props.modelValue,
        { koodiUri },
      ]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

.moduulibox {
  background-color: #E6F6FF;
  color: $blue-darken-1;
  user-select: none;
  border-radius: 5px;

  &.selectable {
    cursor: pointer;
  }

  &:hover {
    background-color: #C3EAFF;
  }

  .name {
    font-weight: bold;

    &::-webkit-scrollbar {
      width: 0.5em;
    }
    &::-webkit-scrollbar-track {
      background-color: $blue-lighten-4;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $blue-lighten-3;
      border-radius: 0.5em;
    }
  }

  .bottom {
    .icon {
      color: #3367E3;
    }

    .icon-editing {
      cursor: pointer;
    }
  }
}

.moduulibox-valittu {
  color: white;
  animation: fade 0.1s linear;
  background-color: #3367E3;

   &:hover {
    background-color: #3367E3;
  }

  .name {
    &::-webkit-scrollbar-track {
      background-color: $light-blue;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $dark-blue;
    }
  }
}

</style>
