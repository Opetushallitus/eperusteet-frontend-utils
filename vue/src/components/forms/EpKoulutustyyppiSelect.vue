<template>
  <EpMultiSelect
    v-if="isEditing"
    ref="koulutustyyppi_multiselect"
    v-model="model"
    :placeholder="placeholder"
    :search-identity="identity"
    label="nimi"
    track-by="koulutustyyppi"
    :options="selectVaihtoehdot"
    group-values="koulutustyypit"
    group-label="ryhma"
    :group-select="false"
    :searchable="false"
    :max-height="500"
    :multiple="isMultiple"
    :close-on-select="!isMultiple"
    :open-direction="'below'"
  >
    <template
      #singleLabel="{option}"
    >
      <span :class="{'text-nowrap': !textWrap}">
        <slot
          v-if="!nocolor"
          name="colorindicator"
          :koulutustyyppi="option.koulutustyyppi"
        >
          <EpColorIndicator
            v-if="!nocolor"
            :size="10"
            :kind="option.koulutustyyppi"
          />
        </slot>
        <span class="ml-2">{{ $t(option.koulutustyyppi) }}</span>
      </span>
    </template>
    <template #option="{ option }">
      <hr
        v-if="option.$groupLabel"
        class="mt-0 mb-0"
      >
      <span
        v-else
        class="option text-nowrap"
      >
        <slot
          v-if="option.koulutustyyppi !== 'kaikki' && !nocolor"
          name="colorindicator"
          :koulutustyyppi="option.koulutustyyppi"
        >
          <EpColorIndicator
            v-if="option.koulutustyyppi !== 'kaikki' && !nocolor"
            :size="10"
            :kind="option.koulutustyyppi"
          />
        </slot>
        <span :class="{'font-weight-bold': option.koulutustyyppi === 'kaikki', 'ml-2': option.koulutustyyppi !== 'kaikki'}">
          {{ $t(option.koulutustyyppi) }}
        </span>
      </span>
    </template>
    <template #checkbox>
      <span />
    </template>
    <template #selection="{ values }">
      <div class="d-flex align-items-center">
        <template v-if="values.length === 1">
          <span
            v-for="value in values"
            :key="'value' + value.koulutustyyppi"
            class="multiselect__tag"
          >
            <slot
              v-if="!nocolor"
              name="colorindicator"
              :koulutustyyppi="value.koulutustyyppi"
            >
              <EpColorIndicator
                v-if="!nocolor"
                :size="10"
                :kind="value.koulutustyyppi"
              />
            </slot>
            <span class="nimi ml-2">{{ $t(value.koulutustyyppi) }}</span>
            <span
              class="multiselect__tag-icon clickable"
              @click.prevent
              @mousedown.prevent.stop="remove(value)"
            />
          </span>
        </template>

        <span v-if="values.length > 1">
          {{ $t('valittu-x-koulutustyyppia', { kpl: values.length }) }}
        </span>
      </div>
    </template>
  </EpMultiSelect>
  <div v-else-if="asArray.length > 0">
    <span
      v-for="value in asArray"
      :key="'reading' + value"
      class="text-nowrap mr-3"
      :class="{'text-nowrap': !textWrap}"
    >
      <slot
        v-if="!nocolor"
        name="colorindicator"
        :koulutustyyppi="value"
      >
        <EpColorIndicator
          v-if="!nocolor"
          :size="10"
          :kind="value"
        />
      </slot>
      <span class="ml-2">{{ $t(value) }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, useTemplateRef } from 'vue';
import * as _ from 'lodash';
import EpSelect from '@shared/components/forms/EpSelect.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import { EperusteetKoulutustyypit, EperusteetKoulutustyyppiRyhmat } from '../../utils/perusteet';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { $kaanna, $t } from '@shared/utils/globals';

const props = defineProps({
  modelValue: {
    required: true,
  },
  isEditing: {
    default: false,
    type: Boolean,
  },
  required: {
    type: Boolean,
  },
  nocolor: {
    default: false,
    type: Boolean,
  },
  koulutustyypit: {
    default: () => EperusteetKoulutustyypit,
    type: Array,
  },
  koulutustyyppiryhmat: {
    default: () => EperusteetKoulutustyyppiRyhmat,
    type: Object,
  },
  eiTuetutKoulutustyypit: {
    default: () => [],
    type: Array,
  },
  textWrap: {
    default: false,
    type: Boolean,
  },
});

const emit = defineEmits(['update:modelValue']);

// Template refs
const koulutustyyppi_multiselect = useTemplateRef('koulutustyyppi_multiselect');

function identity(tr: any) {
  return _.toLower($kaanna(tr.nimi));
}

const isMultiple = computed(() => {
  return _.isArray(props.modelValue);
});

const vaihtoehdot = computed(() => {
  return _.chain(props.koulutustyyppiryhmat)
    .keys()
    .map(ryhma => {
      return {
        ryhma,
        koulutustyypit: _.chain(props.koulutustyyppiryhmat[ryhma])
          .filter(koulutustyyppi => _.isEmpty(props.koulutustyypit) || _.includes(props.koulutustyypit, koulutustyyppi))
          .reject(koulutustyyppi => _.includes(props.eiTuetutKoulutustyypit, koulutustyyppi))
          .map(koulutustyyppi => ({ koulutustyyppi, nimi: $t(koulutustyyppi) }))
          .value(),
      };
    })
    .value();
});

const kaikkiVaihtoehdot = computed(() => {
  return [
    {
      ryhma: 'kaikki',
      koulutustyypit: [{ koulutustyyppi: 'kaikki' }],
    },
    ...vaihtoehdot.value,
  ];
});

const selectVaihtoehdot = computed(() => {
  if (props.required) {
    return vaihtoehdot.value;
  }
  else {
    return kaikkiVaihtoehdot.value;
  }
});

const toArrayValue = computed(() => {
  return _.chain(vaihtoehdot.value)
    .map(vaihtoehto => vaihtoehto.koulutustyypit)
    .flatMap()
    .filter(kt => _.includes(props.modelValue, kt.koulutustyyppi))
    .value();
});

const toValue = computed(() => {
  return _.chain(vaihtoehdot.value)
    .map(vaihtoehto => vaihtoehto.koulutustyypit)
    .flatMap()
    .find(kt => kt.koulutustyyppi === props.modelValue)
    .value();
});

const model = computed({
  get: () => isMultiple.value ? toArrayValue.value : toValue.value,
  set: (value: any) => {
    if (_.get(value, 'koulutustyyppi') === 'kaikki') {
      emit('update:modelValue', isMultiple.value ? [] : undefined);
    }
    else {
      if (!isMultiple.value) {
        emit('update:modelValue', _.get(value, 'koulutustyyppi'));
      }
      else {
        emit('update:modelValue', _.map(value, 'koulutustyyppi'));
      }
    }
  },
});

const asArray = computed(() => {
  if (isMultiple.value) {
    return props.modelValue;
  }

  return props.modelValue ? [props.modelValue] : [];
});

const placeholder = computed(() => {
  if (props.required) {
    return $t('valitse');
  }
  else {
    return $t('kaikki');
  }
});

function remove(option: any) {
  const poistettava = _.get(option, 'koulutustyyppi');
  emit('update:modelValue', _.without(props.modelValue, poistettava));
}

function removeAll() {
  emit('update:modelValue', []);
}

function sulje() {
  koulutustyyppi_multiselect.value?.sulje();
}
</script>

<style lang="scss" scoped>
@import '@shared/styles/_variables.scss';

.tieto {
  padding: 20px;

  .nimi {
    font-weight: 600;
  }
}

:deep(.multiselect__option) {
 padding: 0px;
 min-height: 0px;
}

:deep(.multiselect__option--disabled .option), :deep(.multiselect__option .option){
 padding: 12px;
 min-height: 40px;
 display: block;
}

.sulje {
  position: sticky;
  bottom: 0px;
  background: $white;
}

:deep(.multiselect__tags) {
  .multiselect__tag {
    .nimi {
      margin-right: 5px;
    }
  }
}
</style>
