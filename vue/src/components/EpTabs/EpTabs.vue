<template>
  <Tabs
    :value="activeTabValue"
    @update:value="handleTabChange"
  >
    <TabList>
      <Tab
        v-for="(tab, index) in tabs"
        :key="index"
        :value="String(index)"
      >
        {{ tab.title }}
      </Tab>
    </TabList>
    <TabPanels>
      <TabPanel
        v-for="(tab, index) in tabs"
        :key="index"
        :value="String(index)"
      >
        <div class="tab-content-wrapper">
          <component
            :is="renderTabContent(tab.vnode)"
          />
        </div>
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<script setup lang="ts">
import { ref, computed, provide, VNode, useSlots, watch } from 'vue';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>();

const slots = useSlots();
const activeTab = ref(props.modelValue);

const activeTabValue = computed(() => String(activeTab.value));

// Extract tab information from slot children
const tabs = computed(() => {
  const defaultSlot = slots.default?.();
  if (!defaultSlot) return [];

  // Flatten fragments - Vue wraps multiple slot children in fragments
  const allVNodes: VNode[] = [];
  defaultSlot.forEach((vnode: VNode) => {
    // Check if it's a Fragment (Symbol type)
    if (typeof vnode.type === 'symbol' && vnode.children && Array.isArray(vnode.children)) {
      // It's a fragment, add its children
      allVNodes.push(...(vnode.children as VNode[]));
    } else {
      // Regular vnode
      allVNodes.push(vnode);
    }
  });

  return allVNodes
    .filter((vnode: VNode) => {
      // Filter out non-EpTab components and empty nodes
      if (!vnode.type) return false;
      
      // Check if it's an EpTab component
      const typeName = (vnode.type as any).__name || (vnode.type as any).name;
      
      return typeName === 'EpTab';
    })
    .map((vnode: VNode) => {
      const vNodeProps = vnode.props || {};
      return {
        title: vNodeProps.title || '',
        vnode,
      };
    });
});

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

// Render the tab content from vnode children
const renderTabContent = (vnode: VNode) => {
  return () => {
    // If children is a default slot function, call it
    if (vnode.children && typeof vnode.children === 'object' && 'default' in vnode.children) {
      return (vnode.children as any).default();
    }
    // If children is an array, render it directly
    if (Array.isArray(vnode.children)) {
      return vnode.children;
    }
    // Otherwise render the vnode itself
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
