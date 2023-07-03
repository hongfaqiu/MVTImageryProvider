import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium';
export default defineConfig({
  plugins: [cesium()],
  optimizeDeps: {
    exclude: ['mvt-basic-render'],
  },
});