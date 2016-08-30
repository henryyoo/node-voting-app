var webpack = require('webpack');

module.exports = {
  entry: [
    './app/core.js'
  ],
  debug: true,
  devtool: "#eval-source-map",
  resolve: {
    extensions: ['', '.js']
  },
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  }
};
