import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import EpModal from './EpModal.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

function mountModal(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(EpModal, {
    props: {
      header: 'Test modal',
      okText: 'OK',
      cancelText: 'Cancel',
      ...props,
    },
    slots: {
      default: '<p class="modal-body">Modal content</p>',
      ...slots,
    },
    attachTo: document.body,
    global: {
      ...globalStubs,
    },
  });
}

describe('EpModal component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('show and hide toggle dialog visibility', async () => {
    const wrapper = mountModal();

    await nextTick();
    expect(document.body.querySelector('.p-dialog')).toBeFalsy();

    wrapper.vm.show();
    await nextTick();
    expect(document.body.querySelector('.p-dialog')).toBeTruthy();
    expect(document.body.textContent).toContain('Modal content');

    wrapper.vm.hide();
    await nextTick();
    expect(document.body.querySelector('.p-dialog')).toBeFalsy();

    wrapper.unmount();
  });

  test('emits ok and hides when OK button is clicked', async () => {
    const wrapper = mountModal();

    wrapper.vm.show();
    await nextTick();

    const okButton = Array.from(document.body.querySelectorAll('button'))
      .find(button => button.textContent?.includes('OK'));
    expect(okButton).toBeTruthy();
    okButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    await nextTick();

    expect(wrapper.emitted('ok')).toHaveLength(1);
    expect(document.body.querySelector('.p-dialog')).toBeFalsy();

    wrapper.unmount();
  });

  test('emits cancel and hides when Cancel button is clicked', async () => {
    const wrapper = mountModal();

    wrapper.vm.show();
    await nextTick();

    const cancelButton = Array.from(document.body.querySelectorAll('button'))
      .find(button => button.textContent?.includes('Cancel'));
    expect(cancelButton).toBeTruthy();
    cancelButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    await nextTick();

    expect(wrapper.emitted('cancel')).toHaveLength(1);
    expect(document.body.querySelector('.p-dialog')).toBeFalsy();

    wrapper.unmount();
  });

  test('emits cancel when dialog visibility is dismissed', async () => {
    const wrapper = mountModal();

    wrapper.vm.show();
    await nextTick();

    const dialog = wrapper.findComponent({ name: 'Dialog' });
    dialog.vm.$emit('update:visible', false);

    await nextTick();

    expect(wrapper.emitted('cancel')).toHaveLength(1);
    expect(document.body.querySelector('.p-dialog')).toBeFalsy();

    wrapper.unmount();
  });
});
