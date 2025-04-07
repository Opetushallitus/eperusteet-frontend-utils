import Vue from 'vue';
import _ from 'lodash';
import { reactive, computed } from 'vue';

const state = reactive({
  window: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scrollY: 0,
  focused: null as FocusEvent | null,
  latestKeypress: null as any | null,
});

document.addEventListener('scroll', (ev) => {
  state.scrollY = window.pageYOffset;
});

window.addEventListener('resize', (ev) => {
  const { innerWidth, innerHeight } = ev.target as any;
  state.window.width = innerWidth;
  state.window.height = innerHeight;
});

document.addEventListener('focusin', (ev) => {
  if (ev.target) {
    state.focused = ev as any;
  }
});

document.addEventListener('focusout', (ev) => {
  state.focused = null;
});

document.addEventListener('keyup', (ev) => {
  if (!ev) {
    return;
  }

  const press = _.pick(ev, 'ctrlKey', 'code', 'shiftKey', 'type', 'keyCode');
  state.latestKeypress = press;
});

export class BrowserStore {
  public readonly scrollY = computed(() => state.scrollY);
  public readonly window = computed(() => state.window);
  public readonly focused = computed(() => state.focused);
  public readonly activeElement = computed(() => state.focused?.target);
  public readonly latestKeypress = computed(() => state.latestKeypress);
  public readonly navigationVisible = computed(() => state.window.width > 991);

  public static location = Vue.observable({ href: '' });

  public static changeLocation(href: string) {
    BrowserStore.location.href = href;
  }
}
