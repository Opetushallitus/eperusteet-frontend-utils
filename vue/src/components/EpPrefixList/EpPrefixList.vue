<template>
  <div v-if="isEditable">
    <div
      v-for="(alue, alueIdx) in internal"
      :key="alueIdx"
      class="alue"
    >
      <div class="alue-editing">
        <div class="header">
          <div class="row">
            <div class="col-sm-6">
              <ep-input
                v-model="alue.nimi"
                :help="arvot + '-nimi'"
                :placeholder="$t(arvot + '-nimi')"
                :is-editing="true"
              />
            </div>
            <div class="col-sm-6">
              <div class="actions">
                <ep-button
                  variant="danger"
                  icon="close"
                  @click="poistaIndeksi(internal, alueIdx)"
                >
                  {{ $t('poista-alue-' + arvot) }}
                </ep-button>
              </div>
            </div>
          </div>
        </div>
        <div class="kohde">
          <ep-input
            v-model="alue[kohde]"
            :help="kohde"
            :is-editing="true"
          />
        </div>
        <div class="arvot">
          <VueDraggable
            v-bind="options"
            class="arvot-group"
            :model-value="alue[arvot]"
          >
            <div
              v-for="(item, idx) in alue[arvot]"
              :key="idx"
              class="arvo arvot-group-item"
            >
              <div class="text">
                <ep-input
                  v-model="item[arvo]"
                  :is-editing="true"
                />
              </div>
              <div class="actions">
                <ep-button
                  variant="danger"
                  icon="close"
                  @click="poistaIndeksi(alue[arvot], idx)"
                >
                  {{ $t('poista') }}
                </ep-button>
              </div>
            </div>
          </VueDraggable>
          <ep-button
            icon="add"
            @click="lisaaArvo(alue)"
          >
            {{ $t('lisaa-arvo-' + arvo) }}
          </ep-button>
        </div>
      </div>
    </div>
    <ep-button
      v-if="hasMultiple"
      icon="add"
      @click="lisaaAlue()"
    >
      {{ $t('lisaa-alue-' + arvot) }}
    </ep-button>
  </div>
  <div v-else>
    <div
      v-for="(alue, alueIdx) in internal"
      :key="alueIdx"
      class="alue"
    >
      <div class="header">
        <ep-input
          v-model="alue.nimi"
          :is-editing="isEditable"
        />
      </div>
      <div class="kohde">
        <ep-input
          v-model="alue[kohde]"
          :is-editing="isEditable"
        />
      </div>
      <ul class="arvot">
        <li
          v-for="(item, idx) in alue[arvot]"
          :key="idx"
          class="arvo"
        >
          <ep-input
            :modelValue="arvo ? item[arvo] : item"
            :is-editing="false"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import _ from 'lodash';
import { VueDraggable } from 'vue-draggable-plus';

import { Kielet } from '@shared/stores/kieli';
import { $t } from '@shared/utils/globals';

import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpInput from '@shared/components/forms/EpInput.vue';

const props = defineProps({
  isEditable: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: null,
    required: true,
  },
  kohde: {
    type: String,
    default: 'kohde',
  },
  arvot: {
    type: String,
    default: 'arvot',
  },
  arvo: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const hasMultiple = computed(() => {
  return _.isArray(sanitized.value);
});

const sanitized = computed(() => {
  if (_.isArray(props.modelValue)) {
    return props.modelValue;
  }
  else {
    return [props.modelValue];
  }
});

const kieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const internal = computed({
  get: () => {
    return _.map(sanitized.value, el => {
      const res = _.cloneDeep(el);

      // Piilotetaan kohteet, joita ei ole lokalisoitu jos kyseessä lokalisoitu teksti
      const kohde = res[props.kohde];
      if (kohde) {
        if (_.isObject(kohde) && !kohde[kieli.value]) {
          res[props.kohde] = undefined;
        }
      }

      // Piilotetaan arvot, joita ei ole lokalisoitu jos kyseessä lokalisoitu teksti
      const arvot = res[props.arvot];
      if (arvot && !_.isEmpty(arvot)) {
        const arvotFiltered: any[] = [];
        _.each(arvot, arvo => {
          if (_.isObject(arvo)) {
            if (arvo[kieli.value]) {
              arvotFiltered.push(arvo);
            }
          }
          else {
            arvotFiltered.push(arvo);
          }
        });
        res[props.arvot] = arvotFiltered;
      }

      return res;
    });
  },
  set: (value: any) => {
    emit('update:modelValue', value);
  }
});

const options = computed(() => {
  return {
    // handle: '.handle',
    animation: 300,
    disabled: false,
  };
});

const poistaIndeksi = (arr: any[], alueIdx: number) => {
  arr.splice(alueIdx, 1);
};

const lisaaAlue = () => {
  internal.value.push({
    nimi: {},
    [props.kohde]: {},
    [props.arvot]: [],
  });
};

const lisaaArvo = (alue: any) => {
  alue[props.arvot].push(props.arvot
    ? { [props.arvo]: {} }
    : {});
};
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
