const { merge } = require('webpack-merge');
const prodWebpackConfig = require('./node_modules/vuestro/build/webpack.prod.config');

module.exports = merge(prodWebpackConfig, {
  output: {
     publicPath: '/volante-dashboard/',
  },
});