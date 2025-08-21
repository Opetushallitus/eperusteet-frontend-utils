import Vue, { computed, ref } from 'vue';
import { PerusteHakuDto, findAllOppaat, OppaatQuery } from '@shared/api/eperusteet';
import _ from 'lodash';
import { Page } from '@shared/tyypit';
import { debounced } from '@shared/utils/delay';
import { reactive } from 'vue';

export class OppaatStore {
  private state = reactive({
    oppaat: null as Page<PerusteHakuDto> | null,
  });

  public readonly oppaat = computed(() => this.state.oppaat);

  public fetch = debounced(async (query: OppaatQuery) => {
    this.state.oppaat = null;
    this.state.oppaat = (await findAllOppaat(query)).data as Page<PerusteHakuDto>;
  });
}
