import _ from 'lodash';
export default {
  get: (key) => {
    return _.get({
      consume: {
        defaults: {
          prefetchCount: 1
        }
      },
    }, key);
  }
};
