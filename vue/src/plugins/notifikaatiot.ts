import Vue from 'vue';
import { App } from 'vue';
import Notifications from 'vue-notification';

interface NotificationConfig {
  title: string;
  kind?: 'info' | 'warn' | 'error' | 'success';
  text?: string;
}

export interface CheckedConfig {
  success?: string;
  failure?: string;
}

declare module '@vue/runtime-core' {
  interface Vue {
    $notification: (config: NotificationConfig) => Promise<void>;
    $success: (title: string) => Promise<void>;
    $info: (title: string) => Promise<void>;
    $fail: (title: string, text?: string) => Promise<void>;
    $warning: (title: string, text?: string) => Promise<void>;
  }
}

export class Notifikaatiot {
  public static install(app: App) {

    Vue.use(Notifications);

    app.config.globalProperties.$notification = function(config: NotificationConfig) {
      this.$notify({
        title: config.title,
        type: config.kind || 'info',
        text: config.text,
      });
    };

    app.config.globalProperties.$success = function(title: string) {
      this.$notify({
        title,
        type: 'success',
      });
    };

    app.config.globalProperties.$info = function(title: string) {
      this.$notify({
        title,
        type: 'info',
      });
    };

    app.config.globalProperties.$fail = function(title: string, text: string = '') {
      this.$notify({
        title,
        type: 'error',
        text,
        duration: 5000,
      });
    };

    app.config.globalProperties.$warning = function(title: string, text: string = '') {
      this.$notify({
        title,
        type: 'warn',
        text,
        duration: 5000,
      });
    };
  }
}
