import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
// import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-peer-deps-external';
import pkg from './package.json' assert { type: 'json' };

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
            file: pkg.module,
            format: 'esm',
            sourcemap: true,
            // plugins: [terser()]
        },
        {
            file: './dist/system/index.js',
            format: 'system',
            sourcemap: true,
            // plugins: [terser()]
        }
    ],
    plugins: [
        external(),
        resolve(),
        typescript(),
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
        output: [{ file: pkg.types, format: "esm" }],
        plugins: [dts()],
    }
];
