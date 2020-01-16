const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./webpack.common')

const config = {
  entry: path.join(__dirname, '../dev/app.tsx'),
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  mode: 'development',
  devtool: 'eval',
  devServer: {
    hot: true,
    port: 9900,
    disableHostCheck: true,
    overlay: {
      errors: true
    },
    before: require('../tests/mock')
  }
}

module.exports = merge(common, config)
