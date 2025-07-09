<template>
  <VueDraggable
    v-bind="options"
    :key="draggableKey"
    v-model="innerValue"
    tag="div"
    class="tree-container"
    :class="draggableClass"
    :move="move"
  >
    <div
      v-for="(node, idx) in modelValue"
      :key="idx"
    >
      <div
        class="box d-flex align-items-center"
        :class="{ 'new-box': node.$uusi, 'box-draggable': isEditable }"
      >
        <div class="handle">
          <EpMaterialIcon v-if="isEditable && !options.disabled">
            drag_indicator
          </EpMaterialIcon>
        </div>
        <slot name="chapter">
          <div class="chapter">
            {{ prefix }}{{ idx + 1 }}
          </div>
        </slot>
        <div class="name">
          <slot :node="node" />
        </div>
        <div
          v-if="node[childField] && node[childField] != null && node[childField].length > 0"
          class="actions ml-auto"
          role="button"
          tabindex="0"
          :aria-expanded="!node.$closed"
          @click="toggle(idx)"
          @keyup.enter="toggle(idx)"
        >
          <EpMaterialIcon
            v-if="node.$closed"
            size="28px"
          >
            expand_more
          </EpMaterialIcon>
          <EpMaterialIcon
            v-else
            size="28px"
          >
            expand_less
          </EpMaterialIcon>
        </div>
      </div>
      <div
        v-if="!node.$closed && node[childField] && node[childField] != null"
        class="children"
      >
        <ep-jarjesta
          v-model="node[childField]"
          :is-editable="isEditable"
          :prefix="prefix + (idx + 1) + '.'"
          :child-field="childField"
          :sortable="node.sortable"
          :group="node.group ? node.group + idx : (uniqueChildGroups ? group + idx : group)"
          :allow-move="allowMove"
        >
          <template
            v-for="(_, name) in $slots"
            #[name]="slotData"
          >
            <slot
              :name="name"
              v-bind="slotData"
            />
          </template>
        </ep-jarjesta>
      </div>
    </div>
  </VueDraggable>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import _ from 'lodash';

const props = defineProps({
  prefix: {
    type: String,
    default: '',
  },
  isEditable: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Array,
    required: true,
  },
  childField: {
    type: String,
    default: 'lista',
  },
  rootGroup: {
    type: String,
    default: null,
  },
  group: {
    type: String,
    default: null,
  },
  sortable: {
    type: Boolean,
    default: true,
  },
  uniqueChildGroups: {
    type: Boolean,
    default: false,
  },
  useHandle: {
    type: Boolean,
    default: false,
  },
  draggableClass: {
    type: String,
    default: null,
  },
  allowMove: {
    type: Function,
    required: false,
  },
});

const emit = defineEmits(['update:modelValue']);
const $slots = useSlots();

const options = computed(() => {
  return {
    animation: 300,
    disabled: !props.isEditable || !props.sortable,
    forceFallback: true,
    ghostClass: 'placeholder',
    group: props.rootGroup ? props.rootGroup : props.group,
    handle: props.useHandle && '.handle',
  };
});

const toggle = (idx) => {
  const updatedValue = [...props.modelValue];
  updatedValue[idx] = {
    ...updatedValue[idx],
    $closed: !updatedValue[idx].$closed
  };
  emitter(updatedValue);
};

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const move = (event) => {
  if (props.allowMove) {
    return props.allowMove(event);
  }

  return true;
};

const draggableKey = _.uniqueId('draggable-');
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.tree-container {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently */
}

.flip-move {
  transition: transform 0.5s;
}

.placeholder {
  opacity: 0.5;
}

.drag-area-empty {
  min-height: 7px;
}

.children {
  margin-left: 26px;
}

.box {
  min-height: 40px;
  max-width: 512px;
  min-width: 312px;
  border: 1px solid #CCD9F8;
  border-radius: 4px;
  background-color: rgba(230,246,255,0.6);
  padding: 8px 12px;
  margin-bottom: 8px;

  .handle {
    color: #668DEA;
    margin-right: 8px;
    cursor: grab;
  }

  .actions {
    float: right;
  }

  .actions {
    cursor: pointer;
  }

  .chapter {
    color: #668DEA;
    font-size: 16px;
    margin-right: 8px;
    user-select: none;
  }

  &.new-box {
    background-color: rgba(210,226,255,1.0);
    border: 1px solid #ACB9F8;
  }
}

.box-draggable {
  cursor: grab;
}
</style>
