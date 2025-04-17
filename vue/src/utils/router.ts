import _ from 'lodash';
import { Kielet } from '../stores/kieli';
import { Kieli } from '../tyypit';
import { createLogger } from './logger';
import { Virheet } from '@shared/stores/virheet';

/**
 * Resolves async props from route's meta object
 * and pass those to childroutes.
 */

const logger = createLogger('resolveRouterMetaProps');

/**
 * Change language changes
 */
export function changeLang(to, from) {
  const fromKieli = from.params.lang || Kieli.fi;
  const toKieli = to.params.lang || Kieli.fi;

  if (fromKieli !== toKieli) {
    Kielet.setUiKieli(toKieli);
    Kielet.setSisaltoKieli(toKieli);
  }
}

export function removeQueryParam(to, router, queryParam) {
  if (_.has(to.query, queryParam)) {
    const toquery = _.omit(to.query, queryParam);
    router.push({ query: toquery });
  }
}
