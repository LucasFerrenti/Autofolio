import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

const buildTimestamp = Date.now();
const buildIsoTime = new Date().toISOString();

// Plugin to inject build timestamp & cache headers into index.html
function cacheBusterPlugin(): Plugin {
  return {
    name: 'html-cache-buster',
    transformIndexHtml(html) {
      return html.replace(
        '<head>',
        `<head>\n    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />\n    <meta http-equiv="Pragma" content="no-cache" />\n    <meta http-equiv="Expires" content="0" />\n    <meta name="build-timestamp" content="${buildTimestamp}" />\n    <meta name="build-time" content="${buildIsoTime}" />`
      );
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), cacheBusterPlugin()],
    define: {
      __BUILD_TIMESTAMP__: JSON.stringify(buildTimestamp.toString()),
      __BUILD_TIME__: JSON.stringify(buildIsoTime),
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name]-[hash]-${buildTimestamp}.js`,
          chunkFileNames: `assets/[name]-[hash]-${buildTimestamp}.js`,
          assetFileNames: `assets/[name]-[hash]-${buildTimestamp}.[ext]`,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
