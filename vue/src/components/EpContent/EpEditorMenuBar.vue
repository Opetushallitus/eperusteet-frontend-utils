<template>
<div v-if="isEditable">
  <editor-menu-bar :editor="editor"
                   :focused="true"
                    v-slot="data">
    <div class="editor-toolbar" :class="{ 'd-none': !alwaysVisible && !data.focused}">
      <div class="btn-toolbar" role="toolbar">
        <div class="btn-group mr-2" role="group" v-for="(group, idx) in groups" :key="idx">
          <b-button v-for="feature in group"
                  :key="feature.command"
                  :delay="100"
                  :title="$t('editor-' + feature.command)"
                  :variant="'outline'"
                  :disabled="feature.disabled"
                  :class="{ 'active': !feature.disabled && data.isActive[feature.command] && data.isActive[feature.command]() }"
                  @click="feature.customClick ? feature.customClick(data) : data.commands[feature.command](feature.params)">
            <fas v-if="feature.icon" :icon="feature.icon" fixed-width />
            <span v-if="feature.text">{{ $t(feature.text) }}</span>
          </b-button>
        </div>
      </div>
      <div class="btn-toolbar sub-bar" role="toolbar" v-if="layout === 'normal' && data.isActive.table()">
        <div class="btn-group mr-2" role="group" v-for="(group, idx) in helperTable" :key="idx">
          <b-button v-for="feature in group"
                  :key="feature.command"
                  :title="$t('editor-' + feature.command)"
                  :variant="'outline'"
                  :disabled="feature.disabled"
                  :class="{ 'active': !feature.disabled && data.isActive[feature.command] && data.isActive[feature.command]() }"
                  @click="feature.customClick ? feature.customClick(data) : data.commands[feature.command](feature.params)">
            <fal v-if="feature.icon" fixed-width>
              <fas :icon="feature.icon" fixed-width />
              <fas v-if="feature.uppericon" fixed-width transform="up-4 left-6" :icon="feature.uppericon" :style="{ color: feature.color || 'black' }" />
              <fas v-if="feature.righticon" fixed-width transform="right-6" :icon="feature.righticon" :style="{ color: feature.color || 'black' }" />
              <fas v-if="feature.subicon" fixed-width transform="down-4 left-6" :icon="feature.subicon" :style="{ color: feature.color || 'black' }" class="fa-inverse" />
              <fas v-if="feature.lefticon" fixed-width transform="left-6" :icon="feature.lefticon" :style="{ color: feature.color || 'black' }" />
            </fal>
          </b-button>
        </div>
      </div>
      <b-modal ref="link-modal"
               :title="$t('lisaa-muokkaa-linkki')"
               :ok-title="$t('ok')"
               :cancel-title="$t('peruuta')"
               @ok="editLink(data)"
               @keyup.enter="editLink(data)"
               @hidden="linkValue = null">
        <b-form-input v-model="linkValue" placeholder="https://..."></b-form-input>
      </b-modal>
    </div>
  </editor-menu-bar>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { EditorMenuBar } from 'tiptap';

@Component({
  components: {
    EditorMenuBar,
  },
})
export default class EpEditorMenuBar extends Vue {
  @Prop({ required: true })
  private editor!: any;

  @Prop({ required: true })
  private isEditable!: boolean;

  @Prop({ required: true })
  private layout!: string;

  @Prop({ default: true })
  private alwaysVisible!: boolean;

  private linkValue: string | null = null;

  get id() {
    return (this as any)._uid;
  }

  get history() {
    return [{
      command: 'undo',
      icon: 'palauta',
      disabled: true,
    }, {
      command: 'redo',
      icon: 'tee-uudelleen',
      disabled: true,
    }];
  }

  get textManipulation() {
    return [{
      command: 'bold',
      icon: 'lihavointi',
    }, {
      command: 'italic',
      icon: 'kursivointi',
    }, {
      command: 'strike',
      icon: 'yliviivaus',
    }];
  }

  get linking() {
    return [{
      icon: 'link',
      command: 'link',
      disabled: this.editor.selection.from === this.editor.selection.to,
      customClick: (data) => {
        const isNew = !data.isActive.link();
        const attrs = data.getMarkAttrs('link');
        if (!isNew && attrs && attrs.href) {
          this.linkValue = attrs.href;
        }
        (this as any).$refs['link-modal'].show();
      },
    }, ...(!_.isFunction(_.get(this.editor.commands, 'termi')) ? [] : [{
      icon: 'kasitteet',
      command: 'termi',
      disabled: this.editor.selection.from === this.editor.selection.to,
    }]), ...(!_.isFunction(_.get(this.editor.commands, 'image')) ? [] : [{
      icon: 'lisaa-kuva',
      command: 'image',
    }]),
    ];
  }

  get lists() {
    return [{
      command: 'bullet_list',
      icon: 'lista-luettelo',
    }, {
      command: 'ordered_list',
      icon: 'lista-numerointi',
    }];
  }

  get tables() {
    return [{
      command: 'createTable',
      params: {
        rowsCount: 3,
        colsCount: 3,
        withHeaderRow: false,
      },
      icon: 'taulukko',
    }];
  }

  get helperToolbar() {
    return null;
  }

  get helperTable() {
    const RemoveColor = '#e44e4e';
    const AddColor = '#5BCA13';
    const MergeColor = '#ffd024';

    const tables = [{
      color: RemoveColor,
      command: 'deleteTable',
      icon: 'poista-taulukko',
      text: 'poista-taulu',
    }];

    const columns = [{
      color: AddColor,
      command: 'addColumnBefore',
      icon: 'kolumni-vasen',
      text: 'lisaa-sarake-ennen',
    }, {
      color: AddColor,
      command: 'addColumnAfter',
      icon: 'kolumni-oikea',
      text: 'lisaa-sarake-jalkeen',
    }, {
      color: RemoveColor,
      command: 'deleteColumn',
      icon: 'poista-kolumni',
      text: 'poista-sarake',
    }];

    const rows = [{
      command: 'addRowBefore',
      color: AddColor,
      icon: 'rivi-ylos',
      text: 'lisaa-rivi-ennen',
    }, {
      command: 'addRowAfter',
      color: AddColor,
      icon: 'rivi-alas',
      text: 'lisaa-rivi-jalkeen',
    }, {
      command: 'deleteRow',
      color: RemoveColor,
      icon: 'poista-rivi',
      text: 'poista-rivi',
    }, {
      command: 'toggleCellMerge',
      color: MergeColor,
      icon: 'yhdista-solut',
      text: 'yhdista-solut',
    }];

    return [
      columns,
      rows,
      tables,
    ];
  }

  get groups() {
    if (this.layout === 'normal') {
      return _.filter([
        this.history,
        this.textManipulation,
        this.linking,
        this.lists,
        this.tables,
      ], v => !_.isEmpty(v));
    }
    else if (this.layout === 'simplified') {
      return [
        this.history,
        this.textManipulation,
      ];
    }
    else {
      return [
        this.history,
      ];
    }
  }

  private editLink(data) {
    if (!_.isEmpty(this.linkValue)) {
      data.commands.link({
        href: this.linkValue,
      } as any);
      this.linkValue = null;
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

.sub-bar {
  margin-top: 0;
  border-top: 2px solid #E0E0E1;
}

/deep/ .active {
  background: #c1c1c1 !important;
  border-radius: 0;
}

.editor-toolbar {
  background-color: #f1f1f1;
  border: 2px solid #E0E0E1;
  border-bottom: none;
  padding: 0;
}

</style>
