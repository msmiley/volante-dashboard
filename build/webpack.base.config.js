const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.join(__dirname, '..', 'src'),
      'static': path.join(__dirname, '..', 'static')
    }
  },
  output: {
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]',
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:7].[ext]',
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      Vue: ['vue/dist/vue.esm.js', 'default'],
      Vuex: ['vuex/dist/vuex.esm.js', 'default'],
      _: 'lodash',
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(JSON.parse(fs.readFileSync('package.json')).version),
    }),
  ]
};
