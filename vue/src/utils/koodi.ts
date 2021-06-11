import { v4 as genUuid } from 'uuid';

export function generateTemporaryKoodiUri(koodisto: string) {
  return 'temporary_' + koodisto + '_' + genUuid();
}
