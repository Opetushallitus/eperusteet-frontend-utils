import { mount } from '@vue/test-utils';
import EpPagination from './EpPagination.vue';
import { findContaining } from '../../utils/jestutils';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpPagination', () => {
  test('Empty pagination', async () => {
    const wrapper = mount(EpPagination, {
      props: {
        modelValue: 1,
        perPage: 10,
        totalRows: 0,
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toContain('></div>');
  });

  test('Pagination with less than six pages', async () => {
    const wrapper = mount(EpPagination, {
      props: {
        modelValue: 1,
        perPage: 10,
        totalRows: 49,
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.findAll('.link-container').length).toEqual(7);
    expect(findContaining(wrapper, '.link-container', '1')).toBeTruthy();
    expect(findContaining(wrapper, '.link-container', '2')).toBeTruthy();
    expect(findContaining(wrapper, '.link-container', '3')).toBeTruthy();
    expect(findContaining(wrapper, '.link-container', '4')).toBeTruthy();
    expect(findContaining(wrapper, '.link-container', '5')).toBeTruthy();
  });

  test('Pagination with more than six pages', async () => {
    const wrapper = mount(EpPagination, {
      props: {
        modelValue: 5,
        perPage: 10,
        totalRows: 80,
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.findAll('.link-container').length).toEqual(9);
    expect(findContaining(wrapper, '.link-container', '1')).toBeTruthy();
    expect(findContaining(wrapper, '.link-container', '3')).not.toBeTruthy();
    expect(findContaining(wrapper, '.link-container', '4')).toBeTruthy();
    expect(findContaining(wrapper, '.link-container', '5')).toBeTruthy();
    expect(findContaining(wrapper, '.link-container', '6')).toBeTruthy();
    expect(findContaining(wrapper, '.link-container', '7')).not.toBeTruthy();
    expect(findContaining(wrapper, '.link-container', '8')).toBeTruthy();
  });
});
