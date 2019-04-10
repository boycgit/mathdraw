const rewireMobX = require('react-app-rewire-mobx');
const rewireLess = require('react-app-rewire-less');
const rewireStyledComponents = require('react-app-rewire-styled-components');
const rewireLodash = require('react-app-rewire-lodash');

const { compose, injectBabelPlugin } = require('react-app-rewired');

/* config-overrides.js */
module.exports = function override(config, env) {
  const rewired = compose(
    rewireLodash,
    rewireStyledComponents,
    rewireLess,
    rewireMobX
  );
  config = injectBabelPlugin(['syntax-dynamic-import'], config);
  config = rewired(config, env);
  return config;
};
