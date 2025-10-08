<template>
  <div v-if="isEditable">
    <div
      v-for="(value, idx) in internal"
      :key="idx"
      class="arvo"
    >
      <ep-input
        v-model="internal[idx][kentta]"
        :is-editing="true"
        class="mb-2"
      >
        <template #left>
          <div style="padding: 8px">
            <i>&#8226;</i>
          </div>
        </template>
        <template #right>
          <b-button
            variant="link"
            @click="poista(idx)"
          >
            <EpMaterialIcon>close</EpMaterialIcon>
          </b-button>
        </template>
      </ep-input>
    </div>
    <div style="margin-top: 20px;">
      <ep-button
        variant="outline-primary"
        icon="add"
        @click="lisaaRivi()"
      >
        {{ $t(lisays) }}
      </ep-button>
    </div>
  </div>
  <div v-else>
    <ul class="arvot">
      <li
        v-for="(value, idx) in internal"
        :key="idx"
        class="arvo"
      >
        <ep-input
          :value="internal[idx][kentta]"
          :is-editing="false"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import _ from 'lodash';
import EpButton from '../EpButton/EpButton.vue';
import EpInput from './EpInput.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const props = defineProps({
  isEditable: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    required: true,
  },
  lisays: {
    default: 'lisaa-sisalto',
    type: String,
  },
  kentta: {
    required: true,
    type: String,
  },
});

const emit = defineEmits(['update:modelValue']);

const sanitized = computed(() => {
  if (_.isArray(props.modelValue)) {
    return props.modelValue;
  }
  else {
    return [props.modelValue];
  }
});

const internal = computed({
  get: () => sanitized.value,
  set: (value: any) => {
    emit('update:modelValue', value);
  },
});

const options = computed(() => {
  return {
    // handle: '.handle',
    animation: 300,
    disabled: false,
  };
});

function lisaaRivi() {
  internal.value.push({ });
}

function poista(idx: number) {
  internal.value = [
    ...internal.value.slice(0, idx),
    ...internal.value.slice(idx + 1),
  ];
}
</script>

<style lang="scss" scoped>
@import '../../styles/_variables.scss';

.alue-editing {
  background: $color-light-background;
  padding: 20px;
}

.alue {
  margin-bottom: 40px;

  .header {
    font-weight: 600 !important;

    .actions {
      float: right;
    }
  }

  .kohde {
    font-style: italic;
  }

  ul.arvot {
    li.arvo {
      margin: 0;
    }
  }

  div.arvot {
    margin: 20px 0 0 40px;

    div.arvo {
      margin-bottom: 5px;
      display: flex;

      .text {
        width: calc(100% - 120px);
      }

      .actions {
        width: 119px;

        button {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }
  }
}
</style>
