/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpak-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */

'use strict';

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer-core');
var csswring = require('csswring');

module.exports = {

  output: {
    filename: 'bundle.js',
    publicPath: '/assets/'
  },

  cache: true,
  debug: true,
  devtool: false,
  entry: {
      webpack: 'webpack/hot/only-dev-server',
      app: './app/scripts/main.js'
  },

  stats: {
    colors: true,
    reasons: true
  },

  resolve: {
    extensions: ['', '.js']
  },

  module: {
    preLoaders: [{
      test: '\\.js$',
      exclude: 'node_modules',
      loader: 'jshint'
    }],
    loaders: [{
      test: /\.less/,
      loader: 'style-loader!css-loader!postcss-loader!less-loader'
    },
    // {
    //   test: /\.css$/,
    //   loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader?pack=vendor')
    // },
    {
      test: /\.(png|jpg|svg)$/,
      loader: 'url-loader?limit=8192'
    }]
  },

  postcss: {
    defaults: [autoprefixer, csswring({preserveHacks: true})]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]

};
