import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 3000,
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './src'),
        },
    },
    plugins: [react(), eslint()],
    test: {
        environment: 'jsdom',
        globals: true, // Enables global access to Vitest APIs like `describe`, `it`, `expect`
        setupFiles: ['./src/test/setupTests.js', './src/test/mocks.js'],
    },
});
