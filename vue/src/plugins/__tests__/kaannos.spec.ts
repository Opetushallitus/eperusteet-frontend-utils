import { createLocalVue, mount } from '@vue/test-utils';
import { Kielet } from '../../stores/kieli';
import { Kaannos } from '../../plugins/kaannos';
import { Kieli } from '../../tyypit';
import VueI18n from 'vue-i18n';
import { vi } from 'vitest';
import Vue from 'vue';

describe('Plugin kaannos', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());
  const i18n = Kielet.i18n;

  beforeEach(() => {
    Kielet.setSisaltoKieli(Kieli.fi);
  });

  function createWrapper(data: object) {
    return mount({
      template: '<div>{{ $kaanna(teksti) }}</div>',
      data() {
        return {
          ...data,
        };
      },
    }, {
      i18n,
      localVue,
    });
  }

  test('tekstioliot', async () => {
    const wrapper = createWrapper({
      teksti: {
        fi: 'suomeksi',
        sv: 'ruotsiksi',
      },
    });

    expect(wrapper.text()).toEqual('suomeksi');

    Kielet.setSisaltoKieli(Kieli.sv);
    await Vue.nextTick();
    expect(wrapper.text()).toEqual('ruotsiksi');
  });

  test('undefined', () => {
    const wrapper = createWrapper({ teksti: undefined });
    expect(wrapper.text()).toEqual('');
  });

  test('null', () => {
    const wrapper = createWrapper({ teksti: null });
    expect(wrapper.text()).toEqual('');
  });

  test('viallinen syöte', () => {
    const spy = vi.spyOn(console, 'warn')
      .mockImplementationOnce(() => {});
    const wrapper = createWrapper({
      teksti: 'tekstiä',
    });

    expect(wrapper.text()).toEqual('tekstiä');
    expect(spy).toBeCalled();
  });
});
