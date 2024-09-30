<template>
  <div>
    <template v-for="field in fields">
      <div v-if="meta[field]" :key="field">{{ field }}: {{ meta[field] }}</div>
    </template>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { MessageMeta } from '@shared/api/ai';

@Component
export default class EpOpsAiMessageMeta extends Vue {
  @Prop({ required: true })
  private meta!: MessageMeta;

  get fields() {
    return ['model', 'instructions', 'temperature', 'top_p', 'sourceRevision', 'sourceType', 'sourceId'];
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
