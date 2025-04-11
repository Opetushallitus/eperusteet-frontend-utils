import { Page } from '../../tyypit';
import { KoodistoKoodiDto } from '../../api/eperusteet';
import { Debounced } from '../../utils/delay';
import { reactive, computed } from 'vue';
import { computedValue } from '@shared/utils/interfaces';

export interface IKoodisto {
  koodisto: string;
  query: (query: string, sivu: number, koodisto: string, vainVoimassaolevat?: boolean) => Promise<Page<KoodistoKoodiDto>>;
}

export class KoodistoSelectStore {
  public readonly state = reactive({
    data: null as Page<KoodistoKoodiDto> | null,
  });

  public readonly data = computedValue(() => this.state.data);
  public readonly koodisto = computedValue(() => this.config.koodisto);

  constructor(private config: IKoodisto) {
  }

  @Debounced(300)
  public async query(query: string = '', sivu = 0, onlyValidKoodis = true) {
    const result = await this.config.query(query, sivu, this.config.koodisto, onlyValidKoodis);
    this.state.data = result as any;
  }
}
