<template>
  <div class="link-modal">
    <div class="modal-header">
      <h5 class="modal-title">
        {{ $t('lisaa-muokkaa-linkki') }}
      </h5>
    </div>

    <div class="modal-body">
      <div class="mx-4">
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
              class="w-full px-3 py-2 border rounded"
              :class="{ 'border-red-600': linkInvalid }"
              :placeholder="linkPlaceholder"
            >
            <div
              v-if="linkInvalid"
              class="block text-red-600 text-sm mt-1"
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
            class="w-full px-3 py-2 border rounded"
            :placeholder="linkPlaceholder"
          >
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <div class="w-full flex justify-end gap-2">
        <ep-button
          variant="link"
          @click="handleCancel"
        >
          {{ $t('peruuta') }}
        </ep-button>
        <ep-button
          variant="primary"
          :disabled="isInvalid"
          @click="handleOk"
        >
          {{ $t('ok') }}
        </ep-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue';
import _ from 'lodash';
import { NavigationNodeDto } from '@shared/tyypit';
import { deepFind } from '@shared/utils/helpers';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import { $kaanna, $t } from '@shared/utils/globals';
import { unref } from 'vue';

const props = defineProps({
  initialHref: {
    type: String,
    default: '',
  },
  initialRoutenode: {
    type: String,
    default: '',
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
}

function handleCancel() {
  emit('cancel');
}

// Initialize component
onMounted(() => {
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
.link-modal {
  min-width: 500px;
  max-width: 800px;
  background: white;
}

.modal-header {
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 1rem;

  .modal-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 500;
    color: #212529;
  }
}

.modal-body {
  padding: 0 1.5rem 1rem 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-top: 0;
  margin-top: 1rem;
}


</style>
