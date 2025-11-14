import { createDecorator, VueDecorator } from 'vue-class-component';
import { ComponentOptions } from 'vue';
import { Vue } from 'vue-facing-decorator';

export const Meta: VueDecorator = createDecorator((options: ComponentOptions<Vue>, key: string) => {
  if (!options.methods) {
    return;
  }
  options['metaInfo'] = options.methods[key];
});
