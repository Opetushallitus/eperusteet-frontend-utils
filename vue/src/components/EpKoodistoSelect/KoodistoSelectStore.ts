import VueCompositionApi, { computed, reactive } from '@vue/composition-api';
import { Computed } from '../../utils/interfaces';
import { Page } from '../../tyypit';
import { Koodisto, KoodistoKoodiDto } from '../../api/eperusteet';
import { Debounced } from '../../utils/delay';

export interface IKoodisto {
  query: (query: string, sivu?: number, vainVoimassaolevat?: boolean) => Promise<Page<KoodistoKoodiDto>>;
}

export class KoodistoSelectStore {
  public readonly state = reactive({
    data: null as Page<KoodistoKoodiDto> | null,
  });

  public readonly data = computed(() => this.state.data);

  constructor(private config: IKoodisto) {
  }

  @Debounced(300)
  public async query(query: string = '', sivu = 0, onlyValidKoodis = true) {
    const result = await this.config.query(query, sivu, onlyValidKoodis);
    this.state.data = result as any;
  }
}
