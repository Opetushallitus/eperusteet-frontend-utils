import VueRouter from 'vue-router';
import _ from 'lodash';


/**
 * Resolves async props from route's meta object
 * and pass those to childroutes.
 */
export const attachRouterMetaProps = _.once((router: VueRouter) => {
  router.beforeEach(async (to, from, next) => {
    let props = {};

    for (const record of to.matched) {
      if (_.isObject(record.meta.resolve)) {
        if (_.isArray(record.meta.resolve.cacheBy)) {
          const key = _.pick(to.params, record.meta.resolve.cacheBy);
          if (record.meta.resolve._cache && _.isEqual(key, record.meta.resolve._cache)) {
            props = _.merge(props, record.props);
            continue;
          }
          else {
            record.meta.resolve._cache = key;
          }
        }

        if (_.isFunction(record.meta.resolve.props)) {
          const resolvedProps = await record.meta.resolve.props(to, props);
          if (!resolvedProps.default) {
            throw new Error('Default component props are missing: ' + record.name);
          }
          props = _.merge(resolvedProps, props);
        }
        else {
          throw new Error('Resolve is missing props: ' + record.name);
        }
      }

      record.props = _.merge(record.props, props);
    }
    next();
  });
});
