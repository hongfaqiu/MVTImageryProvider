import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const external = [
  'cesium',
]

const plugins = [
  commonjs(),
  esbuild({
    target: 'node14',
  }),
  resolve(),
]

export default defineConfig([
  {
    input: 'src/index.ts',
    output: {
      dir: 'lib',
      format: 'esm',
      entryFileNames: '[name].js',
      chunkFileNames: 'chunk-[name].js',
    },
    external,
    plugins,
    onwarn,
  },
  {
    input: 'src/index.ts',
    output: {
      dir: 'lib',
      entryFileNames: '[name].d.ts',
      format: 'esm',
    },
    external,
    plugins: [
      dts({ respectExternal: true }),
    ],
    onwarn,
  },
])

function onwarn(message) {
  if (['EMPTY_BUNDLE', 'CIRCULAR_DEPENDENCY'].includes(message.code))
    return
  console.error(message)
}