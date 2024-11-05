import { defineConfig } from 'tsup';

export default defineConfig({
    format: ['esm'],
    entry: ['./src/index.ts'],
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,
    banner: {
        js: '#!/usr/bin/env node',
    },
    outExtension: ({ format }) => ({
        js: format === 'esm' ? '.mjs' : '.js', // Set `.mjs` extension for ESM
    }),
});
