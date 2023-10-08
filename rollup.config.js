import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/main.js', // Replace with your entry file path
    output: {
        file: 'public/bundle.js', // Output bundle file path
        format: 'iife',
    },
    plugins: [
        svelte({
            // Configuration options for Svelte
        }),
        resolve(),
        commonjs(),
    ],
};
