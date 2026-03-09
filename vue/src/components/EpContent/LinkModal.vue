<template>
  <EpModal
    ref="epModalRef"
    size="md"
    :header="$t('lisaa-muokkaa-linkki')"
    :ok-text="$t('ok')"
    :cancel-text="$t('peruuta')"
    :ok-disabled="isInvalid"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="link-modal-content mx-4">
      <template v-if="navigationFlattened && navigationFlattened.length > 0">
        <div class="mb-4">
          <label class="flex items-center">
            <input
              v-model="linkkiTyyppi"
              type="radio"
              class="mr-2"
              value="sisainen"
              name="linkkiTyyppi"
            >
            {{ $t('sisainen-linkki') }}
          </label>
        </div>

        <div
          v-if="linkkiTyyppi === 'sisainen'"
          class="mb-3"
        >
          <EpMultiSelect
            v-model="internalLink"
            :is-editing="true"
            :search-identity="labelSearchIdentity"
            :options="navigationFlattened"
            :placeholder="$t('valitse-sivu') + '...'"
          >
            <template #singleLabel="{ option }">
              {{ $kaanna(option.label) }}
            </template>
            <template #option="{ option }">
              <span :style="'padding-left: ' + 10*option.depth +'px'"> {{ $kaanna(option.label) }}</span>
            </template>
          </EpMultiSelect>
        </div>

        <div class="mb-4 mt-3">
          <label class="flex items-center">
            <input
              v-model="linkkiTyyppi"
              type="radio"
              class="mr-2"
              value="ulkoinen"
              name="linkkiTyyppi"
            >
            {{ $t('ulkoinen-linkki') }}
          </label>
        </div>

        <div
          v-if="linkkiTyyppi === 'ulkoinen'"
          class="mb-3"
        >
          <input
            v-model="linkValue"
            type="text"
            class="link-input w-full px-3 py-2 border rounded"
            :class="{ 'link-input--invalid': linkInvalid }"
            :placeholder="linkPlaceholder"
          >
          <div
            v-if="linkInvalid"
            class="link-input-error block text-sm mt-1"
          >
            {{ $t('url-osoite-virheellinen') }}
          </div>
        </div>
      </template>

      <div
        v-else
        class="mb-3"
      >
        <label class="block mb-2 font-medium">{{ $t('linkki-osoite') }}</label>
        <input
          v-model="linkValue"
          type="text"
          class="link-input w-full px-3 py-2 border rounded"
          :placeholder="linkPlaceholder"
        >
      </div>
    </div>
  </EpModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, unref, type PropType } from 'vue';
import _ from 'lodash';
import { NavigationNodeDto } from '@shared/tyypit';
import { deepFind } from '@shared/utils/helpers';
import EpModal from '@shared/components/EpModal/EpModal.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import { $kaanna, $t } from '@shared/utils/globals';

const props = defineProps({
  initialHref: {
    type: String,
    default: '',
  },
  initialRoutenode: {
    type: String,
    default: '',
  },
  onOk: {
    type: Function as PropType<(linkData: any) => void>,
    default: null,
  },
  onCancel: {
    type: Function as PropType<() => void>,
    default: null,
  },
});

const emit = defineEmits(['ok', 'cancel']);

// Get navigation from injection
const navigation = inject('navigation') as NavigationNodeDto | null;

// Helper function to flatten navigation
function flattenedNavi(navi: NavigationNodeDto, depth = -1): any[] {
  return [
    {
      ...navi,
      depth,
    },
    ..._.flatten(_.map(navi.children, child => flattenedNavi(child, depth + 1))),
  ];
}

// Helper function to get flattened navigation
function getNavigationFlattened(navigation: NavigationNodeDto | null): any[] {
  if (navigation) {
    return _.chain(flattenedNavi(unref(navigation)))
      .filter(node => !!node.label)
      .map(node => {
        return {
          ...node,
          $isDisabled: !_.has(node, 'id'),
        };
      })
      .value();
  }
  return [];
}

// State variables
const linkValue = ref<string>('');
const internalLink = ref<NavigationNodeDto | null>(null);
const linkkiTyyppi = ref<'ulkoinen' | 'sisainen'>('ulkoinen');
const linkPlaceholder = ref('https://...');

// Computed navigation flattened
const navigationFlattened = computed(() => getNavigationFlattened(navigation));

// Computed properties
const linkInvalid = computed(() => {
  return linkkiTyyppi.value === 'ulkoinen' && linkValue.value && !linkValue.value.startsWith('http');
});

const isInvalid = computed(() => {
  if (linkkiTyyppi.value === 'sisainen') {
    return !internalLink.value;
  }
  return !linkValue.value || !!linkInvalid.value;
});

// Methods
function labelSearchIdentity(obj: any) {
  return _.toLower($kaanna(obj.label));
}

function handleOk() {
  let result: any = {};

  if (linkkiTyyppi.value === 'ulkoinen' && linkValue.value) {
    result = {
      href: linkValue.value,
    };
  }
  else if (linkkiTyyppi.value === 'sisainen' && internalLink.value) {
    result = {
      href: '#',
      routenode: JSON.stringify(_.pick(internalLink.value, ['id', 'type', 'koodi', 'meta'])),
    };
  }

  emit('ok', result);
  props.onOk?.(result);
}

function handleCancel() {
  emit('cancel');
  props.onCancel?.();
}

const epModalRef = ref<InstanceType<typeof EpModal> | null>(null);

// Initialize component
onMounted(() => {
  epModalRef.value?.show();

  // Set initial values if editing existing link
  if (props.initialHref && props.initialHref !== '#') {
    linkkiTyyppi.value = 'ulkoinen';
    linkValue.value = props.initialHref;
  }
  else if (props.initialRoutenode) {
    linkkiTyyppi.value = 'sisainen';
    try {
      const routeData = JSON.parse(props.initialRoutenode);
      internalLink.value = deepFind({ id: routeData.id }, navigationFlattened.value);
    }
    catch (e) {
      console.error('Failed to parse route node:', e);
    }
  }
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.link-modal-content {
  min-width: 500px;
  max-width: 800px;
}

.link-input {
  border-color: $grey300;

  &--invalid {
    border-color: $alias-error;
  }
}

.link-input-error {
  color: $alias-error;
}
</style>
