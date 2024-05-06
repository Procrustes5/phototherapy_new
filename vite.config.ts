import path from 'path';
import { defineConfig } from 'vite';
import FullReload from 'vite-plugin-full-reload';
import AutoImport from 'unplugin-auto-import/vite';

import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    FullReload(['src/**/*'], { delay: 100 }),

    // vue
    vue(),
    // element-plus
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, /\.vue\?vue/, // .vue
      ],
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'vue/macros',
      ],
    }),
  ],
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@style': path.resolve(__dirname, 'src/assets/stylesheets'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@view': path.resolve(__dirname, 'src/views'),
      '@app': path.resolve(__dirname, 'src/views/app'),
      '@pages': path.resolve(__dirname, 'src/views/pages'),
      '@store': path.resolve(__dirname, 'src/stores'),
    },
  },
  test: {
    global: true,
    server: {
      deps: {
        inline: ['element-plus'],
      },
    },
  }
});
