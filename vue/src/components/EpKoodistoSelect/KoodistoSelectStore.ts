import { Page } from '../../tyypit';
import { KoodistoKoodiDto, Koodisto } from '../../api/eperusteet';
import { computed, ref } from 'vue';
import { reactive } from 'vue';
import { debounced } from '../../utils/delay';
import { Kielet } from '../../stores/kieli';

/**
 * Centralized wrapper for Koodisto.kaikkiSivutettuna with common parameters
 * @param koodisto - The koodisto name
 * @param query - Search query string
 * @param sivu - Page number (default: 0)
 * @param options - Optional parameters
 * @param options.sivukoko - Page size (default: 10)
 * @returns Promise with koodisto page data
 */
export async function getKoodistoSivutettuna(
  koodisto: string,
  query: string,
  sivu = 0,
  options: { sivukoko?: number } = {},
) {
  const { sivukoko = 10 } = options;

  const params: any = {
    sivu,
    sivukoko,
    kieli: Kielet.getSisaltoKieli.value,
  };

  return (await Koodisto.kaikkiSivutettuna(koodisto, query, { params })).data;
}

export interface IKoodisto {
  koodisto: string;
  query: (query: string, sivu: number, koodisto: string, vainVoimassaolevat?: boolean) => Promise<Page<KoodistoKoodiDto>>;
}

export class KoodistoSelectStore {
  public readonly state = reactive({
    data: null as Page<KoodistoKoodiDto> | null,
  });

  public readonly data = computed(() => this.state.data);
  public readonly koodisto = computed(() => this.config.koodisto);

  constructor(private config: IKoodisto) {
  }

  public clear = () => {
    this.state.data = null;
  };

  public query = async (query: string = '', sivu = 0, onlyValidKoodis = true) => {
    this.clear();
    const result = await this.config.query(query, sivu, this.config.koodisto, onlyValidKoodis);
    this.state.data = result as any;
  };
}
