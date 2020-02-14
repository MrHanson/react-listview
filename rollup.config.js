import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import typescript from '@rollup/plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'
import visualizer from 'rollup-plugin-visualizer'

const version = process.env.VERSION || require('./package.json').version
const banner = '/**\n' + ' * @preserve\n' + ` * @mrhanson/listview v${version}\n` + ' */'

const commonConfig = {
  input: 'src/listview.tsx',
  external: ['vue'],
  plugins: [
    resolve(),
    commonjs(),
    babel(),
    typescript({
      typescript: require('typescript')
    })
  ]
}

if (process.env.REPORT !== undefined) {
  commonConfig.plugins.push(
    visualizer({
      filename: 'dist/report.html',
      template: 'treemap'
    })
  )
}

export default [
  {
    ...commonConfig,
    output: {
      format: 'cjs',
      file: 'dist/listview.common.js',
      banner
    }
  },
  {
    ...commonConfig,
    output: {
      format: 'umd',
      globals: { vue: 'Vue' },
      file: 'dist/listview.umd.js',
      name: 'listview',
      banner
    }
  },
  {
    ...commonConfig,
    output: {
      format: 'umd',
      globals: { vue: 'Vue' },
      file: 'dist/listview.umd.min.js',
      name: 'listview',
      banner
    },
    plugins: [
      ...commonConfig.plugins,
      uglify({
        output: {
          // https://github.com/TrySound/rollup-plugin-uglify#comments
          comments: function(node, comment) {
            if (comment.type === 'comment2') {
              return /@preserve|@license|@cc_on/i.test(comment.value)
            }
            return false
          }
        }
      })
    ]
  }
]
