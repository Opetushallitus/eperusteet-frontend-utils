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
          <div class="form-group">
            <label class="form-check-label">
              <input
                v-model="linkkiTyyppi"
                type="radio"
                class="form-check-input"
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

          <div class="form-group mt-3">
            <label class="form-check-label">
              <input
                v-model="linkkiTyyppi"
                type="radio"
                class="form-check-input"
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
              class="form-control"
              :class="{ 'is-invalid': linkInvalid }"
              :placeholder="linkPlaceholder"
            >
            <div
              v-if="linkInvalid"
              class="invalid-feedback"
            >
              {{ $t('url-osoite-virheellinen') }}
            </div>
          </div>
        </template>
        
        <div
          v-else
          class="mb-3"
        >
          <label class="form-label">{{ $t('linkki-osoite') }}</label>
          <input
            v-model="linkValue"
            type="text"
            class="form-control"
            :placeholder="linkPlaceholder"
          >
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <div class="w-100 d-flex justify-content-end gap-2">
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
  } else if (linkkiTyyppi.value === 'sisainen' && internalLink.value) {
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
  } else if (props.initialRoutenode) {
    linkkiTyyppi.value = 'sisainen';
    try {
      const routeData = JSON.parse(props.initialRoutenode);
      internalLink.value = deepFind({ id: routeData.id }, navigationFlattened.value);
    } catch (e) {
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

.form-group {
  margin-bottom: 1rem;
}

.form-check-label {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;

  .form-check-input {
    margin-right: 0.5rem;
  }
}

.form-control {
  width: 100%;
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  
  &.is-invalid {
    border-color: #dc3545;
  }
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-label {
  margin-bottom: 0.5rem;
  font-weight: 500;
}
</style>
