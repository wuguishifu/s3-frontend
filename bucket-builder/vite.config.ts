import { exec } from 'child_process';

import react from '@vitejs/plugin-react';
import path from 'path';
import { NormalizedInputOptions } from 'rollup';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    {
      name: "electron-main",
      async buildStart(options: NormalizedInputOptions) {
        if (command === 'build') return;
        exec('npm run dev:electron');
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
}));