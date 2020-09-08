import sourcemaps from 'rollup-plugin-sourcemaps';
import commonjs from '@rollup/plugin-commonjs';
import ts from '@wessberg/rollup-plugin-ts';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import smartAsset from 'rollup-plugin-smart-asset';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import { upperFirst, camelCase, template } from 'lodash';
import pkg from './package.json';

const { main, module, unpkg, browser } = pkg;
// eslint-disable-next-line max-len
const formatModule = name => upperFirst(camelCase(name.indexOf('@') !== -1 ? name.split('/')[1] : name));
const yearRange = date => (new Date().getFullYear() === +date ? date : `${date} - ${new Date().getFullYear()}`);
const year = yearRange(pkg.since || new Date().getFullYear());
const name = formatModule(pkg.name);
/* eslint-disable */
const banner = template(`
/**
 * <%= p.nameFormatted %> (<%= p.name %> v<%= p.version %>)
 * <%= p.description %>
 * <%= p.homepage %>
 * (c) <%= p.year %> <%= p.author %>
 * @license <%= p.license || "MIT" %>
 */
/* eslint-disable */`, { variable: "p" })({ ...pkg, nameFormatted: name, year }).trim();
/* eslint-enable */

const outputs = [
  { format: 'cjs', file: main },
  { format: 'umd', file: unpkg },
  { format: 'esm', file: module },
  { format: 'iife', file: browser },
].filter(it => it);

export default {
  input: 'index.ts',
  output: outputs.map(({ format, file }) => ({
    exports: 'named',
    sourcemap: true,
    file,
    format,
    name,
    banner,
  })),
  watch: {
    include: ['src/**/*', 'example/**/*'],
  },
  plugins: [
    sourcemaps(),
    commonjs(),
    nodeResolve(),
    json({ compact: true }),
    smartAsset({ include: ['**/*.{css,png}'], url: 'inline' }),
    ts({ tsconfig: 'tsconfig.json' }),
    // eslint-disable-next-line max-len
    terser({ output: { comments: (node, comment) => /@preserve|@license|@cc_on/i.test(comment.value) } }),
    copy({
      targets: [{
        src: 'node_modules/leaflet/dist/images',
        dest: 'dist/images',
      }],
    }),
  ],
};
