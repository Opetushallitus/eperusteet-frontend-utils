import Vue from 'vue';
import _ from 'lodash';
import { reactive, computed } from 'vue';
import { computedValue } from '@shared/utils/interfaces';

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
  public readonly scrollY = computedValue(() => state.scrollY);
  public readonly window = computedValue(() => state.window);
  public readonly focused = computedValue(() => state.focused);
  public readonly activeElement = computedValue(() => state.focused?.target);
  public readonly latestKeypress = computedValue(() => state.latestKeypress);
  public readonly navigationVisible = computedValue(() => state.window.width > 991);

  public static location = Vue.observable({ href: '' });

  public static changeLocation(href: string) {
    BrowserStore.location.href = href;
  }
}
