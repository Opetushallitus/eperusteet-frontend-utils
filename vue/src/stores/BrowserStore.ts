import Vue from 'vue';
import _ from 'lodash';
import { computed, reactive, ref } from '@vue/reactivity';

const state = ref({
  window: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scrollY: 0,
  focused: null as FocusEvent | null,
  latestKeypress: null as any | null,
});

document.addEventListener('scroll', (ev) => {
  state.value.scrollY = window.pageYOffset;
});

window.addEventListener('resize', (ev) => {
  const { innerWidth, innerHeight } = ev.target as any;
  state.value.window.width = innerWidth;
  state.value.window.height = innerHeight;
});

document.addEventListener('focusin', (ev) => {
  if (ev.target) {
    state.value.focused = ev as any;
  }
});

document.addEventListener('focusout', (ev) => {
  state.value.focused = null;
});

document.addEventListener('keyup', (ev) => {
  if (!ev) {
    return;
  }

  const press = _.pick(ev, 'ctrlKey', 'code', 'shiftKey', 'type', 'keyCode');
  state.value.latestKeypress = press;
});

export class BrowserStore {
  public readonly scrollY = computed(() => state.value.scrollY);
  public readonly window = computed(() => state.value.window);
  public readonly focused = computed(() => state.value.focused);
  public readonly activeElement = computed(() => state.value.focused?.target);
  public readonly latestKeypress = computed(() => state.value.latestKeypress);
  public readonly navigationVisible = computed(() => state.value.window.width > 991);

  public static location = reactive({ href: '' });

  public static changeLocation(href: string) {
    BrowserStore.location.href = href;
  }
}
