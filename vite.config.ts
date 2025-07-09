import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/search_12306': {
        target: 'https://search.12306.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/search_12306/, ''),
        // 如果需要处理cookie可以添加：
        cookieDomainRewrite: "localhost",
        cookiePathRewrite: {
          '/search_12306': '/search_12306'
        }
      },
      '/kyfw_12306': {
        target: 'https://kyfw.12306.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kyfw_12306/, ''),
        secure: false,
        // 如果需要处理cookie可以添加：
        cookieDomainRewrite: "localhost",
        cookiePathRewrite: {
          '/kyfw_12306': '/kyfw_12306'
        },
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
          });
        },
      },
      '/www_12306': {
        target: 'https://www.12306.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/www_12306/, ''),
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // 设置 CORS 相关头
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          });
        },
      },
      '/api': {
        target: 'http://hw.57d02.cn:5000/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  }
})
