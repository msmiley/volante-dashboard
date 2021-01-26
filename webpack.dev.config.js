const webpack = require('webpack');
const { merge } = require('webpack-merge');
const devWebpackConfig = require('./node_modules/vuestro/build/webpack.dev.config');

module.exports = merge(devWebpackConfig, {
  entry: {
    app: ['./src/index.js', 'webpack-hot-middleware/client?reload=true'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
});