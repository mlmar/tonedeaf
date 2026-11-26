import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import { fileURLToPath } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 3000,
    },
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    plugins: [react(), eslint()],
    test: {
        environment: 'jsdom',
        globals: true, // Enables global access to Vitest APIs like `describe`, `it`, `expect`
        setupFiles: ['./src/test/setupTests.js', './src/test/mocks.js'],
    },
    build: {
        outDir: '../tonedeaf-express/public',
        emptyOutDir: true,
    },
});
