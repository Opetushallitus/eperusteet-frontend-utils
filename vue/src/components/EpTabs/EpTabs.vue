<template>
  <Tabs
    :value="activeTabValue"
    @update:value="handleTabChange"
  >
    <TabList>
      <Tab
        v-for="(tab, index) in getTabs()"
        :key="index"
        :value="String(index)"
      >
        {{ tab.title }}
      </Tab>
    </TabList>
    <TabPanels>
      <TabPanel
        v-for="(tab, index) in getTabs()"
        :key="index"
        :value="String(index)"
      >
        <div
          :key="resolvedContentKey"
          class="tab-content-wrapper"
          :class="contentClass"
        >
          <component
            :is="renderTabContent(index)"
          />
        </div>
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<script setup lang="ts">
import { ref, computed, provide, inject, VNode, useSlots, watch } from 'vue';
import { epEditointiContextKey } from '../EpEditointi/epEditointiContext';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

interface TabInfo {
  title: string;
}

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  contentClass: {
    type: String,
    default: '',
  },
  contentKey: {
    type: [String, Number, Boolean],
    default: undefined,
  },
});

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>();

const slots = useSlots();
const activeTab = ref(props.modelValue);
const editointiContext = inject(epEditointiContextKey, null);

const activeTabValue = computed(() => String(activeTab.value));

// EpTabs reads slots manually, so Vue may skip re-renders when only slot scope changes.
// Subscribe to EpEditointi editing state (or an explicit contentKey) to refresh tab panels.
const resolvedContentKey = computed(() => {
  if (props.contentKey !== undefined) {
    return String(props.contentKey);
  }

  return String(editointiContext?.isEditing.value ?? 0);
});

const flattenSlotVNodes = (defaultSlot: VNode[] | undefined): VNode[] => {
  if (!defaultSlot) return [];

  const allVNodes: VNode[] = [];
  defaultSlot.forEach((vnode: VNode) => {
    if (typeof vnode.type === 'symbol' && vnode.children && Array.isArray(vnode.children)) {
      allVNodes.push(...(vnode.children as VNode[]));
    }
    else {
      allVNodes.push(vnode);
    }
  });

  return allVNodes;
};

const isEpTabVNode = (vnode: VNode) => {
  if (!vnode.type) return false;

  const typeName = (vnode.type as any).__name || (vnode.type as any).name;

  return typeName === 'EpTab';
};

// Read slots during render so scoped slot data (e.g. isEditing) stays current.
// Caching slot VNodes in computed leaves stale content when only slot scope changes.
const getTabs = (): TabInfo[] => {
  return flattenSlotVNodes(slots.default?.())
    .filter(isEpTabVNode)
    .map((vnode: VNode) => {
      const vNodeProps = vnode.props || {};
      return {
        title: vNodeProps.title || '',
      };
    });
};

const getEpTabVNodes = (): VNode[] => {
  return flattenSlotVNodes(slots.default?.()).filter(isEpTabVNode);
};

const handleTabChange = (value: string | number) => {
  const index = typeof value === 'string' ? parseInt(value, 10) : value;
  activeTab.value = index;
  emit('update:modelValue', index);
};

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  activeTab.value = newValue;
});

// Provide tab context for child components
provide('tabContext', {
  registerTab: () => {},
});

const renderTabContent = (tabIndex: number) => {
  return () => {
    const vnode = getEpTabVNodes()[tabIndex];
    if (!vnode) return null;

    if (vnode.children && typeof vnode.children === 'object' && 'default' in vnode.children) {
      return (vnode.children as any).default();
    }
    if (Array.isArray(vnode.children)) {
      return vnode.children;
    }
    return vnode;
  };
};
</script>

<style scoped lang="scss">
:deep(.p-tabs-nav) {
  margin-left: 0;
  padding-left: 0;
}

:deep(.p-tab) {
  margin-left: 0 !important;
}

:deep(.p-tabpanels) {
  padding: 1rem 0;
}
</style>
