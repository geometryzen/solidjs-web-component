import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import peer_deps_external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import package_json from './package.json' assert { type: 'json' };

/**
* Comment with library information to be appended in the generated bundles.
*/
const banner = `/**
* ${package_json.name} ${package_json.version}
* (c) ${package_json.author.name} ${package_json.author.email}
* Released under the ${package_json.license} License.
*/
`.trim();

const extensions = [".js", ".ts", ".jsx", ".tsx"];
const solidOptions = {};
const babelTargets = /*pkg.browserslist ||*/ "last 2 years";
const babelOptions = {
    plugins: [
    ]
};

const options =
{
    input: 'src/index.ts',
    output: [
        {
            banner,
            file: './dist/esm/index.js',
            format: 'esm',
            sourcemap: true
        },
        {
            file: package_json.module,
            format: 'esm',
            sourcemap: true,
            plugins: [terser()]
        },
        {
            banner,
            file: './dist/system/index.js',
            format: 'system',
            sourcemap: true
        },
        {
            file: package_json.exports['.'].system,
            format: 'system',
            sourcemap: true,
            plugins: [terser()]
        },
        {
            banner,
            file: package_json.main,
            format: 'commonjs',
            sourcemap: true
        },
        /*
        {
            file: package_json.browser,
            format: 'umd',
            name: 'MYFOOLIB',
            sourcemap: true
        }
        */
    ],
    plugins: [
        commonjs(),
        peer_deps_external(),
        resolve(),
        typescript({ tsconfig: './tsconfig.json', exclude: ['**/*.spec.ts'] }),
        // solidjs: jsx to js
        babel({
            extensions,
            babelHelpers: "bundled",
            presets: [
                ["babel-preset-solid", solidOptions || {}],
                // typescript
                //"@babel/preset-typescript",
                ["@babel/preset-env", { bugfixes: true, targets: babelTargets }],
            ],
            ...babelOptions,
        }),
    ]
};

export default [
    options,
    {
        input: './dist/esm/types/index.d.ts',
        output: [{ file: package_json.types, format: "esm" }],
        plugins: [dts()],
    }
];
