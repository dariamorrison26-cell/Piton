import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        products: resolve(__dirname, 'products.html'),
        clients: resolve(__dirname, 'clients.html'),
        contact: resolve(__dirname, 'contact.html'),
        coolingTowerFans: resolve(__dirname, 'products/cooling-tower-fans.html'),
        fanImpellers: resolve(__dirname, 'products/fan-impellers.html'),
        diffusers: resolve(__dirname, 'products/diffusers.html'),
        airCoolingFans: resolve(__dirname, 'products/air-cooling-fans.html'),
        electricMotors: resolve(__dirname, 'products/electric-motors.html'),
      },
    },
  },
});
