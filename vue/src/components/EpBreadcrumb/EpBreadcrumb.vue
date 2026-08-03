<template>
  <Breadcrumb
    :home="home"
    :model="model"

    class="ep-breadcrumb"
    aria-label="breadcrumb"
  >
    <template #item="{ item, props }">
      <router-link
        v-if="item.route"
        v-slot="{ href, navigate }"
        :to="item.route"
        custom
      >
        <a
          :href="href"
          v-bind="props.action"
          class="ep-breadcrumb-link"
          @click="navigate"
        >
          <EpMaterialIcon
            v-if="item.icon === 'home'"
            size="20px"
          >
            home
          </EpMaterialIcon>
          <span v-else>{{ item.label }}</span>
        </a>
      </router-link>
      <span
        v-else
        v-bind="props.action"
        class="ep-breadcrumb-current"
      >
        {{ item.label }}
      </span>
    </template>
    <template #separator>
      /
    </template>
  </Breadcrumb>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import Breadcrumb from 'primevue/breadcrumb';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

export interface BreadcrumbItem {
  label: string;
  route?: RouteLocationRaw;
  icon?: string;
  url?: string;
  target?: string;
}

const props = defineProps({
  home: {
    type: Object as () => BreadcrumbItem,
    default: () => ({
      icon: 'home',
      route: { name: 'root' },
    }),
  },
  model: {
    type: Array as () => BreadcrumbItem[],
    default: () => [],
  },
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.ep-breadcrumb {
  background: transparent;
  color: $white;

  :deep(.p-breadcrumb-separator) {
    color: $white;
  }

  :deep(.p-breadcrumb-list) {
    flex-wrap: wrap;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  :deep(.p-breadcrumb-item-link),
  :deep(.p-breadcrumb-chevron),
  .ep-breadcrumb-link,
  .ep-breadcrumb-current {
    color: $white;
  }

  :deep(.p-breadcrumb-item-link:hover),
  .ep-breadcrumb-link:hover {
    color: $white;
    opacity: 0.9;
  }
}
</style>
