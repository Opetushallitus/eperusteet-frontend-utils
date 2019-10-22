import _ from 'lodash';
import { Kielet } from '../stores/kieli';
import { Kieli } from '../tyypit';


/**
 * Resolves async props from route's meta object
 * and pass those to childroutes.
 */
export async function resolveRouterMetaProps(to) {
  let props = {};

  for (const record of to.matched) {
    if (_.isObject(record.meta.resolve)) {
      if (_.isArray(record.meta.resolve.cacheBy)) {
        const key = _.pick(to.params, record.meta.resolve.cacheBy);
        if (record.meta.resolve._cache && _.isEqual(key, record.meta.resolve._cache)) {
          props = _.merge(props, record.props);
          continue;
        } else {
          record.meta.resolve._cache = key;
        }
      }

      if (_.isFunction(record.meta.resolve.props)) {
        const resolvedProps = await record.meta.resolve.props(to, props);
        if (!resolvedProps.default) {
          throw new Error('Default component props are missing: ' + record.name);
        }
        props = _.merge(resolvedProps, props);
      } else {
        throw new Error('Resolve is missing props: ' + record.name);
      }
    }

    record.props = _.merge(record.props, props);
  }
}

/**
 * Change page title and HTML lang if language changes
 */
export function changeTitleAndLang(to) {
  let kieli = to.params.lang || Kieli.fi;
  Kielet.setUiKieli(kieli);
  Kielet.setSisaltoKieli(kieli);
  document.title = Kielet.t('eperusteet') as string;
  document.documentElement.setAttribute('lang', kieli);
}
