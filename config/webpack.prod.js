const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const version = process.env.VERSION || require('./package.json').version

const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common')

const config = {
  entry: path.join(__dirname, '../src/listview'),
  mode: 'production',
  output: {
    filename: 'react-listview.umd.js',
    library: 'react-listview.umd.js',
    libraryTarget: 'umd',
    path: path.join(__dirname, '../dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin(`\n * @preserve\n * @MrHanson/vue-file-preview v${version}\n`)
  ]
}

module.exports = merge(common, config)
