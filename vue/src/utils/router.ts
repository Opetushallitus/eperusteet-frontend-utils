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
      if (_.isArray(record.meta.cacheBy)) {
        const key = _.pick(to.params, record.meta.cacheBy);
        if (record.meta._cache && _.isEqual(key, record.meta._cache)) {
          const defaultProps = _.get(record as any, 'props.default', {});
          props = {
            ...props,
            ...defaultProps,
          };
          continue;
        }
        else {
          record.meta._cache = key;
        }
      }

      if (_.isFunction(record.meta.props)) {
        const recordParams = await record.meta.props(to);
        props = {
          ...recordParams,
          ...props,
        };
      }

      const defaultProps = _.get(record as any, 'props.default', {});
      record.props = {
        ..._.get(record as any, 'props', {}),
        default: {
          ...defaultProps,
          ...props,
        },
      };
    }
    next();
  });
});
