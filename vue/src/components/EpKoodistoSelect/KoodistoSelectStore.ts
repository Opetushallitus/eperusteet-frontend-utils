import VueCompositionApi, { computed, reactive } from '@vue/composition-api';
import { Computed } from '../../utils/interfaces';
import { Page } from '../../tyypit';
import { Koodisto, KoodistoKoodiDto } from '../../api/eperusteet';
import { Debounced } from '../../utils/delay';

export interface IKoodisto {
  query: (query: string, sivu?: number) => Promise<Page<KoodistoKoodiDto>>;
}

export class KoodistoSelectStore {
  private state = reactive({
    data: null as Page<KoodistoKoodiDto> | null,
  });

  public readonly data = computed(() => this.state.data);

  constructor(private config: IKoodisto) {
  }

  @Debounced(300)
  public async query(query: string = '', sivu = 0) {
    const result = await this.config.query(query, sivu);
    this.state.data = result as any;
  }
}
