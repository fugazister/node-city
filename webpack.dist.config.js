/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

'use strict';

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer-core');
var csswring = require('csswring');

module.exports = {

  output: {
    publicPath: 'assets/',
    path: 'dist/assets/',
    filename: 'bundle.js'
  },

  debug: false,
  devtool: false,
  entry: {
      app: './app/scripts/main.js'
  },

  stats: {
    colors: true,
    reasons: false
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
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
    defaults: [autoprefixer, csswring]
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ],
};
