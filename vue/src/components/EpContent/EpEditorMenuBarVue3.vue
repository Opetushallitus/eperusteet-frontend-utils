<template>
  <div v-if="isEditable">
    {{ props.editor.isActive('italic') }}
    <div
      class="editor-toolbar"
      :class="{ 'd-none': !alwaysVisible && !focused }"
    >
      <div
        class="btn-toolbar"
        role="toolbar"
      >
        <div
          v-for="(group, idx) in groups"
          :key="idx"
          class="btn-group mr-2"
          role="group"
        >
          <b-button
            v-for="feature in group"
            :key="feature.command"
            :delay="100"
            :title="$t('editor-' + feature.command)"
            :variant="'outline'"
            :disabled="feature.disabled"
            :class="{ 'active': !feature.disabled && feature.isActive && isActive(feature.name) }"
            @click="feature.customClick ? feature.customClick() : executeCommand(feature.command, feature.params)"
          >
            <ep-material-icon
              v-if="feature.icon"
              :color="'#444'"
            >
              {{ feature.icon }}
            </ep-material-icon>
            <span v-if="feature.text">{{ $t(feature.text) }}</span>
          </b-button>
        </div>
      </div>
      <div
        v-if="layout === 'normal' && isActive('table')"
        class="btn-toolbar sub-bar"
        role="toolbar"
      >
        <div
          v-for="(group, idx) in helperTable"
          :key="idx"
          class="btn-group mr-2"
          role="group"
        >
          <b-button
            v-for="feature in group"
            :key="feature.command"
            :title="$t('editor-' + feature.command)"
            :variant="'outline'"
            :disabled="feature.disabled"
            :class="{ 'active': !feature.disabled && feature.isActive && isActive(feature.command) }"
            @click="feature.customClick ? feature.customClick() : executeCommand(feature.command, feature.params)"
          >
            <ep-public-image
              v-if="feature.icon"
              :image="feature.icon"
              class="icon-opacity"
            />
          </b-button>
        </div>
      </div>
      <b-modal
        ref="link-modal"
        :title="$t('lisaa-muokkaa-linkki')"
        :ok-title="$t('ok')"
        :cancel-title="$t('peruuta')"
        :ok-disabled="linkInvalid"
        size="xl"
        @ok="editLink"
        @keyup.enter="editLink"
        @hidden="linkValue = null"
      >
        <b-form-group class="mx-4">
          <template v-if="navigationFlattened">
            <b-form-radio
              v-model="linkkiTyyppi"
              class="p-2"
              value="sisainen"
              name="linkkiTyyppi"
            >
              {{ $t('sisainen-linkki') }}
            </b-form-radio>
            <ep-multi-select
              v-if="linkkiTyyppi === 'sisainen'"
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
            </ep-multi-select>

            <b-form-radio
              v-model="linkkiTyyppi"
              class="p-2 mt-3"
              value="ulkoinen"
              name="linkkiTyyppi"
            >
              {{ $t('ulkoinen-linkki') }}
            </b-form-radio>
            <b-form-input
              v-if="linkkiTyyppi === 'ulkoinen'"
              v-model="linkValue"
              :placeholder="linkPlaceholder"
              :state="!linkInvalid"
            />
          </template>
          <b-form-input
            v-else
            v-model="linkValue"
            :placeholder="linkPlaceholder"
          />
        </b-form-group>
      </b-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed, inject, useTemplateRef, getCurrentInstance } from 'vue';
import { NavigationNodeDto } from '@shared/tyypit';
import { deepFind } from '@shared/utils/helpers';
import { $t, $kaanna } from '@shared/utils/globals';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpPublicImage from '@shared/components/EpPublicImage/EpPublicImage.vue';
import { ILinkkiHandler } from './LinkkiHandler';

const props = defineProps({
  editor: {
    type: Object,
    required: true,
  },
  isEditable: {
    type: Boolean,
    required: true,
  },
  layout: {
    type: String,
    required: true,
  },
  alwaysVisible: {
    type: Boolean,
    default: true,
  },
  help: {
    type: String,
    default: '',
  },
});

const instance = getCurrentInstance();
const navigation = inject('navigation') as NavigationNodeDto;
const linkkiHandler = inject<ILinkkiHandler>('linkkiHandler');

const linkValue = ref<string | null>(null);
const internalLink = ref<NavigationNodeDto | null>(null);
const linkkiTyyppi = ref<'ulkoinen' | 'sisainen' | null>(null);
const linkPlaceholder = ref('https://...');
const focused = ref(true);

const linkModal = useTemplateRef('link-modal');

const id = computed(() => {
  return instance?.uid;
});

const history = computed(() => {
  return [{
    name: 'undo',
    command: 'undo',
    icon: 'undo',
    isActive: false,
  }, {
    name: 'redo',
    command: 'redo',
    icon: 'redo',
    isActive: false,
  }];
});

const textManipulation = computed(() => {
  return [{
    name: 'bold',
    command: 'toggleBold',
    icon: 'format_bold',
    isActive: true,
  }, {
    name: 'italic',
    command: 'toggleItalic',
    icon: 'format_italic',
    isActive: true,
  }, {
    name: 'strike',
    command: 'toggleStrike',
    icon: 'strikethrough_s',
    isActive: true,
  }];
});

const linking = computed(() => {
  return [{
    icon: 'add_link',
    command: 'link',
    isActive: true,
    disabled: !props.editor || !props.editor.state || props.editor.state.selection.empty,
    customClick: () => {
      const isNew = !props.editor.isActive('link');
      const attrs = props.editor.getAttributes('link');
      linkValue.value = null;
      internalLink.value = null;
      linkkiTyyppi.value = null;

      if (!isNew && attrs) {
        linkValue.value = attrs.href;

        if (attrs.href && attrs.href !== '#') {
          linkkiTyyppi.value = 'ulkoinen';
        }

        if (attrs.routenode) {
          linkkiTyyppi.value = 'sisainen';
          internalLink.value = deepFind({ id: _.get(JSON.parse(attrs.routenode), 'id') }, navigationFlattened.value);
        }
      }

      linkModal.value.show();
    },
  }];
});

const linkTermiKuva = computed(() => {
  return [...linking.value,
    ...(!props.editor || !props.editor.can().setTermi({ 'data-viite': '' }) ? [] : [{
      icon: 'book',
      command: 'termi',
      isActive: true,
      disabled: !props.editor || !props.editor.state || props.editor.state.selection.empty,
    }]), ...(!props.editor || !props.editor.can().setImage({ 'data-uid': '' }) ? [] : [{
      icon: 'add_photo_alternate',
      command: 'image',
      isActive: false,
    }]),
  ];
});

const lists = computed(() => {
  return [{
    command: 'bulletList',
    icon: 'list',
    isActive: true,
  }, {
    command: 'orderedList',
    icon: 'format_list_numbered_rtl',
    isActive: true,
  }];
});

const tables = computed(() => {
  return [{
    command: 'createTable',
    icon: 'border_all',
    isActive: false,
    params: {
      rowsCount: 3,
      colsCount: 3,
      withHeaderRow: true,
    },
  }];
});

const blockquote = computed(() => {
  return [{
    command: 'blockquote',
    icon: 'format_quote',
    isActive: true,
  }];
});

const helperTable = computed(() => {
  return [
    [{
      command: 'addColumnBefore',
      icon: 'table_add_column_before',
      isActive: false,
    }, {
      command: 'addColumnAfter',
      icon: 'table_add_column_after',
      isActive: false,
    }, {
      command: 'deleteColumn',
      icon: 'table_delete_column',
      isActive: false,
    }],
    [{
      command: 'addRowBefore',
      icon: 'table_add_row_before',
      isActive: false,
    }, {
      command: 'addRowAfter',
      icon: 'table_add_row_after',
      isActive: false,
    }, {
      command: 'deleteRow',
      icon: 'table_delete_row',
      isActive: false,
    }],
    [{
      command: 'mergeCells',
      icon: 'table_merge_cells',
      isActive: false,
    }, {
      command: 'splitCell',
      icon: 'table_split_cell',
      isActive: false,
    }],
    [{
      command: 'deleteTable',
      icon: 'table_delete',
      isActive: false,
    }],
  ];
});

const groups = computed(() => {
  if (props.layout === 'minimal') {
    return [
      history.value,
      textManipulation.value,
      // linkTermiKuva.value,
    ];
  }
  else {
    return [
      history.value,
      textManipulation.value,
      lists.value,
      tables.value,
      blockquote.value,
      linkTermiKuva.value,
    ];
  }
});

const navigationFlattened = computed(() => {
  if (navigation) {
    const result: any[] = [];
    const flatten = (node: NavigationNodeDto, depth: number) => {
      result.push({
        ...node,
        depth,
      });
      if (node.children) {
        _.each(node.children, child => flatten(child, depth + 1));
      }
    };
    flatten(navigation, 0);
    return result;
  }
  return null;
});

const linkInvalid = computed(() => {
  if (linkkiTyyppi.value === 'sisainen') {
    return !internalLink.value;
  }
  else if (linkkiTyyppi.value === 'ulkoinen') {
    return !linkValue.value || linkValue.value.length === 0;
  }
  return !linkValue.value || linkValue.value.length === 0;
});

function labelSearchIdentity(node: any) {
  if (node.label) {
    return $kaanna(node.label);
  }
  return '';
}

function isActive(command: string): boolean {
  // console.log('isActive', command);
  // console.log('props.editor', props.editor);
  return props.editor && props.editor.isActive(command);
  // return true;
}

function executeCommand(command: string, params: any = {}) {
  if (props.editor) {
    if (command === 'termi') {
      props.editor.chain().focus().setTermi({ 'data-viite': '' }).run();
    }
    else if (command === 'image') {
      props.editor.chain().focus().setImage({ 'data-uid': '' }).run();
    }
    else {
      props.editor.chain().focus()[command](params).run();
    }
  }
}

function editLink() {
  if (!props.editor) {
    return;
  }

  if (linkkiTyyppi.value === 'sisainen' && internalLink.value && linkkiHandler) {
    const route = linkkiHandler.nodeToRoute(internalLink.value);
    if (route) {
      props.editor.chain().focus().extendMarkRange('link').setLink({
        href: '#',
        routenode: JSON.stringify({
          id: internalLink.value.id,
        }),
      }).run();
    }
  }
  else if (linkkiTyyppi.value === 'ulkoinen' && linkValue.value) {
    props.editor.chain().focus().extendMarkRange('link').setLink({
      href: linkValue.value,
    }).run();
  }
  else if (linkValue.value) {
    props.editor.chain().focus().extendMarkRange('link').setLink({
      href: linkValue.value,
    }).run();
  }
}
</script>

<style scoped lang="scss">
.editor-toolbar {
  margin-bottom: 0;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-bottom: none;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  padding: 0.25rem;

  .btn-toolbar {
    flex-wrap: wrap;
  }

  .btn-group {
    margin-bottom: 0.25rem;
  }

  .sub-bar {
    margin-top: 0.25rem;
    padding-top: 0.25rem;
    border-top: 1px solid #ced4da;
  }

  :deep(.active) {
    background: #c1c1c1 !important;
    border-radius: 0;
  }
}

.icon-opacity {
  opacity: 0.7;
}

</style>
