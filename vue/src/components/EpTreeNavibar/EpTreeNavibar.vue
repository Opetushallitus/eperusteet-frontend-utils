<template>
  <EpSpinner v-if="!navigation" />
  <div v-else>
    <div v-for="(item, idx) in navigation" :key="idx">
      <div class="d-flex">
        <slot name="padding" :item="item"></slot>
        <div>
          <slot :name="$scopedSlots[item.type] ? item.type : 'default'" :item="item">
            <div class="bg-warning">
              Unimplemented nav type {{ item.type }} {{ $kaanna(item.label) }}
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch, Prop, Component, Vue } from 'vue-property-decorator';
import EpIcon from '@shared/components/EpIcon/EpIcon.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { EpTreeNavibarStore } from '@shared/components/EpTreeNavibar/EpTreeNavibarStore';


export type ProjektiFilter = 'koulutustyyppi' | 'tila' | 'voimassaolo';

@Component({
  components: {
    EpIcon,
    EpMultiSelect,
    EpSearch,
    EpSpinner,
  },
})
export default class EpTreeNavibar extends Vue {
  @Prop({ required: true })
  private store!: EpTreeNavibarStore;

  get navigation() {
    if (!this.store) {
      return null;
    }
    return this.store.filtered.value;
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables';

.sidenav {
  min-width: $sidebar-width;
  max-width: $sidebar-width;
  background: #fff;
}

.portal-menu {
  height: 140px;

  h1 {
    margin: 0;
    padding: 0;
  }

  .upper-left {
    min-width: $sidebar-width;
    max-width: $sidebar-width;
  }
}

.actual {
  background: #f2f2f2;
}

</style>
