const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./webpack.common')

const config = {
  entry: path.join(__dirname, '../dev/app'),
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    })
  ],
  mode: 'development',
  devtool: 'eval',
  devServer: {
    port: 9900,
    disableHostCheck: true,
    before: require('../tests/mock')
  }
}

module.exports = merge(common, config)
