import { Notifikaatiot } from './notifikaatiot';
import { createApp } from 'vue';
import { vi } from 'vitest';

describe('Notifikaatiot plugin', () => {
  let app: any;
  let mockNotify: any;
  let componentContext: any;

  beforeEach(() => {
    app = createApp({});

    // Mock the $notify function
    mockNotify = vi.fn();

    // Install the plugin
    Notifikaatiot.install(app);

    // Create a component-like context with $notify
    componentContext = {
      $notify: mockNotify,
    };
  });

  test('methods', () => {
    const globalProperties = app.config.globalProperties;

    // Test $success method - call with proper context
    globalProperties.$success.call(componentContext, 'a');
    expect(mockNotify).toHaveBeenCalledWith({
      title: 'a',
      type: 'success',
    });

    // Test $info method
    globalProperties.$info.call(componentContext, 'b');
    expect(mockNotify).toHaveBeenCalledWith({
      title: 'b',
      type: 'info',
    });

    // Test $fail method
    globalProperties.$fail.call(componentContext, 'c');
    expect(mockNotify).toHaveBeenCalledWith({
      title: 'c',
      type: 'error',
      text: '',
      duration: 5000,
    });

    expect(mockNotify).toHaveBeenCalledTimes(3);
  });

  test('$notification method', () => {
    const globalProperties = app.config.globalProperties;

    globalProperties.$notification.call(componentContext, {
      title: 'Test title',
      kind: 'warn',
      text: 'Test text',
    });

    expect(mockNotify).toHaveBeenCalledWith({
      title: 'Test title',
      type: 'warn',
      text: 'Test text',
    });
  });

  test('$warning method', () => {
    const globalProperties = app.config.globalProperties;

    globalProperties.$warning.call(componentContext, 'Warning title', 'Warning text');

    expect(mockNotify).toHaveBeenCalledWith({
      title: 'Warning title',
      type: 'warn',
      text: 'Warning text',
      duration: 5000,
    });
  });
});
