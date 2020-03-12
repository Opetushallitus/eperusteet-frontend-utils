import Vue from 'vue';
import VueCompositionApi, { reactive, computed } from '@vue/composition-api';
import { NavigationNodeDto, PerusteprojektiDto, PerusteDto, Ulkopuoliset, Perusteprojektit, Perusteet } from '@shared/api/eperusteet';
import _ from 'lodash';

Vue.use(VueCompositionApi);

export class BrowserStore {
  private state = reactive({
    scrollY: 0,
    focused: null as FocusEvent | null,
    latestKeypress: null as any | null,
  });

  public readonly scrollY = computed(() => this.state.scrollY);
  public readonly focused = computed(() => this.state.focused);
  public readonly activeElement = computed(() => this.state.focused?.target);
  public readonly latestKeypress = computed(() => this.state.latestKeypress);

  constructor() {
    document.addEventListener('scroll', (ev) => {
      this.state.scrollY = window.pageYOffset;
    });

    document.addEventListener('focusin', (ev) => {
      if (ev.target) {
        this.state.focused = ev as any;
      }
    });

    document.addEventListener('focusout', (ev) => {
      this.state.focused = null;
    });

    document.addEventListener('keyup', (ev) => {
      if (!ev) {
        return;
      }

      const press = _.pick(ev, 'ctrlKey', 'code', 'shiftKey', 'type', 'keyCode');
      this.state.latestKeypress = press;
    });

  }
}
