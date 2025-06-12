import { Notifikaatiot } from './notifikaatiot';
import { createApp } from 'vue';

// TODO
describe('Notifikaatiot plugin', () => {
  const app = createApp({})
  Notifikaatiot.install(app)

  test('methods', () => {
    // v.prototype.$success('a');
    // v.prototype.$info('b');
    // v.prototype.$fail('c');
    expect(v.prototype.$notify).toHaveBeenCalledTimes(3);
  });
});
