import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/firsT_contract_front_end/',
  build: {
    chunkSizeWarningLimit: 2000
  }
});