const path = require('path')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const config = {
  resolve: {
    extensions: ['.ts', '.tsx', '.jsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts)x?$/,
        use: { loader: 'babel-loader', options: { babelrc: true } }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: [
          'style-loader' /* creates style nodes from JS strings */,
          'css-loader' /* translates CSS into CommonJS */,
          'less-loader' /* compiles Less to CSS */
        ]
      }
    ]
  },
  plugins: [
    new LodashModuleReplacementPlugin({
      collections: true,
      shorthands: true
    })
  ]
}

module.exports = config
