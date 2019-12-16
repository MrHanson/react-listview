const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common')

const config = {
  entry: path.join(__dirname, '../src/index'),
  mode: 'production',
  output: {
    path: path.join(__dirname, '../dist')
  },
  plugins: [new CleanWebpackPlugin()]
}

module.exports = merge(common, config)
