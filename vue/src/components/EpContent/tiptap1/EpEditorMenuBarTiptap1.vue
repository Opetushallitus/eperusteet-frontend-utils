<template>
  <div v-if="isEditable">
    <editor-menu-bar
      v-slot="data"
      :editor="editor"
      :focused="true"
    >
      <div
        class="editor-toolbar"
        :class="{ 'hidden': !alwaysVisible && !data.focused}"
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
            <ep-button
              v-for="feature in group"
              :key="feature.command"
              :delay="100"
              :title="$t('editor-' + feature.command)"
              :variant="'outline'"
              :disabled="feature.disabled"
              :class="{ 'active': !feature.disabled && data.isActive[feature.command] && data.isActive[feature.command]() }"
              @click="feature.customClick ? feature.customClick(data) : data.commands[feature.command](feature.params)"
            >
              <EpMaterialIcon
                v-if="feature.icon"
                :color="'#444'"
              >
                {{ feature.icon }}
              </EpMaterialIcon>
              <span v-if="feature.text">{{ $t(feature.text) }}</span>
            </ep-button>
          </div>
        </div>
        <div
          v-if="layout === 'normal' && data.isActive.table()"
          class="btn-toolbar sub-bar"
          role="toolbar"
        >
          <div
            v-for="(group, idx) in helperTable"
            :key="idx"
            class="btn-group mr-2"
            role="group"
          >
            <ep-button
              v-for="feature in group"
              :key="feature.command"
              :title="$t('editor-' + feature.command)"
              :variant="'outline'"
              :disabled="feature.disabled"
              :class="{ 'active': !feature.disabled && data.isActive[feature.command] && data.isActive[feature.command]() }"
              @click="feature.customClick ? feature.customClick(data) : data.commands[feature.command](feature.params)"
            >
              <EpPublicImage
                v-if="feature.icon"
                :image="feature.icon"
                class="icon-opacity"
              />
            </ep-button>
          </div>
        </div>
        <b-modal
          ref="link-modal"
          :title="$t('lisaa-muokkaa-linkki')"
          :ok-title="$t('ok')"
          :cancel-title="$t('peruuta')"
          :ok-disabled="linkInvalid"
          size="xl"
          @ok="editLink(data)"
          @keyup.enter="editLink(data)"
          @hidden="linkValue = null"
        >
          <EpFormGroup class="mx-4">
            <template v-if="navigationFlattenedComputed">
              <b-form-radio
                v-model="linkkiTyyppi"
                class="p-2"
                value="sisainen"
                name="linkkiTyyppi"
              >
                {{ $t('sisainen-linkki') }}
              </b-form-radio>
              <EpMultiSelect
                v-if="linkkiTyyppi === 'sisainen'"
                v-model="internalLink"
                :is-editing="true"
                :search-identity="labelSearchIdentity"
                :options="navigationFlattenedComputed"
                :placeholder="$t('valitse-sivu') + '...'"
              >
                <template #singleLabel="{ option }">
                  {{ $kaanna(option.label) }}
                </template>
                <template #option="{ option }">
                  <span :style="'padding-left: ' + 10*option.depth +'px'"> {{ $kaanna(option.label) }}</span>
                </template>
              </EpMultiSelect>

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
          </EpFormGroup>
        </b-modal>
      </div>
    </editor-menu-bar>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed, inject, useTemplateRef, getCurrentInstance } from 'vue';
import { EditorMenuBar } from 'tiptap';
import { NavigationNodeDto } from '@shared/tyypit';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { deepFind } from '@shared/utils/helpers';
import EpPublicImage from '@shared/components/EpPublicImage/EpPublicImage.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import { $kaanna } from '@shared/utils/globals';
import EpFormGroup from '@shared/components/forms/EpFormGroup.vue';

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
  navigationFlattened: {
    type: Array,
    default: () => [],
  },
});


const navigation = inject('navigation') as NavigationNodeDto;

const linkValue = ref<string | null>(null);
const internalLink = ref<NavigationNodeDto | null>(null);
const linkkiTyyppi = ref<'ulkoinen' | 'sisainen' | null>(null);
const linkPlaceholder = ref('https://...');

const linkModal = useTemplateRef('link-modal');

const history = computed(() => {
  return [{
    command: 'undo',
    icon: 'undo',
  }, {
    command: 'redo',
    icon: 'redo',
  }];
});

const textManipulation = computed(() => {
  return [{
    command: 'bold',
    icon: 'format_bold',
  }, {
    command: 'italic',
    icon: 'format_italic',
  }, {
    command: 'strike',
    icon: 'strikethrough_s',
  }];
});

const linking = computed(() => {
  return [{
    icon: 'add_link',
    command: 'link',
    disabled: props.editor.selection.from === props.editor.selection.to,
    customClick: (data) => {
      const isNew = !data.isActive.link();
      const attrs = data.getMarkAttrs('link');
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
          internalLink.value = deepFind({ id: _.get(JSON.parse(attrs.routenode), 'id') }, navigationFlattenedComputed.value);
        }
      }

      linkModal.value.show();
    },
  }];
});

const linkTermiKuva = computed(() => {
  return [...linking.value,
    ...(!_.isFunction(_.get(props.editor.commands, 'termi')) ? [] : [{
      icon: 'book',
      command: 'termi',
      disabled: props.editor.selection.from === props.editor.selection.to,
    }]), ...(!_.isFunction(_.get(props.editor.commands, 'image')) ? [] : [{
      icon: 'add_photo_alternate',
      command: 'image',
    }]),
  ];
});

const lists = computed(() => {
  return [{
    command: 'bullet_list',
    icon: 'list',
  }, {
    command: 'ordered_list',
    icon: 'format_list_numbered_rtl',
  }];
});

const tables = computed(() => {
  return [{
    command: 'createTable',
    params: {
      rowsCount: 3,
      colsCount: 3,
      withHeaderRow: false,
    },
    icon: 'grid_on',
  }];
});

const helperToolbar = computed(() => {
  return null;
});

const helperTable = computed(() => {
  const RemoveColor = '#e44e4e';
  const AddColor = '#5BCA13';
  const MergeColor = '#ffd024';

  const tables = [{
    color: RemoveColor,
    command: 'deleteTable',
    icon: 'poista-taulukko.svg',
    text: 'poista-taulu',
  }];

  const columns = [{
    color: AddColor,
    command: 'addColumnBefore',
    icon: 'kolumni-vasen.svg',
    text: 'lisaa-sarake-ennen',
  }, {
    color: AddColor,
    command: 'addColumnAfter',
    icon: 'kolumni-oikea.svg',
    text: 'lisaa-sarake-jalkeen',
  }, {
    color: RemoveColor,
    command: 'deleteColumn',
    icon: 'poista-kolumni.svg',
    text: 'poista-sarake',
  }];

  const rows = [{
    command: 'addRowBefore',
    color: AddColor,
    icon: 'rivi-alas.svg',
    text: 'lisaa-rivi-ennen',
  }, {
    command: 'addRowAfter',
    color: AddColor,
    icon: 'rivi-alas.svg',
    text: 'lisaa-rivi-jalkeen',
  }, {
    command: 'deleteRow',
    color: RemoveColor,
    icon: 'poista-rivi.svg',
    text: 'poista-rivi',
  }, {
    command: 'toggleCellMerge',
    color: MergeColor,
    icon: 'yhdista-solut.svg',
    text: 'yhdista-solut',
  }];

  return [
    columns,
    rows,
    tables,
  ];
});

const groups = computed(() => {
  if (props.layout === 'normal') {
    return _.filter([
      history.value,
      textManipulation.value,
      linkTermiKuva.value,
      lists.value,
      tables.value,
    ], v => !_.isEmpty(v));
  }
  else if (props.layout === 'simplified_w_links') {
    return [
      history.value,
      textManipulation.value,
      linking.value,
      lists.value,
    ];
  }
  else if (props.layout === 'simplified') {
    return [
      history.value,
      textManipulation.value,
      lists.value,
    ];
  }
  else {
    return [
      history.value,
    ];
  }
});

const linkInvalid = computed(() => {
  return linkkiTyyppi.value === 'ulkoinen' && !linkValue.value?.startsWith('http');
});

const navigationFlattenedComputed = computed(() => {
  if (navigation) {
    return _.chain(flattenedNavi(navigation))
      .filter(node => !!node.label)
      .map(node => {
        return {
          ...node,
          $isDisabled: !_.has(node, 'id'),
        };
      })
      .value();
  }
  return props.navigationFlattened;
});

function flattenedNavi(navi: NavigationNodeDto, depth = -1) {
  return [
    {
      ...navi,
      depth,
    },
    ..._.flatten(_.map(navi.children, child => flattenedNavi(child, depth + 1))),
  ];
}

function labelSearchIdentity(obj: any) {
  return _.toLower($kaanna(obj.label));
}

function editLink(data) {
  if (!_.isEmpty(linkValue.value)) {
    data.commands.link({
      href: linkValue.value,
    } as any);
  }

  if (!_.isEmpty(internalLink.value)) {
    data.commands.link({
      href: '#',
      routenode: JSON.stringify(_.pick(internalLink.value, ['id', 'type', 'koodi', 'meta'])),
    } as any);
  }

  linkValue.value = null;
  internalLink.value = null;
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

.sub-bar {
  margin-top: 0;
  border-top: 2px solid #E0E0E1;
}

:deep(.active) {
  background: #c1c1c1 !important;
  border-radius: 0;
}

.editor-toolbar {
  background-color: #f1f1f1;
  border: 2px solid #E0E0E1;
  border-bottom: none;
  padding: 0;
}

.icon-opacity {
  opacity: 0.7;
}

</style>
