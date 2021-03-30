const webpack = require('webpack')
const version = process.env.VERSION || require('../package.json').version

const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const libraryTargetList = ['umd', 'common']

const genBundle = function(libraryTarget = '') {
  let finalTarget = 'web'
  let finalLibraryTarget = 'umd'
  const plugins = [
    new webpack.BannerPlugin(`\n * @preserve\n * @MrHanson/react-listview v${version}\n`)
  ]

  if (libraryTarget.indexOf('umd') >= 0) {
    finalLibraryTarget = 'umd'
  } else if (libraryTarget.indexOf('common') >= 0) {
    finalTarget = 'node'
    finalLibraryTarget = 'commonjs2'
    plugins.push(new BundleAnalyzerPlugin())
  }

  return {
    target: finalTarget,
    entry: path.join(__dirname, '../src/listview'),
    mode: 'production',
    output: {
      filename: `react-listview.${libraryTarget}.js`,
      library: 'react-listview',
      libraryTarget: finalLibraryTarget,
      path: path.join(__dirname, '../dist')
    },
    plugins
  }
}

const configProdList = libraryTargetList.map(libraryTarget =>
  merge(common, genBundle(libraryTarget))
)

module.exports = configProdList
