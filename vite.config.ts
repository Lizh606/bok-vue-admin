import vue from "@vitejs/plugin-vue"
import autoprefixer from "autoprefixer"
import { fileURLToPath, URL } from "node:url"
import tailwindcss from "tailwindcss"
import AutoImport from "unplugin-auto-import/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import { defineConfig } from "vite"
// https://vitejs.dev/config/
export default defineConfig({
  base: "/admin/",
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  },
  server: {
    port: 9096,
    cors: true, // 允许跨域
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  build: {
    // 启用压缩
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // 移除console
        drop_debugger: true // 移除debugger
      }
    },
    // 分块打包
    rollupOptions: {
      output: {
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: "[ext]/[name]-[hash].[ext]",
        // 分包配置
        manualChunks: {
          "vue-vendor": ["vue", "vue-router", "pinia"],
          "element-plus": ["element-plus"]
        }
      }
    },
    // 启用 gzip 压缩
    reportCompressedSize: false,
    // 设置打包文件大小警告阈值
    chunkSizeWarningLimit: 2000
  }
})
