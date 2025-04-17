import { mount } from '@vue/test-utils';
import { Kielet } from '../../stores/kieli';
import { Kieli } from '../../tyypit';
import { Aikaleima } from '../aikaleima';
import VueI18n from 'vue-i18n';
import { vi } from 'vitest';
import Vue from 'vue';
import { globalStubs } from '../../utils/__tests__/stubs';

describe.skip('Plugin aikaleima', () => {
  beforeEach(() => {
    // Asetetaan nykyinen aika staattiseksi
    const spy = vi.spyOn(Date, 'now');
    spy.mockImplementation(() => 1546870463248);
  });

  function mountAikaleima(value: any, func: string) {
    return mount({
      data() {
        return { value };
      },
      global:{
        ...globalStubs,
      },
      template: `<p>{{ ${func} }}</p>`, // Esim. {{ $ago(1546870463248) }}
    });
  }

  test('ldt', async () => {
    const wrapper = mountAikaleima(1546870463248, '$ldt(value)');

    expect(wrapper.text()).toEqual('7. tammikuuta 2019, klo 16.14');

    Kielet.setUiKieli(Kieli.sv);
    await Vue.nextTick();
    expect(wrapper.text()).toEqual('7 januari 2019 kl. 16:14');
  });

  test('ld', async () => {
    const wrapper = mountAikaleima(1546870463248, '$ld(value)');

    expect(wrapper.text()).toEqual('7. tammikuuta 2019');

    Kielet.setUiKieli(Kieli.sv);
    await Vue.nextTick();
    expect(wrapper.text()).toEqual('7 januari 2019');
  });

  test('lt', async () => {
    const wrapper = mountAikaleima(1546870463248, '$lt(value)');

    expect(wrapper.text()).toEqual('16:14:23');

    Kielet.setUiKieli(Kieli.sv);
    await Vue.nextTick();
    expect(wrapper.text()).toEqual('16:14:23');
  });

  test('sdt', async () => {
    const wrapper = mountAikaleima(1546870463248, '$sdt(value)');

    expect(wrapper.text()).toEqual('7.1.2019 16:14');

    Kielet.setUiKieli(Kieli.sv);
    await Vue.nextTick();
    expect(wrapper.text()).toEqual('7.1.2019 16:14');
  });

  test('sd', async () => {
    const wrapper = mountAikaleima(1546870463248, '$sd(value)');

    expect(wrapper.text()).toEqual('7.1.2019');

    Kielet.setUiKieli(Kieli.sv);
    await Vue.nextTick();
    expect(wrapper.text()).toEqual('7.1.2019');
  });

  test('st', async () => {
    const wrapper = mountAikaleima(1546870463248, '$st(value)');

    expect(wrapper.text()).toEqual('16:14');

    Kielet.setUiKieli(Kieli.sv);
    await Vue.nextTick();
    expect(wrapper.text()).toEqual('16:14');
  });

  test('ago', async () => {
    const wrapper = mountAikaleima(1546870463248, '$ago(value)');

    expect(wrapper.text()).toEqual('s sitten');

    Kielet.setUiKieli(Kieli.sv);
    await Vue.nextTick();
    expect(wrapper.text()).toEqual('för några sekunder sedan');
  });

  test('cdt', async () => {
    // $cdt(value, 'LLLL')
    const wrapper = mountAikaleima(1546870463248, '$cdt(value, \'LLLL\')');

    expect(wrapper.text()).toEqual('maanantai, 7. tammikuuta 2019, klo 16.14');

    Kielet.setUiKieli(Kieli.sv);
    await Vue.nextTick();
    expect(wrapper.text()).toEqual('måndag 7 januari 2019 kl. 16:14');
  });
});
