<template>
  <div>
    <hr v-if="first && !borderTop">
    <div
      v-if="!disableHeader"
      :class="classess"
      :style="styles.collapse"
      @click="togglefull ? toggle(): null"
      @keyup.enter="togglefull ? toggle(): null"
    >
      <!-- Button tagia ei voida käyttää, sillä ml-auto ei toimi.-->
      <!-- Käytetään button rolea saavutettavuuden takaamiseksi.-->
      <div
        v-if="hasHeaderSlot"
        class="collapse-button d-flex align-items-center py-2 pr-1"
        role="button"
        tabindex="0"
        :aria-expanded="toggled"
        :style="styles.header"
        @click="!togglefull ? toggle(): null"
        @keyup.enter="!togglefull ? toggle(): null"
      >
        <slot
          v-if="chevronLocation === 'left' && collapsable"
          name="icon"
          :toggled="toggled"
        >
          <div class="align-self-start mr-2">
            <EpMaterialIcon
              v-if="toggled"
              size="28px"
            >
              expand_less
            </EpMaterialIcon>
            <EpMaterialIcon
              v-else
              size="28px"
            >
              expand_more
            </EpMaterialIcon>
          </div>
        </slot>
        <div class="align-self-start header">
          <div :class="{'header-toggled': toggled}">
            <slot
              name="header"
              :toggled="toggled"
            />
          </div>
        </div>
        <slot
          v-if="chevronLocation === 'right' && collapsable"
          name="icon"
          :toggled="toggled"
        >
          <div class="ml-auto">
            <EpMaterialIcon
              v-if="toggled"
              size="28px"
            >
              expand_less
            </EpMaterialIcon>
            <EpMaterialIcon
              v-else
              size="28px"
            >
              expand_more
            </EpMaterialIcon>
          </div>
        </slot>
      </div>
      <div
        v-if="toggled"
        class="collapse-content"
      >
        <slot />
      </div>
    </div>
    <slot v-else />
    <hr v-if="borderBottom">
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed, onMounted, useSlots } from 'vue';
import { setItem, getItem } from '../../utils/localstorage';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { hasSlotContent } from '@shared/utils/vue-utils';

const props = defineProps({
  expandedByDefault: {
    type: Boolean,
    default: true,
  },
  disableHeader: {
    type: Boolean,
    default: false,
  },
  usePadding: {
    type: Boolean,
    default: true,
  },
  tyyppi: {
    type: String,
    default: '',
  },
  borderTop: {
    type: Boolean,
    default: false,
  },
  borderBottom: {
    type: Boolean,
    default: true,
  },
  chevronLocation: {
    type: String,
    default: 'right',
    validator: (value: string) => ['right', 'left'].includes(value),
  },
  collapsable: {
    type: Boolean,
    default: true,
  },
  first: {
    type: Boolean,
    default: false,
  },
  blue: {
    type: Boolean,
    default: false,
  },
  shadow: {
    type: Boolean,
    default: false,
  },
  togglefull: {
    type: Boolean,
    default: false,
  },
});

const slots = useSlots();
const toggled = ref(false);
const emit = defineEmits(['toggle']);

const hasHeaderSlot = computed(() => {
  return hasSlotContent(slots.header);
});

const styles = computed(() => {
  let style = {
    header: {},
    collapse: {},
  };

  if (props.blue) {
    style = {
      header: {
        'color': '#001A58',
      },
      collapse: {
        'padding': '20px 20px 0px 20px',
        'border-radius': '30px',
        'border': '1px solid #C8F1FF',
        'background': '#E6F6FF',
      },
    };
  }

  if (props.usePadding) {
    style = {
      header: {
        ...style.header,
        'margin-bottom': '10px',
        'margin-top': '10px',
      },
      collapse: {
        ...style.collapse,
        'padding-top': '20px',
        'padding-bottom': '20px',
      },
    };
  }

  return style;
});

const classess = computed(() => {
  let result = 'ep-collapse';
  if (props.borderTop) {
    result += ' topborder';
  }

  if (props.shadow) {
    result += ' shadow-tile';
  }

  if (props.togglefull) {
    result += ' togglefull';
  }

  return result;
});

const isToggled = () => {
  try {
    if (props.tyyppi) {
      const item = getItem('toggle-' + props.tyyppi);
      if (_.isObject(item)) {
        return (item as any).toggled;
      }
    }
    return true;
  }
  catch (err) {
    return true;
  }
};

const toggle = (toggle: boolean | null = null) => {
  if (props.collapsable) {
    if (_.isNil(toggle)) {
      toggled.value = !toggled.value;
    }
    else {
      toggled.value = toggle;
    }
    if (props.tyyppi) {
      setItem('toggle-' + props.tyyppi, {
        toggled: toggled.value,
      });
    }
  }

  emit('toggle', toggled.value);
};

onMounted(() => {
  toggled.value = props.tyyppi
    ? isToggled()
    : props.expandedByDefault;
});

defineExpose({
  toggle,
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

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

    label {
      cursor: pointer;
    }

    .header {
      margin-top: 2px;
    }

    @include focus;
  }

  .header-toggled {
    user-select: none;
  }

  &.togglefull {
    cursor: pointer;
  }

  .collapse-content {
    text-align: left;
  }
}

.shadow-tile {
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 0.7rem;
}

:deep(.osaamistasot) {
  .row:nth-of-type(even) {
    background-color: $table-even-row-blue !important;
  }
  .row:nth-of-type(odd) {
    background-color: $table-odd-row-blue !important;
  }
}

:deep(.table-responsive) {
  tr:first-child td {
    background: $table-header-color !important;
  }
}
</style>
