import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  plugins: [
    vue(),
    // vueDevTools()
  ],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'FormMakingV3',
      fileName: (format) => `form-making-v3.${format}.js`,
      formats: ['umd', 'es' ],
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        // ecma: 2015,
        // keep_infinity: true,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    },
    cssCodeSplit: false,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'element-plus', 'jspdf', 'html2canvas', 'ant-design-vue', 'vant'],
      output: {
        exports: 'named',
        assetFileNames: `index.[ext]`,
        manualChunks: undefined,
        inlineDynamicImports: true,
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          'jspdf': 'jspdf',
          'html2canvas': 'html2canvas',
          'ant-design-vue': 'antDesignVue',
          'vant': 'vant'
        }
      }
    }
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
  }
})
