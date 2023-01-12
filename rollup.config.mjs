import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';

/**
 * @type {import('rollup').RollupOptions}
 */
const options =
{
    input: {
        'index': './es2015/index.js'
    },
    output: [
        {
            dir: './system',
            format: 'system',
            sourcemap: true,
            plugins: [terser()]
        }
    ],
    plugins: [
        external(),
        resolve()
    ]
};

export default [
    options
];
