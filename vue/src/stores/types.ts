import { Computed } from '@shared/utils/interfaces';
import { TiedoteDto } from '@shared/api/eperusteet';
import { TiedoteQuery } from '@shared/api/types';
import { Page } from '@/tyypit';

export interface ITiedotteetProvider {
  options: Computed<TiedoteQuery>;
  tiedotteet: Computed<TiedoteDto[]>;
  kokonaismaara: Computed<number>;
  isLoading: Computed<boolean>;
  init: (options: TiedoteQuery) => Promise<void>;
  fetch: () => Promise<void>;
  search: (query: TiedoteQuery) => Promise<Page<TiedoteDto>>;
  save?: (tiedote: TiedoteDto) => Promise<void>;
  delete?: (tiedote: TiedoteDto) => Promise<void>;
}
