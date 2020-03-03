import { Computed } from '@shared/utils/interfaces';
import { TiedoteDto } from '@shared/api/eperusteet';

export interface ITiedotteetProvider {
  tiedotteet: Computed<TiedoteDto[]>;
  perusteenTiedotteet: Computed<TiedoteDto[]>;
  perusteId: Computed<number>;
  init: (perusteId: number) => Promise<void>;
  fetch: () => Promise<void>;
  save: (tiedote: TiedoteDto) => Promise<void>;
  delete: (tiedote: TiedoteDto) => Promise<void>;
}
