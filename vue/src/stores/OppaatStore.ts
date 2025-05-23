import Vue from 'vue';
import VueCompositionApi, { reactive, computed } from '@vue/composition-api';
import { PerusteHakuDto, findAllOppaat, OppaatQuery } from '@shared/api/eperusteet';
import _ from 'lodash';
import { Page } from '@shared/tyypit';
import { Debounced, DEFAULT_PUBLIC_WAIT_TIME_MS } from '@shared/utils/delay';

Vue.use(VueCompositionApi);

export class OppaatStore {
  private state = reactive({
    oppaat: null as Page<PerusteHakuDto> | null,
  });

  public readonly oppaat = computed(() => this.state.oppaat);

  @Debounced(DEFAULT_PUBLIC_WAIT_TIME_MS)
  public async fetch(query: OppaatQuery) {
    this.state.oppaat = null;
    this.state.oppaat = (await findAllOppaat(query)).data as Page<PerusteHakuDto>;
  }
}
